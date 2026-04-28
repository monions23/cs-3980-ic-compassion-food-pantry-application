const api = "http://127.0.0.1:8000/stock/";

let stockIdInEdit = "";
let stockChart = null;

/* =========================
   INIT (SAFE ENTRY POINT)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  getAllStockedItems();

  // ADD BUTTON
  const addBtn = document.getElementById("add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", handleAdd);
  }

  // EDIT BUTTON
  const editBtn = document.getElementById("edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", handleEdit);
  }

  // SEARCH INPUT
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  // CLEAR MODAL ERROR ON CLOSE
  const modalAdd = document.getElementById("modal-add");
  if (modalAdd) {
    modalAdd.addEventListener("hidden.bs.modal", () => {
      const msgDiv = document.getElementById("msg");
      if (msgDiv) msgDiv.innerHTML = "";
    });
  }
});

/* =========================
   GET ALL STOCK ITEMS
========================= */
function getAllStockedItems() {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      stockedFood = JSON.parse(xhr.response) || [];
      renderStock(stockedFood);
      updateStockChart(stockedFood);
    }
  };

  xhr.open("GET", api, true);
  xhr.send();
}

/* =========================
   GET STOCK ITEM BY ID
========================= */
function getStockItem(id) {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      stockedFood = JSON.parse(xhr.response) || [];
    }
  };

  xhr.open("GET", api + id, true);
  xhr.send();
}

/* =========================
   ADD ITEM
========================= */
function handleAdd(e) {
  e.preventDefault();

  const msgDiv = document.getElementById("msg");
  const itemNameInput = document.getElementById("title");
  const stockInput = document.getElementById("stock-number");
  const targetInput = document.getElementById("target-stock");

  if (!itemNameInput || !stockInput || !targetInput) return;

  if (!itemNameInput.value || !stockInput.value || !targetInput.value) {
    msgDiv.innerHTML = "Please fill all fields";
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 201) {
      const newItem = JSON.parse(xhr.response);
      getAllStockedItems(); // Refresh the list from the server to ensure consistency

      document.getElementById("close-add-modal")?.click();

      msgDiv.innerHTML = "";
      itemNameInput.value = "";
      stockInput.value = "";
      targetInput.value = "";
    }
  };

  xhr.open("POST", api, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.send(
    JSON.stringify({
      item_name: itemNameInput.value,
      quantity: parseInt(stockInput.value),
      target_quantity: parseInt(targetInput.value),
    }),
  );
}

/* =========================
   EDIT ITEM
========================= */
function handleEdit(e) {
  e.preventDefault();

  const msgDiv = document.getElementById("msg-edit");
  const itemNameInput = document.getElementById("title-edit");
  const stockInput = document.getElementById("stock-number-edit");
  const targetInput = document.getElementById("target-stock-edit");

  if (!itemNameInput || !stockInput || !targetInput) return;

  if (!itemNameInput.value || !stockInput.value || !targetInput.value) {
    msgDiv.innerHTML = "Please fill all fields";
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      const updated = JSON.parse(xhr.response);
      const item = getStockItem(stockIdInEdit);

      if (item) {
        item.item_name = updated.item_name;
        item.quantity = updated.quantity;
        item.target_quantity = updated.target_quantity;
      }

      document.getElementById("close-edit-modal")?.click();
      getAllStockedItems(); // Refresh the list from the server to ensure consistency

      msgDiv.innerHTML = "";
    }
  };

  xhr.open("PUT", api + stockIdInEdit, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.send(
    JSON.stringify({
      item_name: itemNameInput.value,
      quantity: parseInt(stockInput.value),
      target_quantity: parseInt(targetInput.value),
    }),
  );
}

/* =========================
   DELETE ITEM
========================= */
function deleteStockItem(id) {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      stockedFood = stockedFood.filter((x) => x.public_id !== id);

      renderStock(stockedFood);
      updateStockChart(stockedFood);
    }
  };

  xhr.open("DELETE", api + id, true);
  xhr.send();
}

/* =========================
   EDIT PREFILL
========================= */
function setStockItemInEdit(id) {
  stockIdInEdit = id;

  const item = stockedFood.find((s) => s.public_id === id);
  if (!item) return;

  document.getElementById("title-edit").value = item.item_name;
  document.getElementById("stock-number-edit").value = item.quantity;
  document.getElementById("target-stock-edit").value = item.target_quantity;
}

/* =========================
   RENDER TABLE
========================= */
function renderStock(data) {
  const table = document.getElementById("stock-table-data");
  if (!table) return;

  table.innerHTML = "";

  data
    .sort((a, b) => b.quantity - a.quantity)
    .forEach((x) => {
      table.innerHTML += `
        <tr class="stock-table-row">
          <td>${x.item_name}</td>
          <td>${x.quantity}</td>
          <td>${x.target_quantity}</td>
          <td>
            <button class="btn btn-primary btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#modal-edit"
              onclick="setStockItemInEdit('${x.public_id}')">
              Edit
            </button>

            <button class="btn btn-danger btn-sm"
              onclick="deleteStockItem('${x.public_id}')">
              Delete
            </button>
          </td>
        </tr>
      `;
    });
}

/* =========================
   CHART 
========================= */
function updateStockChart(data) {
  const canvas = document.getElementById("Stockchart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const labels = data.map((item) => item.item_name);
  const quantities = data.map((item) => item.quantity);
  const targets = data.map((item) => item.target_quantity);

  if (stockChart) stockChart.destroy();

  stockChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Current Stock",
          data: quantities,
          backgroundColor: "#65bac2",
        },
        {
          label: "Target Stock",
          data: targets,
          backgroundColor: "#bc1a38",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

/* =========================
   SEARCH
========================= */
function handleSearch(e) {
  const value = e.target.value.toLowerCase();
  const resultBody = document.getElementById("search-result");

  if (!resultBody) return;

  resultBody.innerHTML = "";

  if (!value) {
    updateStockChart(stockedFood);
    return;
  }

  const matches = stockedFood.filter((item) =>
    item.item_name.toLowerCase().includes(value),
  );

  if (matches.length === 0) {
    resultBody.innerHTML = `<tr><td colspan="2">No items found</td></tr>`;
    return;
  }

  matches.forEach((item) => {
    resultBody.innerHTML += `
      <tr>
        <td>${item.item_name}</td>
        <td>${item.quantity}</td>
      </tr>
    `;
  });

  updateStockChart(matches);
}
