const api = "http://127.0.0.1:8000/pantry-records/";

/* =========================
   STATE
========================= */
let records = [];
let currentMode = "visits"; // visits | people
let currentRange = "month"; // month | year

let chart;

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  await loadRecords();
  initChart();
  updateDashboard();
});

/* =========================
   FETCH DATA
========================= */
async function loadRecords() {
  try {
    const res = await fetch(api);
    records = await res.json();
  } catch (err) {
    console.error("Error loading records:", err);
    records = [];
  }
}

/* =========================
   DATE HELPERS
========================= */
function getMonthIndex(date) {
  return new Date(date).getMonth(); // 0–11
}

function getWeekOfMonth(date) {
  const d = new Date(date);
  return Math.floor((d.getDate() - 1) / 7); // 0–3
}

/* =========================
   BUILD DATASETS
========================= */
function buildDataset(range) {
  let labels = [];
  let visits = [];
  let people = [];
  const filtered = filterRecordsByRange(records, range);

  if (range === "month") {
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    visits = [0, 0, 0, 0];
    people = [0, 0, 0, 0];

    filtered.forEach((r) => {
      if (!r.created_at) return;

      const week = getWeekOfMonth(r.created_at);
      if (week < 0 || week > 3) return;

      visits[week] += 1;
      people[week] += r.num_ppl_in_families || 0;
    });
  }

  if (range === "year") {
  const now = new Date();

  // reset arrays (DO NOT redeclare)
  labels = [];
  visits = new Array(12).fill(0);
  people = new Array(12).fill(0);

  const months = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    months.push({
      month: d.getMonth(),
      year: d.getFullYear(),
    });

    labels.push(
      d.toLocaleString("default", { month: "short" })
    );
  }

  records.forEach((r) => {
    if (!r.created_at) return;

    const date = new Date(r.created_at);

    months.forEach((m, index) => {
      if (
        date.getMonth() === m.month &&
        date.getFullYear() === m.year
      ) {
        visits[index] += 1;
        people[index] += r.num_ppl_in_families || 0;
      }
    });
  });
}
  return { labels, visits, people };
}

/* =========================
   CHART INIT
========================= */
const COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
  "#86bc86",
  "#ffbe7d",
];

function initChart() {
  const ctx = document.getElementById("trends-graph").getContext("2d");

  const data = buildDataset(currentRange);

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Visits",
          data: data.visits,
          backgroundColor: COLORS.slice(0, data.labels.length),
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
}

/* =========================
   CONTROLS
========================= */
function setMode(mode) {
  if (!["visits", "people"].includes(mode)) return;
  currentMode = mode;
  updateDashboard();
}

function changeRange(range) {
  currentRange = range;
  updateDashboard();
}

function changeGraph(type) {
  chart.config.type = type;
  chart.update();
}
/*=================================

====================================*/
function filterRecordsByRange(records, range) {
  const now = new Date();

  return records.filter((r) => {
    if (!r.created_at) return false;

    const date = new Date(r.created_at);

    if (range === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (range === "year") {
      const past = new Date();
      past.setMonth(now.getMonth() - 11);
      
      return date >= past && date <= now;
    }

    return true;
  });
}

/* =========================
   UPDATE DASHBOARD
========================= */
function updateDashboard() {
  const data = buildDataset(currentRange);

  const selectedData = currentMode === "visits" ? data.visits : data.people;

  const label = currentMode === "visits" ? "Visits" : "People Served";

  chart.data.labels = data.labels;
  chart.data.datasets[0].data = selectedData;
  chart.data.datasets[0].label = label;
  chart.data.datasets[0].backgroundColor = COLORS.slice(0, data.labels.length);

  chart.update();

  updateTable(data.labels, selectedData);
  const filteredRecords = filterRecordsByRange(records, currentRange);
  updateInsights(filteredRecords);
}

/* =========================
   TABLE
========================= */
function updateTable(labels, values) {
  const tbody = document.querySelector("#trends-table tbody");
  tbody.innerHTML = "";

  labels.forEach((label, i) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${label}</td>
      <td>${values[i]}</td>
    `;

    tbody.appendChild(row);
  });
}

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

  function normalizeName(name) {
    return name?.toLowerCase().trim().replace(/\s+/g, " "); // collapse multiple spaces
  }
  /* =========================
     CORE METRICS
  ========================= */
  const totalVisits = records.length;
  const uniqueVisitors = Object.keys(visitCounts).length;

  const returningVisitors = Object.values(visitCounts).filter(
    (count) => count > 1,
  ).length;

 /* =========================
   FAMILY IMPACT (FIXED)
   ========================= */
  const familyMap = {};

  records.forEach((r) => {
    const key = r.name_id;
    if (!key) return;

    // Only count the FIRST time we see this family
    if (!familyMap[key]) {
      familyMap[key] = r.num_ppl_in_families || 0;
    }
  });

const totalPeople = Object.values(familyMap).reduce(
  (sum, val) => sum + val,
  0
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

  /* =========================
     UPDATE UI (NUMBERS ONLY)
  ========================= */
  document.getElementById("unique-visitors").textContent = uniqueVisitors;
  document.getElementById("returning-visitors").textContent = returningVisitors;
  document.getElementById("total-visitors").textContent = totalVisits;

  document.getElementById("visit-once").textContent = once;
  document.getElementById("visit-twice").textContent = twice;
  document.getElementById("visit-three").textContent = three;
  document.getElementById("visit-four").textContent = fourPlus;

  document.getElementById("family-total").textContent = totalPeople;
}
