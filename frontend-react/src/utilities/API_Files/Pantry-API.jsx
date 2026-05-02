const API = "http://127.0.0.1:8000/pantry-records/";

/* =========================
     GET PANTRY RECORDS
  ========================= */
export const getPantryRecords = async () => {
  // retrieve the API response
  const response = await fetch(API, {
    method: "GET",
  });

  const data = await response.json();

  // note - or if it doesn't equal 200?
  if (!response.ok) {
    throw new Error(data.error || "Failed to load pantry records");
  }

  return data;
};

/* =========================
     ADD PANTRY RECORD
  ========================= */
export const addPantryRecord = async (formData) => {
  // Make the API Call
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.name,
      num_ppl_in_families: parseInt(formData.num_ppl_in_families),
    }),
  });

  const addedRecord = await response.json();

  // check if response is okay
  if (!response.ok) {
    throw new Error(addedRecord.error || "Failed to add panty record");
  }

  return addedRecord;
};

/* =========================
     DELETE PANTRY RECORD
  ========================= */
export const deletePantryRecord = async (id) => {
  const response = await fetch(API + id, {
    method: "DELETE",
  });

  const deletedRecord = await response.json();

  if (!response.ok) {
    throw new Error(deletedRecord.error || "Failed to add stock item");
  }

  return deletedRecord;
};
