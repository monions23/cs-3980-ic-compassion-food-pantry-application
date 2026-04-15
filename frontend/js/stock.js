let stockedFood = [];
const api = "http://127.0.0.1:8000/stock/";
let stockIdInEdit = 0;

document.getElementById("add-btn").addEventListener("click", (e) => {
  e.preventDefault();

  // get id from form input in modal and assign to what will be added by using .value
  const msgDiv = document.getElementById("msg");
  const itemNameInput = document.getElementById("title");
  const stockInput = document.getElementById("stock-number");
  const targetQuantityInput = document.getElementById("target-stock");

  if (!itemNameInput.value || !stockInput.value || !targetQuantityInput.value) {
    msgDiv.innerHTML =
      "Please provide non-empty fields when adding a new Reagent";
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 201) {
      const newStockItem = JSON.parse(xhr.response);
      stockedFood.push(newStockItem);
      renderStock(stockedFood);

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

  console.log(itemNameInput.value);
  console.log(stockInput.value);
  console.log(targetQuantityInput.value);
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
  const msgDiv = document.getElementById("msgEdit");
  const titleInput = document.getElementById("titleEdit");
  const descInput = document.getElementById("descEdit");
  const dateInput = document.getElementById("open_dateEdit");
  const freezerInput = document.getElementById("freezerEdit");
  const protocolInput = document.getElementById("protocolEdit");

  if (
    !titleInput.value ||
    !descInput.value ||
    !dateInput.value ||
    !freezerInput.value ||
    !protocolInput.value
  ) {
    msgDiv.innerHTML =
      "Please provide non-empty fields when adding a new Reagent";
    return;
  }

  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      const newReagent = JSON.parse(xhr.response);
      const reagent = data.find((x) => x.id == reagentIdInEdit);
      reagent.title = newReagent.title;
      reagent.desc = newReagent.desc;
      reagent.open_date = newReagent.open_date;
      reagent.freezer = newReagent.freezer;
      reagent.protocol = newReagent.protocol;
      renderStock(data);

      // close modal dialog
      // if using fetch, use "then"
      const closeBtn = document.getElementById("close-edit-modal");
      closeBtn.click();

      // clean up error message
      msgDiv.innerHTML = "";
      titleInput.value = "";
      descInput.value = "";
      dateInput.value = "";
      freezerInput.value = "";
    }
  };

  // with POST, need to send a body with post
  xhr.open("PUT", api + "/" + reagentIdInEdit, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(
    JSON.stringify({
      title: titleInput.value,
      desc: descInput.value,
      open_date: dateInput.value,
      freezer: freezerInput.value,
      protocol: protocolInput.value,
    }),
  );
});

function deleteReagent(id) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200) {
      data = data.filter((x) => x.id != id); // filter ids that are all except the chosen id
      renderStock(data); // refreshes todos
    }
  };

  // get api link from docs on page. need to open and send xhr request
  xhr.open("DELETE", api + "/" + id, true);
  xhr.send();
}

function setReagentInEdit(id) {
  reagentIdInEdit = id;

  const reagent = data.find((r) => r.id == id);

  document.getElementById("titleEdit").value = reagent.title;
  document.getElementById("descEdit").value = reagent.desc;
  document.getElementById("open_dateEdit").value = reagent.open_date;
  document.getElementById("freezerEdit").value = reagent.freezer;
  document.getElementById("protocolEdit").value = reagent.protocol;
}

/* Render stock data */
function renderStock(data) {
  const stockDiv = document.getElementById("stock-table-data");
  stockDiv.innerHTML = "";
  data
    .sort((a, b) => b.quantity - a.quantity)
    .forEach((x) => {
      stockDiv.innerHTML += `
        <tr id = "stock-item-${x.id}" class="stock-table-row">
            <td class = "stock-table-item">${x.item_name}</td>
            <td class = "stock-table-item">${x.quantity}</td>
            <td class = "stock-table-item">${x.target_quantity}</td>
            <td class = "stock-table-item">Edit button</td>
        </tr>
        `; // names must match the other ones from the app
    });
}

function getAllStockItems() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200) {
      data = JSON.parse(xhr.response) || [];
      console.log(data);
      renderStock(data);
    }
  };

  // get api link from docs on page. need to open and send xhr request
  xhr.open("GET", api, true);
  xhr.send();
}

(() => {
  getAllStockItems();
})();

document.addEventListener("DOMContentLoaded", () => {
  const addModalClear = document.getElementById("modal-add");
  addModalClear.addEventListener("hidden.bs.modal", () => {
    const msgDiv = document.getElementById("msg");
    msgDiv.innerHTML = "";
  });
});
