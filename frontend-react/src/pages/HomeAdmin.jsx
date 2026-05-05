import { useState, useEffect } from "react";

import Layout from "./Layout";

import { getPantryRecords } from "../utilities/API_Files/Pantry-API";
import { getNextWednesday } from "../utilities/Helper_Functions/Scheduling_Helpers";
import { getScheduledTimes } from "../utilities/API_Files/Scheduling-API";

export default function HomeAdmin() {
  const [scheduleRecords, setScheduleRecords] = useState({});

  function logout() {
    localStorage.removeItem("access_token");

    // redirect to login page
    window.location.href = "/login-signup";
  }

  // for month total
  const [monthTotal, setMonthTotal] = useState(0);

  // for schedule table
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

  const [scheduleCounts, setScheduleCounts] = useState(() =>
    slots.map((slot) => [slot, 0]),
  );
  const [nextWednesdayLabel, setNextWednesdayLabel] = useState("");
  /* =========================
   LOAD MONTHLY DATA
========================= */
  async function loadMonthlyData() {
    try {
      const data = await getPantryRecords();
      updateMonthTotal(data);
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
  // =========================
  // LOAD SCHEDULE TABLE
  // ==========================
  async function loadSchedule() {
    const counts = {};
    slots.forEach((s) => (counts[s] = 0));

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await getScheduledTimes(token);
      const data = await response.json();

      const nextWednesday = getNextWednesday();
      setNextWednesdayLabel("Next Wednesday: " + nextWednesday.toDateString());

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

        // calculate counts
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

      // set schedule counts to be final value of counts dictionary
      setScheduleCounts(counts);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  // load monthly data upon load
  useEffect(() => {
    // Load monthly information
    loadMonthlyData();
    // Load Schedule();
    loadSchedule();
  }, []);
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
              <a href="/archive" className="icon-item">
                <img src="/icons/archive-logo.svg" alt="Archive" />
                <span>Archive</span>
              </a>

              <a href="/trends" className="icon-item">
                <img src="/icons/trends-logo.svg" alt="Trends" />
                <span>Trends</span>
              </a>

              <a href="/stock" className="icon-item">
                <img src="/icons/stock-logo.svg" alt="Stock" />
                <span>Stock</span>
              </a>

              <a href="/account" className="icon-item">
                <img src="/icons/solid-user-logo.svg" alt="Account" />
                <span>Account</span>
              </a>

              <a href="/documents" className="icon-item">
                <img src="/icons/solid-file-logo.svg" alt="Files" />
                <span>Files</span>
              </a>

              <a href="/pantry" className="icon-item">
                <img src="/icons/pantry-logo.svg" alt="Pantry" />
                <span>Pantry</span>
              </a>

              <div className="icon-item" onClick={logout}>
                <img src="/icons/logout-logo.svg" alt="Logout" />
                <span>Logout</span>
              </div>
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
            <h3 id="next-wed-label">{nextWednesdayLabel}</h3>
            <div class="main-arrivals-table-box">
              <table class="main-arrivals-table" id="schedule-table">
                <thead>
                  <tr>
                    <th>Time Slot</th>
                    <th>Users Signed Up</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot}>
                      <td>{slot}</td>
                      <td>{scheduleCounts[slot] ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
