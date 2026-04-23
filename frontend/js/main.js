const api = "http://127.0.0.1:8000/pantry-records/";

let pantryRecords = [];

document.addEventListener("DOMContentLoaded", () => {
  loadMonthlyData();
});

async function loadMonthlyData() {
  try {
    const res = await fetch(api);
    const data = await res.json();

    pantryRecords = data;

    updateMonthTotal(pantryRecords);

  } catch (err) {
    console.error("Error loading monthly data:", err);
  }
}

/* =========================
   MONTHLY TOTAL
========================= */
function updateMonthTotal(records) {
  if (!records || !records.length) {
    document.getElementById("month-total").textContent = 0;
    return;
  }

  const now = new Date();

  // Start of current month (UTC)
  const startOfMonthUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    1
  ));

  // Start of next month (UTC)
  const startOfNextMonthUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    1
  ));

  let total = 0;

  records.forEach(r => {
    if (!r.created_at) return;

    const recordDate = new Date(r.created_at);

    if (recordDate >= startOfMonthUTC && recordDate < startOfNextMonthUTC) {
      total += r.num_ppl_in_families || 0;
    }
  });

  document.getElementById("month-total").textContent = total;
}