const API = "http://127.0.0.1:8000/stock/"; // API url

/* =========================
     GET STOCK ITEMS
  ========================= */
export const getAllStock = async () => {
  // API call to get all stocked items

  // retrieve the API response
  const response = await fetch(API, {
    method: "GET",
  });

  const data = await response.json();

  // note - or if it doesn't equal 200?
  if (!response.ok) {
    throw new Error(data.error || "Failed to update stock item");
  }

  return data;
};

/* =========================
   GET STOCK ITEM BY ID
========================= */
export const getStockItem = async (id) => {
  // get the id
  const response = await fetch("API" + id, {
    method: "GET",
  });

  const gottenItem = await response.json();

  // return the response if it's valid

  // note - or if it doesn't equal 200?
  if (!response.ok) {
    throw new Error(gottenItem.error || "Failed to update stock item");
  }

  return gottenItem;
};

/* =========================
     ADD ITEM
  ========================= */
export const addStockItem = async (formData) => {
  // Make the API Call
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_name: formData.item_name,
      quantity: Number(formData.quantity),
      target_quantity: Number(formData.target_quantity),
    }),
  });

  const addedItem = response.json();

  // check if response is okay
  // note - or it doesn't equal 201 status?
  if (!response.ok) {
    throw new Error(addedItem.error || "Failed to update stock item");
  }

  return addedItem;
};

/* =========================
     DELETE ITEM
  ========================= */
export const deleteStockItem = async (id) => {
  const response = await fetch(API + id, {
    method: "DELETE",
  });

  const deletedResponse = response.json();
  if (!response.ok) {
    throw new Error(deletedResponse.error || "Failed to update stock item");
  }

  return deletedResponse;
};

/* =========================
     EDIT ITEM
  ========================= */
export const editStockItem = async (editingId, formData) => {
  const response = await fetch(API + editingId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_name: formData.item_name,
      quantity: parseInt(formData.quantity),
      target_quantity: parseInt(formData.target_quantity),
    }),
  });

  const updatedItem = await response.json();

  // Check the response and make necessary updates

  // note - or it doesn't equal 200?
  if (!response.ok) {
    throw new Error(updatedItem.error || "Failed to update stock item");
  }

  return updatedItem;
};
