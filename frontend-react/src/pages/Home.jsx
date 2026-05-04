import "../App.css";
import flatpickr from "flatpickr";
import { useState, useEffect, useRef } from "react";
import { getPantryRecords } from "../utilities/API_Files/Pantry-API";
import Layout from "./Layout";
import { formatTime } from "../utilities/Helper_Functions/Scheduling_Helpers";
import { scheduleTime } from "../utilities/API_Files/Scheduling-API";

function Home() {
  const [dateInput, setDateInput] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSelect, setTimeSelect] = useState("");
  const [message, setMessage] = useState("");

  // for month total
  const [records, setPantryRecords] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const dateRef = useRef(null);

  function logout() {
    localStorage.removeItem("access_token");

    // redirect to login page
    window.location.href = "/login-signup";
  }

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

  // Initialize flatpickr
  useEffect(() => {
    console.log("dateRef.current:", dateRef.current);
    if (dateRef.current) {
      flatpickr(dateRef.current, {
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: new Date().fp_incr(30),
        disable: [
          (date) => date.getDay() !== 3, // Only Wednesdays
        ],
        onChange: (_, dateStr) => setDateInput(dateStr),
      });
    }
  }, []);

  // Generate time slots (12:00 PM – 5:00 PM, 30-min intervals)
  useEffect(() => {
    const slots = [];
    for (let hour = 12; hour < 17; hour++) {
      for (let min of [0, 30]) {
        let endHourCalc = hour;
        let endMinCalc = min + 30;

        if (endMinCalc === 60) {
          endMinCalc = 0;
          endHourCalc += 1;
        }

        let startTime = formatTime(hour, min);
        let endTime = formatTime(endHourCalc, endMinCalc);

        let label = `${startTime} - ${endTime}`;
        let value = `${hour}:${min.toString().padStart(2, "0")}-${endHourCalc}:${endMinCalc.toString().padStart(2, "0")}`;

        slots.push({ label, value });
      }
    }
    setTimeSlots(slots);
  }, []);

  // Load Monthly Data
  useEffect(() => {
    loadMonthlyData();
  }, []);

  // Submit booking
  async function submitBooking() {
    if (dateInput === "" || timeSelect === "") {
      setMessage("❌ Please select both date and time.");
      return;
    }
    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("❌ You must be logged in.");
      return;
    }

    // Extract start time (HH:MM)
    const startTime = timeSelect.split("-")[0];
    const dateTime = new Date(`${dateInput}T${startTime}:00`);

    // Debug (optional)
    console.log("Sending datetime:", dateTime.toISOString());

    try {
      const response = await scheduleTime(token, dateTime);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage("✅ Booking saved!");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + err.message);
    }
  }

  // Initialize time slots on load
  useEffect(() => { }, []);
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
              <a href="account">
                <img
                  src="icons/solid-user-logo.svg"
                  alt="Icon Homepage Links"
                />
              </a>
              <a href="downloads">
                <img
                  src="icons/solid-file-logo.svg"
                  alt="Icon Homepage Links"
                />
              </a>

              <img
                src="icons/logout-logo.svg"
                alt="Icon Homepage Links"
                onClick={logout}
              />
            </div>
            <br />
            <br />
            <div className="card p-3 text-center">
              <h5>People Served This Month</h5>
              <h1 id="month-total" style={{ fontSize: "3rem" }}>
                {monthTotal}
              </h1>
            </div>
          </div>
          <div className="main-structure-right">
            <div className="scheduler">
              <h2>Schedule an Appointment</h2>
              <hr />
              <label htmlFor="date">Select a Wednesday:</label> <br />
              <input
                type="date"
                id="date"
                ref={dateRef}
                onChange={(e) => setDateInput(e.target.value)}
              />
              <br />
              <br />
              <label htmlFor="time">Select a Time:</label> <br />
              <select
                id="time"
                value={timeSelect}
                onChange={(e) => setTimeSelect(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a time --
                </option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              <br />
              <br />
              <button id="scheduler-submit" onClick={submitBooking}>
                Book
              </button>{" "}
              <br />
              <p id="scheduler-message">{message}</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Home;
