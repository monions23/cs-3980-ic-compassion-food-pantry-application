const pantryAPI = "http://127.0.0.1:8000/pantry-records/";
const stockAPI = "http://127.0.0.1:8000/stock/";

let pantryData = [];
let stockData = [];

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadArchive();
  setupPrintButton();

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) loadArchive();
  });
});

/* =========================
   LOAD DATA
========================= */
function loadArchive() {
  Promise.all([fetchPantry(), fetchStock()])
    .then(buildArchive)
    .catch(err => console.error("Load error:", err));
}

function fetchPantry() {
  return fetch(pantryAPI)
    .then(res => res.json())
    .then(data => pantryData = data || []);
}

function fetchStock() {
  return fetch(stockAPI)
    .then(res => res.json())
    .then(data => stockData = data || []);
}
/* =========================
   PRINT BUTTON
========================= */

function setupPrintButton() {
  const btn = document.getElementById("print-btn");

  if (!btn) {
    console.error("Print button not found");
    return;
  }

  btn.addEventListener("click", () => {
    window.print();
  });
}




/* =========================
   BUILD TABLE
========================= */
function buildArchive() {
  const table = document.getElementById("archive-table-body");
  table.innerHTML = "";

  console.log("Pantry data:", pantryData);

  if (!pantryData || pantryData.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="2">No records found</td>
      </tr>
    `;
    return;
  }
  

  const sorted = [...pantryData].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  sorted.forEach(record => {
  if (!record.created_at) return;

  const dateObj = new Date(record.created_at + "Z");

  if (isNaN(dateObj)) return;

  
  const localDate = dateObj.toLocaleString();

  const familySize = record.num_ppl_in_families || 0;

  table.innerHTML += `
    <tr>
      <td>${localDate}</td>
      <td>${familySize}</td>
    </tr>
  `;
});
}