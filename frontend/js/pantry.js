const api = "http://127.0.0.1:8000/pantry-records/";

/* =========================
   STATE
========================= */
let pantryRecords = [];

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadRecords();
  setupForm();
  document.getElementById("name").focus();
});

/* =========================
   LOAD RECORDS
========================= */
async function loadRecords() {
  try {
    const res = await fetch(api);
    const data = await res.json();

    console.log("Loaded records:", data); // 👈 DEBUG LINE

    pantryRecords = data;

    renderUpdates(pantryRecords);

    // ✅ MUST be AFTER data is assigned
    updateTodayTotal(pantryRecords);

  } catch (err) {
    console.error("Error loading records:", err);
  }
}

/* =========================
   SETUP FORM SUBMIT
========================= */
function setupForm() {
  const form = document.getElementById("pantry-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const msgDiv = document.getElementById("msg");

    const nameInput = document.getElementById("name");
    const familyInput = document.getElementById("num-in-family");
    const userInput = document.getElementById("user-updater");

    if (!nameInput.value || !familyInput.value) {
      msgDiv.innerHTML = "Please fill in required fields";
      return;
    }

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.value,
          num_ppl_in_families: parseInt(familyInput.value),
          // created_at handled by backend
        }),
      });

      if (!res.ok) throw new Error("Failed to create record");

      const newRecord = await res.json();

      // update UI immediately
      pantryRecords.unshift(newRecord);
      renderUpdates(pantryRecords);
      updateTodayTotal(pantryRecords);

    
     // reset form after submit
     form.reset();
     msgDiv.innerHTML = "";
     // focus back to first field
     document.getElementById("name").focus();

    } catch (err) {
      console.error(err);
      msgDiv.innerHTML = "Error creating record";
    }
  });
}

/* =========================
   DELETE RECORD
========================= */
async function deleteRecord(id) {
  try {
    const res = await fetch(api + id, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    pantryRecords = pantryRecords.filter(r => r._id !== id);
    renderUpdates(pantryRecords);
    updateTodayTotal(pantryRecords);

  } catch (err) {
    console.error(err);
  }
}

/* =========================
   RENDER UPDATES LIST
========================= */
function renderUpdates(data) {
  const container = document.getElementById("updates-list");

  if (!data.length) {
    container.innerHTML =
      `<p class="pantry-history-info">No records yet</p>`;
    return;
  }

  // sort newest first
  const sorted = [...data].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  container.innerHTML = "";

  sorted.forEach(record => {
    const div = document.createElement("div");
    div.classList.add("pantry-update");

    const date = new Date(record.created_at).toLocaleString();

    div.innerHTML = `
      <div class="update-card">
        <strong>${record.name}</strong><br>
        People Served: ${record.num_ppl_in_families}<br>
        <small>${date}</small><br>

        <button class="btn btn-sm btn-danger mt-1"
          onclick="deleteRecord('${record._id}')">
          Delete
        </button>
      </div>
      <hr/>
    `;

    container.appendChild(div);
  });
}

//INFO TABLE
function updateTodayTotal(records) {
  if (!records || !records.length) {
    document.getElementById("today-total").textContent = 0;
    return;
  }

  const now = new Date();

  // UTC to match backend
  const startOfDayUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));

  const endOfDayUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  ));

  let total = 0;

  records.forEach(r => {
    if (!r.created_at) return;

    const recordDate = new Date(r.created_at);

    if (recordDate >= startOfDayUTC && recordDate < endOfDayUTC) {
      total += r.num_ppl_in_families || 0;
    }
  });

  document.getElementById("today-total").textContent = total;
}