import { useEffect, useState, useRef, useCallback } from "react";
import Chart from "chart.js/auto";
import Layout from "./Layout";
import { getPantryRecords } from "../utilities/API_Files/Pantry-API";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import "flatpickr/dist/plugins/monthSelect/style.css";

const COLORS = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2",
  "#59a14f", "#edc948", "#b07aa1", "#ff9da7",
  "#9c755f", "#bab0ab", "#86bc86", "#ffbe7d",
];

function Trends() {
  const [records, setRecords] = useState([]);
  const [currentMode, setCurrentMode] = useState("visits");
  const [currentRange, setCurrentRange] = useState("month");
  const [graphType, setGraphType] = useState("bar");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [insights, setInsights] = useState({
    unique: 0,
    returning: 0,
    total: 0,
    once: 0,
    twice: 0,
    three: 0,
    four: 0,        
    fivePlus: 0,    
    familyTotal: 0,
  });

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  /* =========================
     HELPERS
  ========================= */
function getWednesdaysInMonth(year, month) {
  const dates = [];
  const d = new Date(year, month, 1);

  // Move to first Wednesday
  while (d.getDay() !== 3) { // 3 = Wednesday
    d.setDate(d.getDate() + 1);
  }

  // Collect all Wednesdays
  while (d.getMonth() === month) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }

  return dates;
}

function getFirstWednesday(year, month) {
  const d = new Date(year, month, 1);

  while (d.getDay() !== 3) {
    d.setDate(d.getDate() + 1);
  }

  return d;
}
  /* =========================
     FILTER
  ========================= */

  function filterRecordsBySelection(records) {
    const now = new Date();

    return records.filter((r) => {
      if (!r.created_at) return false;

      const date = new Date(r.created_at);

      //Flatpickr month selection
      if (selectedMonth) {
        return (
          date.getFullYear() === selectedMonth.getFullYear() &&
          date.getMonth() === selectedMonth.getMonth()
        );
      }

      if (currentRange === "month") {
        const year = now.getFullYear();
        const month = now.getMonth();

        const firstWednesday = getFirstWednesday(year, month);

        // Check if ANY record exists on/after first Wednesday of this month
        const hasStartedThisMonth = records.some((rec) => {
          if (!rec.created_at) return false;

          const d = new Date(rec.created_at);
          return (
            d >= firstWednesday &&
            d.getMonth() === month &&
            d.getFullYear() === year
          );
        });

        // If not started → use previous month
        if (!hasStartedThisMonth) {
          const prev = new Date(year, month - 1, 1);

          return (
            date.getMonth() === prev.getMonth() &&
            date.getFullYear() === prev.getFullYear()
          );
        }

        // Otherwise use current month
        return (
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }

      // Rolling 12 months
      if (currentRange === "year") {
        const past = new Date();
        past.setMonth(now.getMonth() - 11);
        return date >= past && date <= now;
      }

      return true;
    });
  }

  /* =========================
     BUILD DATA (FIXED)
  ========================= */

  const buildDataset = useCallback(() => {
    const filtered = filterRecordsBySelection(records);

    let labels = [];
    let visits = [];
    let people = [];

    // Month view
    if (selectedMonth || currentRange === "month") {
      const baseDate = selectedMonth || new Date();

      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();

      const wednesdays = getWednesdaysInMonth(year, month);

      // Labels like "Apr 3", "Apr 10", etc.
      labels = wednesdays.map((d) =>
        d.toLocaleDateString("default", { month: "short", day: "numeric" })
      );

      visits = new Array(wednesdays.length).fill(0);
      people = new Array(wednesdays.length).fill(0);

      filtered.forEach((r) => {
        const d = new Date(r.created_at);

        // Only count Wednesdays
        if (d.getDay() !== 3) return;

        // Find matching Wednesday index
        const index = wednesdays.findIndex(
          (wd) => wd.toDateString() === d.toDateString()
        );

        if (index !== -1) {
          visits[index]++;
          people[index] += r.num_ppl_in_families || 0;
        }
      });
    }

    // ✅ TRUE rolling year
    if (!selectedMonth && currentRange === "year") {
      const now = new Date();

      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

        months.push({
          key: `${d.getFullYear()}-${d.getMonth()}`,
          label: d.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
        });
      }

      labels = months.map((m) => m.label);
      visits = new Array(12).fill(0);
      people = new Array(12).fill(0);

      filtered.forEach((r) => {
        const d = new Date(r.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;

        const index = months.findIndex((m) => m.key === key);
        if (index !== -1) {
          visits[index]++;
          people[index] += r.num_ppl_in_families || 0;
        }
      });
    }

    return { labels, visits, people };
  }, [records, currentRange, selectedMonth]);

  /* =========================
     CHART
  ========================= */

  const renderChart = useCallback(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const data = buildDataset();
    const selected = currentMode === "visits" ? data.visits : data.people;

    chartInstance.current = new Chart(chartRef.current, {
      type: graphType,
      data: {
        labels: data.labels,
        datasets: [
          {
            label: currentMode === "visits" ? "Visits" : "People Served",
            data: selected,
            backgroundColor: COLORS.slice(0, data.labels.length),
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    setTableData(
      data.labels.map((label, i) => ({
        label,
        value: selected[i],
      }))
    );
  }, [buildDataset, currentMode, graphType]);

  /* =========================
     INSIGHTS (UNCHANGED)
  ========================= */

  function updateInsights(filtered) {
    if (!filtered.length) return;

    const visitCounts = {};
    const familyMap = {};

    filtered.forEach((r) => {
      const key = r.name_id;
      if (!key) return;

      visitCounts[key] = (visitCounts[key] || 0) + 1;

      if (!familyMap[key]) {
        familyMap[key] = r.num_ppl_in_families || 0;
      }
    });

    const totalVisits = filtered.length;
    const uniqueVisitors = Object.keys(visitCounts).length;

    const returningVisitors = Object.values(visitCounts).filter(
      (c) => c > 1
    ).length;

    const totalPeople = Object.values(familyMap).reduce(
      (sum, v) => sum + v,
      0
    );

    let once = 0, twice = 0, three = 0, four = 0, fivePlus = 0;

    Object.values(visitCounts).forEach((c) => {
      if (c === 1) once++;
      else if (c === 2) twice++;
      else if (c === 3) three++;
      else if (c === 4) four++;
      else if (c >= 5) fivePlus++;
    });

    setInsights({
      unique: uniqueVisitors,
      returning: returningVisitors,
      total: totalVisits,
      once,
      twice,
      three,
      four,
      fivePlus,
      familyTotal: totalPeople,
    });
  }

  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    async function load() {
      const data = await getPantryRecords();
      setRecords(data);
    }
    load();
  }, []);

  useEffect(() => {
    if (records.length) {
      const filtered = filterRecordsBySelection(records);
      renderChart();
      updateInsights(filtered);
    }
  }, [records, currentMode, currentRange, graphType, selectedMonth, renderChart]);

  /* =========================
     UI (UNCHANGED STRUCTURE)
  ========================= */

  return (
    <Layout>
      <div className="main-grid">
        <div className="main-structure-left">
          <h1>Trends</h1>
          <hr />

          <canvas ref={chartRef}></canvas>

          {/*  Flatpickr Calendar to match the scheduling page */}
          <div style={{ marginTop: "20px" }}>
            <label>Select Month & Year: </label>

            <Flatpickr
              value={selectedMonth}
              options={{
                dateFormat: "Y-m",
                maxDate: new Date(), 
                plugins: [
                  new monthSelectPlugin({
                    shorthand: true,
                    dateFormat: "Y-m",
                    altFormat: "F Y",
                  }),
                ],
              }}
              onChange={(dates) => setSelectedMonth(dates[0])}
            />

            <button className="Trends-clear-btn" onClick={() => setSelectedMonth(null)}>
              Clear
            </button>
          </div>
        </div>

        {/*  RIGHT SIDE  */}
        <div className="main-structure-right">
          <div className="trends-right-grid">
            
            <div className="trends-controls">
              <div className="menu">
                <span className="menu-title">Type of Graph:</span>
                <div className="menu-buttons">
                  <button onClick={() => setGraphType("bar")}>Bar</button>
                  <button onClick={() => setGraphType("line")}>Line</button>
                  <button onClick={() => setGraphType("pie")}>Pie</button>
                </div>
              </div>

              <hr />

              <div className="menu">
                <span className="menu-title">Data Range:</span>
                <div className="menu-buttons">
                  <button onClick={() => setCurrentRange("month")}>Past Month</button>
                  <button onClick={() => setCurrentRange("year")}>Past Year</button>
                </div>
              </div>

              <hr />

              <div className="menu">
                <span className="menu-title">Mode:</span>
                <div className="menu-buttons">
                  <button onClick={() => setCurrentMode("visits")}>Visitors</button>
                  <button onClick={() => setCurrentMode("people")}>People Served</button>
                </div>
              </div>
            </div>

            <div className="trends-insights">
              <h5>Visitor Insights</h5>
              <p>Unique Visitors: {insights.unique}</p>
              <p>Returning Visitors: {insights.returning}</p>
              <p>Total Visits: {insights.total}</p>

              <hr />

              <h5>Visit Frequency</h5>
              <p>Visited Once: {insights.once}</p>
              <p>Visited Twice: {insights.twice}</p>
              <p>Visited 3 Times: {insights.three}</p>
              <p>Visited 4 Times: {insights.four}</p>
              <p>Visited 5+ Times: {insights.fivePlus}</p>

              <hr />

              <h5>Family Impact</h5>
              <p>Total People Served: {insights.familyTotal}</p>
            </div>
          </div>
        </div>

        {/*  TABLE  */}
        <div className="main-structure-bottom">
          <h2>Data Table</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Category</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Trends;