import { useState, useEffect } from "react";

// Components
import Layout from "./Layout";
import { getPantryRecords } from "../utilities/API_Files/Pantry-API";

export default function HomeAdmin() {
  // for month total
  const [records, setPantryRecords] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  /* =========================
   LOAD MONTHLY DATA
========================= */
  async function loadMonthlyData() {
    try {
      const data = await getPantryRecords();
      setPantryRecords(data);

      updateMonthTotal(records);
    } catch (err) {
      console.error("Error loading monthly data:", err);
    }
  }

  /* =========================
   MONTHLY TOTAL
========================= */
  function updateMonthTotal(records) {
    if (!records || !records.length) {
      return;
    }

    const now = new Date();

    // Start of current month (UTC)
    const startOfMonthUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );

    // Start of next month (UTC)
    const startOfNextMonthUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    let total = 0;

    records.forEach((r) => {
      if (!r.created_at) return;

      const recordDate = new Date(r.created_at);

      if (recordDate >= startOfMonthUTC && recordDate < startOfNextMonthUTC) {
        total += r.num_ppl_in_families || 0;
      }
    });

    setMonthTotal(total);
  }

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
      "4:30 - 5:00",
    ];

    const counts = {};
    slots.forEach((s) => (counts[s] = 0));

    // Render base table
    table.innerHTML = "";
    slots.forEach((slot) => {
      const row = document.createElement("tr");
      row.innerHTML = `<th>${slot}</th><th>0</th>`;
      table.appendChild(row);
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/scheduling/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        return;
      }

      const data = await res.json();
      const nextWednesday = getNextWednesday();

      console.log("Next Wednesday:", nextWednesday);

      data.forEach((entry) => {
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
  // load monthly data upon load
  useEffect(() => {
    loadMonthlyData();
  });
  return (
    <>
      <Layout>
        <div className="main-grid">
          <div className="main-structure-top">
            <h1>Welcome to IC Compassion Food Pantry Tracker!</h1>
          </div>
          <div className="main-structure-left">
            <h2>Dashboard</h2>
            <hr />
            <br />
            <div className="icon-span">
              <a href="archive.html">
                <img src="icons/archive-logo.svg" alt="Icon Homepage Links" />
              </a>
              <a href="trends.html">
                <img src="icons/trends-logo.svg" alt="Icon Homepage Links" />
              </a>
              <a href="stock.html">
                <img src="icons/stock-logo.svg" alt="Icon Homepage Links" />
              </a>
              <a href="account.html">
                <img
                  src="icons/solid-user-logo.svg"
                  alt="Icon Homepage Links"
                />
              </a>
              <a href="downloads.html">
                <img
                  src="icons/solid-file-logo.svg"
                  alt="Icon Homepage Links"
                />
              </a>
              <a href="pantry.html">
                <img src="icons/pantry-logo.svg" alt="Icon Homepage Links" />
              </a>
              <img
                src="icons/logout-logo.svg"
                alt="Icon Homepage Links"
                onclick="logout()"
              />
            </div>
            <br />
            <div className="card p-3 text-center">
              <h5>People Served This Month</h5>
              <h1 id="month-total" style={{ fontSize: "3rem" }}>
                {monthTotal}
              </h1>
            </div>
          </div>
          <div className="main-structure-right">
            <h2>When to expect people</h2>
            <hr />
            <br />
            <div class="main-arrivals-table-box">
              <table class="main-arrivals-table" id="schedule-table"></table>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
