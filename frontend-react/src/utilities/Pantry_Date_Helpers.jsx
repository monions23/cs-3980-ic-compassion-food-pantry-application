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
  // if unfilteredRecords is empty, return 0
  if (!unfilteredRecords || !unfilteredRecords.length) {
    return 0;
  }

  const now = new Date();

  // UTC to match backend
  const startOfDayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const endOfDayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  let total = 0;

  // find all records that occurred today and updated total number of people helped
  unfilteredRecords.forEach((r) => {
    if (!r.created_at) return;

    const recordDate = new Date(r.created_at);
    if (recordDate >= startOfDayUTC && recordDate < endOfDayUTC) {
      total += r.num_ppl_in_families || 0;
    }
  });

  return total; // return total
}
