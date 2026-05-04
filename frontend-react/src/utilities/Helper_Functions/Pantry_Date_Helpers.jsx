/* =========================
     FILTER BY LAST HOUR (HELPER FUNCTION)
  ========================= */
export function filterLastHour(unfilteredRecords) {
  const now = new Date();

  return unfilteredRecords.filter((r) => {
    if (!r.created_at) return false;

    const created = new Date(r.created_at);
    const diffMs = now - created;

    const oneHour = 60 * 60 * 1000;

    return diffMs <= oneHour;
  });
}

/* =========================
     GET TOTAL CLIENTS HELPED IN THE PAST DAY
     (HELPER FUNCTION)
  ========================= */
export function updateTodayTotal(unfilteredRecords) {
  if (!unfilteredRecords || !unfilteredRecords.length) {
    return 0;
  }

  const now = new Date();

  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  let total = 0;

  unfilteredRecords.forEach((r) => {
    if (!r.created_at) return;

    const recordDate = new Date(r.created_at);

    if (recordDate >= startOfDay && recordDate < endOfDay) {
      total += Number(r.num_ppl_in_families) || 0;
    }
  });

  return total;
}
