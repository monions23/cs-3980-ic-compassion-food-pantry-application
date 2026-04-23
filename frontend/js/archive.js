const pantryAPI = "http://127.0.0.1:8000/pantry-records/";
const stockAPI = "http://127.0.0.1:8000/stock/";

let pantryData = [];
let stockData = [];

document.addEventListener("DOMContentLoaded", () => {
  loadArchive();
});

function loadArchive() {
  Promise.all([fetchPantry(), fetchStock()]).then(() => {
    buildArchive();
  });
}

/* =========================
   FETCH DATA
========================= */
function fetchPantry() {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 200) {
        pantryData = JSON.parse(xhr.response) || [];
      }
      resolve();
    };
    xhr.open("GET", pantryAPI, true);
    xhr.send();
  });
}

function fetchStock() {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 200) {
        stockData = JSON.parse(xhr.response) || [];
      }
      resolve();
    };
    xhr.open("GET", stockAPI, true);
    xhr.send();
  });
}

/* =========================
   BUILD ARCHIVE TABLE
========================= */
function buildArchive() {
  const table = document.getElementById("archive-table-body");
  table.innerHTML = "";

  // Group pantry records by month/year
  const grouped = {};

  pantryData.forEach(record => {
    const date = new Date(record.created_at);
    const key = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(record.num_ppl_in_families);
  });

  // Find "most popular item" (highest quantity)
  let popularItem = "N/A";
  if (stockData.length > 0) {
    const max = stockData.reduce((a, b) =>
      a.quantity > b.quantity ? a : b
    );
    popularItem = max.item_name;
  }

  // Build rows
  Object.keys(grouped).forEach(key => {
    const values = grouped[key];
    const avg =
      values.reduce((a, b) => a + b, 0) / values.length;

    table.innerHTML += `
      <tr>
        <td>${key}</td>
        <td>${avg.toFixed(2)}</td>
        <td>${popularItem}</td>
      </tr>
    `;
  });
}

// Print button 
document.addEventListener("DOMContentLoaded", () => {
  loadArchive();

  const printBtn = document.getElementById("print-btn");

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      const content = document.querySelector(".archive-info").innerHTML;

      const printWindow = window.open("", "", "width=800,height=600");

      printWindow.document.write(`
        <html>
          <head>
            <title>Archive Logs</title>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    });
  }
});