const api = "http://127.0.0.1:8000/stock/";

let stockedFood = []; // default of empty array, will be updated with getAllStockItems() upon page load
let stockIdInEdit = "";
let stockChart = null;

(() => {
  getAllStockItems();
})();

document.getElementById("add-btn").addEventListener("click", (e) => {
  e.preventDefault();

  // get id from form input in modal and assign to what will be added by using .value
  const msgDiv = document.getElementById("msg");
  const itemNameInput = document.getElementById("title");
  const stockInput = document.getElementById("stock-number");
  const targetQuantityInput = document.getElementById("target-stock");

  // check that all input fields are non-empty, otherwise display an error message
  if (!itemNameInput.value || !stockInput.value || !targetQuantityInput.value) {
    msgDiv.innerHTML =
      "Please provide non-empty fields when adding a new Reagent";
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 201) {
      // get the new stocked item and updated the stockedFood array
      const newStockItem = JSON.parse(xhr.response);
      stockedFood.push(newStockItem);
      renderStock(stockedFood);
      //Update stock chart
      updateStockChart(stockedFood);

      // close modal dialog
      // if using fetch, use "then"
      const closeBtn = document.getElementById("close-add-modal");
      closeBtn.click();

      // clean up error message
      msgDiv.innerHTML = "";
      itemNameInput.value = "";
      stockInput.value = "";
      targetQuantityInput.value = "";
    }

    console.log(stockedFood);
  };

  // with POST, need to send a body with post
  xhr.open("POST", api, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(
    JSON.stringify({
      item_name: itemNameInput.value,
      quantity: parseInt(stockInput.value),
      target_quantity: parseInt(targetQuantityInput.value),
    }),
  );
});

document.getElementById("edit-btn").addEventListener("click", (e) => {
  e.preventDefault();

  // get id from form input in modal and assign to what will be added by using .value
  const msgDiv = document.getElementById("msg-edit");
  const itemNameInput = document.getElementById("title-edit");
  const stockInput = document.getElementById("stock-number-edit");
  const targetQuantityInput = document.getElementById("target-stock-edit");

  // check that all input fields are non-empty, otherwise display an error message
  if (!itemNameInput.value || !stockInput.value || !targetQuantityInput.value) {
    msgDiv.innerHTML =
      "Please provide non-empty fields when adding a new Reagent";
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // get old and updated stock items
      const editedStockItem = JSON.parse(xhr.response);
      const oldStockItem = stockedFood.find((s) => s._id == stockIdInEdit);

      // set stock values to the edited values
      oldStockItem.item_name = editedStockItem.item_name;
      oldStockItem.quantity = editedStockItem.quantity;
      oldStockItem.target_quantity = editedStockItem.target_quantity;
      renderStock(stockedFood);

      //update stock chart
      updateStockChart(stockedFood);

      // close modal dialog
      // if using fetch, use "then"
      const closeBtn = document.getElementById("close-edit-modal");
      closeBtn.click();

      // clean up error message
      msgDiv.innerHTML = "";
      itemNameInput.value = "";
      stockInput.value = "";
      targetQuantityInput.value = "";
    }
  };

  // with POST, need to send a body with post
  xhr.open("PUT", api + stockIdInEdit, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(
    JSON.stringify({
      item_name: itemNameInput.value,
      quantity: parseInt(stockInput.value),
      target_quantity: parseInt(targetQuantityInput.value),
    }),
  );
});

function deleteStockItem(id) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200) {
      stockedFood = stockedFood.filter((x) => x._id != id); // filter ids that are all except the chosen id
      renderStock(stockedFood); // refreshes todos

      //update stock chart
      updateStockChart(stockedFood);
    }
  };

  // get api link from docs on page. need to open and send xhr request
  xhr.open("DELETE", api + id, true);
  xhr.send();
}

function setStockItemInEdit(id) {
  // find item with the corresponding id
  stockIdInEdit = id;
  const stockItem = stockedFood.find((s) => s._id == id);

  // set the input values in the edit modal to the current values of the stock item being edited
  document.getElementById("title-edit").value = stockItem.item_name;
  document.getElementById("stock-number-edit").value = stockItem.quantity;
  document.getElementById("target-stock-edit").value =
    stockItem.target_quantity;
}

/* Render stock data */
function renderStock(data) {
  // get the div where the stock data is rendered
  const stockDiv = document.getElementById("stock-table-data");
  stockDiv.innerHTML = ""; // clear before rerendering to avoid duplications

  // display data in descending order of quantity
  data
    .sort((a, b) => b.quantity - a.quantity)
    .forEach((x) => {
      // render each stock item as a row in the table
      stockDiv.innerHTML += `
        <tr id = "stock-item-${x._id}" class="stock-table-row">
            <td class = "stock-table-item">${x.item_name}</td>
            <td class = "stock-table-item">${x.quantity}</td>
            <td class = "stock-table-item">${x.target_quantity}</td>
            <td class = "stock-table-item">
                <button type="button" class = "btn btn-success btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#modal-edit"
                    onClick="setStockItemInEdit('${x._id}')">
                    <i class="bi bi-pencil-square"></i>
                    Edit
                </button>
                <button type="button" class = "btn btn-danger btn-sm"
                    onClick="deleteStockItem('${x._id}')">
                    <i class="bi bi-trash"></i>
                Delete
                </button>
            </td>
        </tr>
        `;
    });
}

/* Get all stock items from backend and render on page */
function getAllStockItems() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200) {
      stockedFood = JSON.parse(xhr.response) || [];
      console.log(stockedFood);
      renderStock(stockedFood);

      //Update the graph in stock
      updateStockChart(stockedFood);
    }
  };

  // get api link from docs on page. need to open and send xhr request
  xhr.open("GET", api, true);
  xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
  const addModalClear = document.getElementById("modal-add");
  addModalClear.addEventListener("hidden.bs.modal", () => {
    const msgDiv = document.getElementById("msg");
    msgDiv.innerHTML = "";
  });
  // Clear search input on page load
  const searchInput = document.getElementById("search-input");
  const searchResult = document.getElementById("search-result");

  if (searchInput) searchInput.value = "";

  if (searchResult) {
    searchResult.innerHTML = "";
  }
});




//This is to update the chart in the stock.html
function updateStockChart(data) {
  const canvas = document.getElementById("Stockchart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // API data into chart format
  const labels = data.map(item => item.item_name);
  const quantities = data.map(item => item.quantity);

  // clear
  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: "bar", //default is bar chart
    data: {
      labels: labels,
      datasets: [{
        label: "Current Stock",
        data: quantities,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true
    }
  });
}

//Search function:
document.getElementById("search-input").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const resultBody = document.getElementById("search-result");

  resultBody.innerHTML = "";

  if (!value) {
    // If empty search → clear table
    return;
  }

  const matches = stockedFood.filter(item =>
    item.item_name.toLowerCase().includes(value)
  );

  if (matches.length === 0) {
    resultBody.innerHTML = `
      <tr>
        <td colspan="2">No items found</td>
      </tr>
    `;
    return;
  }

  matches.forEach(item => {
    resultBody.innerHTML += `
      <tr>
        <td>${item.item_name}</td>
        <td>${item.quantity}</td>
      </tr>
    `;
  });

  // Optional: update chart to match search (VERY nice UX)
  updateStockChart(matches);
});

//Reset chart when search is cleared.

if (!value) {
  resultBody.innerHTML = "";
  updateStockChart(stockedFood); // reset chart
  return;
}