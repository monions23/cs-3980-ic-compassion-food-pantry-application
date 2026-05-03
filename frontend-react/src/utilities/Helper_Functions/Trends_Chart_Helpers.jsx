/* =========================
    COLORS FOR CHART INIT
========================= */
export const COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
  "#86bc86",
  "#ffbe7d",
];

/* =========================
   DATE HELPERS
========================= */
export function getMonthIndex(date) {
  return new Date(date).getMonth(); // 0-11
}

export function getWeekOfMonth(date) {
  const d = new Date(date);
  return Math.floor((d.getDate() - 1) / 7); // 0–3
}

/*=================================
  FILTER RECORDS BY RANGE
  ====================================*/
export function filterRecords(records, range) {
  const now = new Date();
  return records.filter((r) => {
    if (!r.created_at) return false;
    const date = new Date(r.created_at);
    if (range === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    return date.getFullYear() === now.getFullYear();
  });
}
