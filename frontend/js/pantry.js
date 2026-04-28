const api = "http://127.0.0.1:8000/pantry-records/";

/* =========================
   STATE (something is deeply wrong with the dates for the updates in this one.
    look at this later if yall have a chance
   the updates on the right are ordered by newest to oldest top to bottom but the date for today isnt changing and 
   somehow we are living in the future because it is storing yesterdays values as today somehow)
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

    console.log("Loaded records:", data);

    pantryRecords = data;

    const recentRecords = filterLastHour(pantryRecords);
    renderUpdates(recentRecords);

    // MUST be AFTER data is assigned
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

    // Process name input for database
    console.log(nameInput);
    var name_words = nameInput.value.split(" ");
    var name_data = name_words[0].at(0) + name_words[1];
    var name_data = name_data.toLowerCase();

    // Make sure all fields are filled in
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
          name: name_data,
          num_ppl_in_families: parseInt(familyInput.value),
          // created_at handled by backend
        }),
      });

      if (!res.ok) throw new Error("Failed to create record");

      const newRecord = await res.json();

      // update UI immediately
      pantryRecords.unshift(newRecord);
      const recentRecords = filterLastHour(pantryRecords);
      renderUpdates(recentRecords);
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

    pantryRecords = pantryRecords.filter((r) => r.public_id !== id);
    const recentRecords = filterLastHour(pantryRecords);
    renderUpdates(recentRecords);
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
    container.innerHTML = `<p class="pantry-history-info">No records yet</p>`;
    return;
  }

  const sorted = [...data].sort((a, b) => {
    return (
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    );
  });

  container.innerHTML = "";

  sorted.forEach((record) => {
    const div = document.createElement("div");
    div.classList.add("pantry-update");

    //Date in local time instead of UTC
    const date = record.created_at
      ? new Date(record.created_at).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        })
      : "No date";

    div.innerHTML = `
      <div class="update-card">
        <strong>Family of ${record.num_ppl_in_families}</strong><br>
        <small>${date}</small><br>

        <button class="btn btn-sm btn-danger mt-1"
          onclick="deleteRecord('${record.public_id}')">
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
  const startOfDayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const endOfDayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  let total = 0;

  records.forEach((r) => {
    if (!r.created_at) return;

    const recordDate = new Date(r.created_at);

    if (recordDate >= startOfDayUTC && recordDate < endOfDayUTC) {
      total += r.num_ppl_in_families || 0;
    }
  });

  document.getElementById("today-total").textContent = total;
}

//To filter only the last hour
function filterLastHour(records) {
  const now = new Date();

  return records.filter((r) => {
    if (!r.created_at) return false;

    const created = new Date(r.created_at);
    const diffMs = now - created;

    const oneHour = 60 * 60 * 1000;

    return diffMs <= oneHour;
  });
}
