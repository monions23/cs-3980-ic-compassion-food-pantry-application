// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadSchedule();
  setupForm();
  setupDatePicker();
});


// ==========================
// LOAD TABLE (main.html)
// ==========================
async function loadSchedule() {
  const table = document.getElementById("schedule-table");

  // ✅ CRITICAL: stop immediately if table doesn't exist
  if (!table) return;

  const slots = [
    "12:00 - 12:30",
    "12:30 - 1:00",
    "1:00 - 1:30",
    "1:30 - 2:00",
    "2:00 - 2:30",
    "2:30 - 3:00",
    "3:00 - 3:30",
    "3:30 - 4:00",
    "4:00 - 4:30",
    "4:30 - 5:00"
  ];

  const counts = {};
  slots.forEach(s => counts[s] = 0);

  // ✅ ALWAYS render 0s first
  table.innerHTML = "";
  slots.forEach(slot => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th>${slot}</th>
      <th>0</th>
    `;
    table.appendChild(row);
  });

  try {
    const res = await fetch("http://127.0.0.1:8000/scheduling/");
    const data = await res.json();

    data.forEach(entry => {
      if (!entry.date) return;

      const d = new Date(entry.date);

      if (isNaN(d)) return; // ✅ prevents crash

      const hour = d.getHours();
      const min = d.getMinutes();

      let index = -1;

      if (hour === 12 && min === 0) index = 0;
      else if (hour === 12 && min === 30) index = 1;
      else if (hour === 13 && min === 0) index = 2;
      else if (hour === 13 && min === 30) index = 3;
      else if (hour === 14 && min === 0) index = 4;
      else if (hour === 14 && min === 30) index = 5;
      else if (hour === 15 && min === 0) index = 6;
      else if (hour === 15 && min === 30) index = 7;
      else if (hour === 16 && min === 0) index = 8;
      else if (hour === 16 && min === 30) index = 9;

      if (index !== -1) {
        counts[slots[index]]++;
      }
    });

    const rows = table.querySelectorAll("tr");

    slots.forEach((slot, i) => {
      rows[i].children[1].textContent = counts[slot];
    });

  } catch (err) {
    console.error("Fetch failed:", err);
  }
}


// ==========================
// FORM HANDLING (schedule page)
// ==========================
function setupForm() {
  const form = document.getElementById("schedule-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageBox = document.getElementById("schedule-message");
    const date = document.getElementById("date").value;
    const time = document.getElementById("time-slot").value;

    if (!date || !time) {
      messageBox.innerText = "Please select date and time.";
      messageBox.style.color = "red";
      return;
    }

    try {
      // ✅ FIXED parsing
      const startTime = time.split("-")[0].trim();

      const datetime = new Date(`${date}T${startTime}:00`);

      if (isNaN(datetime.getTime())) {
        throw new Error("Invalid datetime");
      }

      const res = await fetch("http://127.0.0.1:8000/scheduling/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: datetime.toISOString() })
      });

      if (!res.ok) throw new Error();

      messageBox.innerText = "✅ Scheduled!";
      messageBox.style.color = "green";

      form.reset();

    } catch (err) {
      console.error(err);
      messageBox.innerText = "Error scheduling.";
      messageBox.style.color = "red";
    }
  });
}


// ==========================
// DATE PICKER (safe)
// ==========================
function setupDatePicker() {
  if (typeof flatpickr === "undefined") return;

  const dateInput = document.getElementById("date");
  const timeSelect = document.getElementById("time-slot");

  if (!dateInput || !timeSelect) return;

  flatpickr("#date", {
    dateFormat: "Y-m-d",

    disable: [
      function (date) {
        return date.getDay() !== 3; // Wednesday only
      }
    ],

    onChange: function (_, dateStr) {
      generateTimeSlots(dateStr, timeSelect);
    }
  });
}


// ==========================
// TIME SLOT GENERATOR
// ==========================
function generateTimeSlots(selectedDate, timeSelect) {
  timeSelect.innerHTML = '<option value="">Select a time slot</option>';

  if (!selectedDate) return;

  for (let h = 12; h < 17; h++) {
    ["00", "30"].forEach(min => {
      const start = `${h}:${min}`;
      const endMin = min === "00" ? "30" : "00";
      const endHour = min === "30" ? h + 1 : h;

      const end = `${endHour}:${endMin}`;

      const option = document.createElement("option");
      option.value = `${start} - ${end}`;
      option.textContent = `${start} - ${end}`;

      timeSelect.appendChild(option);
    });
  }
}