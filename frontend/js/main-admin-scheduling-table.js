// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadSchedule();

  const label = document.getElementById("next-wed-label");
  if (label) {
    const nextWed = getNextWednesday();
    label.textContent = "Next Wednesday: " + nextWed.toDateString();
  }
});


// ==========================
// GET NEXT WEDNESDAY
// ==========================
function getNextWednesday() {
  const today = new Date();
  const day = today.getDay();

  const diff = (3 - day + 7) % 7 || 7; // 3 = Wednesday
  const nextWed = new Date(today);
  nextWed.setDate(today.getDate() + diff);

  nextWed.setHours(0, 0, 0, 0);
  return nextWed;
}


// ==========================
// LOAD SCHEDULE TABLE
// ==========================
async function loadSchedule() {
  const table = document.getElementById("schedule-table");
  if (!table) return;

  const token = localStorage.getItem("access_token");

  if (!token) {
    console.error("No token found");
    return;
  }

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

  // Render base table
  table.innerHTML = "";
  slots.forEach(slot => {
    const row = document.createElement("tr");
    row.innerHTML = `<th>${slot}</th><th>0</th>`;
    table.appendChild(row);
  });

  try {
    const res = await fetch("http://127.0.0.1:8000/scheduling/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error:", text);
      return;
    }

    const data = await res.json();
    const nextWednesday = getNextWednesday();

    console.log("Next Wednesday:", nextWednesday);

    data.forEach(entry => {
      if (!entry.date) return;

      const d = new Date(entry.date);
      if (isNaN(d)) return;

      // Normalize entry date (ignore time)
      const entryDate = new Date(d);
      entryDate.setHours(0, 0, 0, 0);

      // (no timezone bugs)
      if (
        entryDate.getFullYear() !== nextWednesday.getFullYear() ||
        entryDate.getMonth() !== nextWednesday.getMonth() ||
        entryDate.getDate() !== nextWednesday.getDate()
      ) {
        return;
      }

      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

      const hour = local.getHours();
      const min = local.getMinutes();

      console.log("Matched Entry:", d, "Hour:", hour, "Min:", min);

      // 
      const slotIndex = Math.floor((hour - 12) * 2 + (min >= 30 ? 1 : 0));

      if (slotIndex >= 0 && slotIndex < slots.length) {
        counts[slots[slotIndex]]++;
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