import { useEffect, useState, useRef, useCallback } from "react";
import Chart from "chart.js/auto"; // for charts

import Layout from "./Layout";

// API CALL
import { getPantryRecords } from "../utilities/API_Files/Pantry-API";

import {
  getWeekOfMonth,
  getMonthIndex,
  filterRecords,
  COLORS,
} from "../utilities/Helper_Functions/Trends_Chart_Helpers";

function Trends() {
  const [records, setRecords] = useState([]);
  const [currentMode, setCurrentMode] = useState("visits");
  const [currentRange, setCurrentRange] = useState("month");
  const [graphType, setGraphType] = useState("bar");

  // State for insights to avoid direct DOM manipulation
  const [insights, setInsights] = useState({
    unique: 0,
    returning: 0,
    total: 0,
    once: 0,
    twice: 0,
    three: 0,
    fourPlus: 0,
    familyTotal: 0,
  });

  // State for table data

  const chartRef = useRef(null); // Reference to the <canvas> element
  const chartInstance = useRef(null); // Reference to the actual Chart.js object

  /* =========================
    BUILD DATASETS
  ========================= */
  const buildDataset = useCallback(() => {
    const filtered = filterRecords(records, currentRange);
    let labels, visits, people; // define variables to be used later

    if (currentRange === "month") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      visits = [0, 0, 0, 0];
      people = [0, 0, 0, 0];
      filtered.forEach((r) => {
        const week = getWeekOfMonth(r.created_at);
        if (week < 0 || week > 3) return;
        visits[week] += 1;
        people[week] += r.num_ppl_in_families || 0;
      });
    }
    if (currentRange === "year") {
      labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      visits = new Array(12).fill(0);
      people = new Array(12).fill(0);
      filtered.forEach((r) => {
        const month = getMonthIndex(r.created_at);
        visits[month]++;
        people[month] += r.num_ppl_in_families || 0;
      });
    }

    return {
      labels,
      visits,
      people,
    };
  }, [records, currentRange]);

  const renderChart = useCallback(() => {
    if (!chartRef.current) return; // Return if chart doesn't exist
    // Destroy existing chart to prevent memory leaks/overlap
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const data = buildDataset(currentRange);
    const selectedData = currentMode === "visits" ? data.visits : data.people;
    const label = currentMode === "visits" ? "Visits" : "People Served";

    chartInstance.current = new Chart(chartRef.current.getContext("2d"), {
      type: graphType,
      data: {
        labels: data.labels,
        datasets: [
          {
            label,
            data: selectedData,
            backgroundColor: COLORS,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }, [currentMode, currentRange, graphType, buildDataset]);
  /* =========================
   INSIGHTS (FINAL FIXED)
========================= */
  function updateInsights(records) {
    if (!records.length) return;

    /* =========================
     BUILD VISIT COUNTS
  ========================= */
    const visitCounts = {};
    records.forEach((r) => {
      const key = r.name_id; // use name_id for counting unique visitors instead of public_id
      if (!key) return;
      visitCounts[key] = (visitCounts[key] || 0) + 1;
    });

    /* =========================
     CORE METRICS
  ========================= */
    const totalVisits = records.length;
    const uniqueVisitors = Object.keys(visitCounts).length;

    const returningVisitors = Object.values(visitCounts).filter(
      (count) => count > 1,
    ).length;

    const totalPeople = records.reduce(
      (sum, r) => sum + (r.num_ppl_in_families || 0),
      0,
    );

    /* =========================
     VISIT FREQUENCY
  ========================= */
    let once = 0,
      twice = 0,
      three = 0,
      fourPlus = 0;

    Object.values(visitCounts).forEach((count) => {
      if (count === 1) once++;
      else if (count === 2) twice++;
      else if (count === 3) three++;
      else fourPlus++;
    });

    setInsights({
      unique: uniqueVisitors,
      returning: returningVisitors,
      total: totalVisits,
      once,
      twice,
      three,
      fourPlus,
      familyTotal: totalPeople,
    });
  }

  // Loads records upon page load
  useEffect(() => {
    async function loadRecords() {
      try {
        const data = await getPantryRecords();
        setRecords(data);
      } catch (err) {
        console.error("Failed to load records:", err);
      }
    }
    loadRecords();
  }, []);

  // Runs whenever anything changes
  useEffect(() => {
    if (records.length > 0) {
      renderChart();
      updateInsights(filterRecords(records, currentRange));
    }
  }, [records, currentMode, currentRange, graphType, renderChart]);

  return (
    <>
      <Layout>
        <div className="main-grid">
          <div className="main-structure-left">
            <h1>Trends</h1>
            {/* Mini Menu to choose between different graphs */}
            <hr />
            {/* Graph Container */}
            <canvas ref={chartRef} id="trends-graph"></canvas>
            <br />
            <br />
          </div>
          <div className="main-structure-right">
            <div className="trends-right-grid">
              {/* Controls */}
              <div className="trends-controls">
                <div className="menu choose-graph-type">
                  Type of Graph: <br />
                  <button onClick={() => setGraphType("bar")}>Bar</button>
                  <button onClick={() => setGraphType("line")}>Line</button>
                  <button onClick={() => setGraphType("pie")}>Pie</button>
                </div>

                <div className="menu choose-data-range">
                  Data Range: <br />
                  <button onClick={() => setCurrentRange("month")}>
                    Past Month
                  </button>
                  <button onClick={() => setCurrentRange("year")}>
                    Past Year
                  </button>
                </div>

                <div className="menu choose-visitors-families">
                  Visitors or families helped: <br />
                  <button onClick={() => setCurrentMode("visits")}>
                    Visitors
                  </button>
                  <button onClick={() => setCurrentMode("people")}>
                    People Served
                  </button>
                </div>
              </div>

              <div className="trends-insights">
                {/* Insights */}
                <div className="visitor-insights">
                  <h5>Visitor Insights</h5>
                  <p>Unique Visitors: {insights.unique}</p>
                  <p>Returning Visitors: {insights.returning}</p>
                  <p>Total Visits: {insights.total}</p>
                </div>

                <hr />

                <div className="visit-frequency">
                  <h5>Visit Frequency</h5>
                  <p>Visited Once: {insights.once}</p>
                  <p>Visited Twice: {insights.twice}</p>
                  <p>Visited 3 Times: {insights.three}</p>
                  <p>Visited 4+ Times: {insights.fourPlus}</p>
                </div>

                <hr />

                <div className="family-impact">
                  <h5>Family Impact</h5>
                  <p>Total People Served: {insights.familyTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Trends;
