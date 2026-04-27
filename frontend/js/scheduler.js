const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");
const submitBtn = document.getElementById("scheduler-submit");
const message = document.getElementById("scheduler-message");

// Initialize date picker (Wednesdays only, next 30 days)
flatpickr("#date", {
  dateFormat: "Y-m-d",
  minDate: "today",
  maxDate: new Date().fp_incr(30),
  disable: [
    function (date) {
      return date.getDay() !== 3; // Only Wednesdays
    }
  ]
});

// Format time (12-hour format)
function formatTime(hour, min) {
  let displayHour = hour > 12 ? hour - 12 : hour;
  let ampm = hour >= 12 ? "PM" : "AM";
  let minutes = min.toString().padStart(2, "0");
  return `${displayHour}:${minutes} ${ampm}`;
}

// Generate time slots (12:00 PM – 5:00 PM, 30-min intervals)
function generateTimeSlots() {
  timeSelect.innerHTML = "";

  // Placeholder option
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select a time --";
  placeholder.disabled = true;
  placeholder.selected = true;
  timeSelect.appendChild(placeholder);

  let startHour = 12;
  let endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min of [0, 30]) {

      let startTime = formatTime(hour, min);

      // Calculate end time
      let endHourCalc = hour;
      let endMinCalc = min + 30;

      if (endMinCalc === 60) {
        endMinCalc = 0;
        endHourCalc += 1;
      }

      let endTime = formatTime(endHourCalc, endMinCalc);

      let label = `${startTime} - ${endTime}`;

      // Ensure proper formatting (HH:MM)
      let value = `${hour}:${min.toString().padStart(2, "0")}-${endHourCalc}:${endMinCalc.toString().padStart(2, "0")}`;

      let option = document.createElement("option");
      option.value = value;
      option.textContent = label;

      timeSelect.appendChild(option);
    }
  }
}

// Submit booking
submitBtn.addEventListener("click", async () => {
  const date = dateInput.value;
  const timeValue = timeSelect.value;

  if (!date || !timeValue) {
    message.textContent = "❌ Please select both date and time.";
    return;
  }

  // Extract start time (HH:MM)
  const startTime = timeValue.split("-")[0];

  // Build ISO datetime
  const dateTime = new Date(`${date}T${startTime}:00`);

  // Debug (optional)
  console.log("Sending datetime:", dateTime.toISOString());

  try {
    const response = await fetch("http://127.0.0.1:8000/scheduling/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Add Authorization later when auth is enabled
        // "Authorization": "Bearer YOUR_TOKEN"
      },
      body: JSON.stringify({
        name: "Test User",
        date: dateTime.toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    message.textContent = "✅ Booking saved!";
  } catch (err) {
    console.error(err);
    message.textContent = "❌ " + err.message;
  }
});

// Initialize time slots on load
generateTimeSlots();