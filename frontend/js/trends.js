
/* =========================
   DATASET DEFINITIONS
========================= */
const datasets = {
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    visitors: [50, 65, 80, 70],
    familySize: [120, 150, 200, 180]
  },
  year: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','July','Aug','Sept','Oct','Nov','Dec'],
    visitors: [200, 180, 220, 260, 300, 280, 300, 310, 400, 410, 500, 510],
    familySize: [500, 450, 550, 600, 700, 650, 680, 720, 800, 820, 900, 950]
  }
};

/* =========================
   STATE VARIABLES
========================= */
let currentMode = "visitors";     // "visitors" OR "familySize"
let currentRange = "month";       // "month" OR "year"


/* =========================
   CHART INITIALIZATION
========================= */
const ctx = document.getElementById('trends-graph').getContext('2d');

let myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: datasets.month.labels,
    datasets: [{
      label: 'Visitors',
      data: datasets.month.visitors,
      backgroundColor: '#4e79a7'
    }]
  }
});


/* =========================
   MODE & RANGE CONTROLS
========================= */
function setMode(mode) {
  currentMode = mode; // must match dataset keys (visitors / familySize)
  updateDashboard();
}

function changeRange(range) {
  currentRange = range;
  updateDashboard();
}


/* =========================
   GRAPH TYPE SWITCHER
========================= */
function changeGraph(type) {
  myChart.config.type = type;
  myChart.update();

  // Keep table + insights synced
  updateTable(myChart.data.labels, myChart.data.datasets[0].data);
  updateVisitorBreakdown(myChart.data.datasets[0].data);
}


/* =========================
   TABLE UPDATE
========================= */
function updateTable(labels, data) {
  const tableBody = document.querySelector("#trends-table tbody");

  tableBody.innerHTML = ""; // Clear old rows

  for (let i = 0; i < labels.length; i++) {
    const row = document.createElement("tr");

    const labelCell = document.createElement("td");
    labelCell.textContent = labels[i];

    const valueCell = document.createElement("td");
    valueCell.textContent = data[i];

    row.appendChild(labelCell);
    row.appendChild(valueCell);

    tableBody.appendChild(row);
  }
}


/* =========================
   VISITOR INSIGHTS
========================= */
function updateVisitorBreakdown(data) {
  let returning = 0;

  // Treat increases as "returning visits"
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i - 1]) {
      returning += data[i] - data[i - 1];
    }
  }

  const total = data.reduce((a, b) => a + b, 0);

  // Prevent weird overflow
  returning = Math.min(returning, total);

  const unique = total - returning;

  // Update UI
  document.getElementById("unique-visitors").textContent =
    `Unique visitors: ${unique}`;

  document.getElementById("returning-visitors").textContent =
    `Returning visitors: ${returning}`;

  document.getElementById("total-visitors").textContent =
    `Total visits: ${total}`;
}


/* =========================
   VISIT FREQUENCY BREAKDOWN
========================= */
function updateVisitFrequency(total) {
  const once = Math.round(total * 0.5);
  const twice = Math.round(total * 0.25);
  const three = Math.round(total * 0.15);
  const four = Math.round(total * 0.10);

  document.getElementById("visit-once").textContent =
    `Visited once: ${once}`;

  document.getElementById("visit-twice").textContent =
    `Visited twice: ${twice}`;

  document.getElementById("visit-three").textContent =
    `Visited three times: ${three}`;

  document.getElementById("visit-four").textContent =
    `Visited four+ times: ${four}`;
}


/* =========================
   FAMILY METRIC
========================= */
function updateFamilyMetric(familyData) {
  const total = familyData.reduce((a, b) => a + b, 0);

  document.getElementById("family-total").textContent =
    `Total people served (including families): ${total}`;
}


/* =========================
   MAIN DASHBOARD UPDATE
========================= */
function updateDashboard() {
  const selected = datasets[currentRange];
  const data = selected[currentMode]; // FIXED: now matches "familySize"

  // Update chart
  myChart.data.labels = selected.labels;
  myChart.data.datasets[0].data = data;

  myChart.data.datasets[0].label =
    currentMode === "visitors" ? "Visitors" : "People Served";

  myChart.update();

  // Sync everything else
  updateTable(selected.labels, data);
  updateVisitorBreakdown(data);

  const total = data.reduce((a, b) => a + b, 0);
  updateVisitFrequency(total);

  // Always show family impact using family dataset
  updateFamilyMetric(selected.familySize);
}


/* =========================
   INITIAL LOAD
========================= */
updateDashboard();
