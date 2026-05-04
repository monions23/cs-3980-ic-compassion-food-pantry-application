// Format time (12-hour format)
export function formatTime(hour, min) {
  let displayHour = hour > 12 ? hour - 12 : hour;
  let ampm = hour >= 12 ? "PM" : "AM";
  let minutes = min.toString().padStart(2, "0");
  return `${displayHour}:${minutes} ${ampm}`;
}
