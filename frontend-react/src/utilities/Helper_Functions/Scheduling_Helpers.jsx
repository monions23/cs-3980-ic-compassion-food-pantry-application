// Format time (12-hour format)
export function formatTime(hour, min) {
  let displayHour = hour > 12 ? hour - 12 : hour;
  let ampm = hour >= 12 ? "PM" : "AM";
  let minutes = min.toString().padStart(2, "0");
  return `${displayHour}:${minutes} ${ampm}`;
}

/* ==========================
 GET NEXT WEDNESDAY
  ========================== */
export function getNextWednesday() {
  const today = new Date();
  const day = today.getDay();

  const diff = (3 - day + 7) % 7 || 7; // 3 = Wednesday
  const nextWed = new Date(today);
  nextWed.setDate(today.getDate() + diff);

  nextWed.setHours(0, 0, 0, 0);
  return nextWed;
}
