import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto"; // for charts
import Topbar from "../components/Topbar"; // topbar component
import Sidebar from "../components/Sidebar"; // sidebar component
import Footer from "../components/Footer"; // footer component

import { useSidebarToggle } from "../utilities/Sidebar-Toggle"; // custom hook for sidebar toggle

const API = "http://127.0.0.1:8000/stock/"; // API url

export default function Stock() {
  const { active, toggleSidebar } = useSidebarToggle(); // sidebar toggle state and function
  const [stockedFood, setStockedFood] = useState([]); // stocked food items
  const [search, setSearch] = useState(""); // search input state
  const [errorMsgAdd, setErrorMsgAdd] = useState(""); // error message for add form
  const [errorMsgEdit, setErrorMsgEdit] = useState(""); // error message for edit form

  // Form state
  const [itemName, setItemName] = useState(""); // name of the stock item
  const [quantity, setQuantity] = useState(""); // current quantity of the stock item
  const [targetQuantity, setTargetQuantity] = useState(""); // target quantity of the stock item

  // Edit state
  const [editingId, setEditingId] = useState(null); // id of the item being edited, null if not editing

  // Chart reference
  const chartRef = useRef(null); // reference to the chart canvas
  const chartInstance = useRef(null); // reference to the Chart.js instance

  /* =========================
     CHART
  ========================= */
  const updateChart = (data) => {
    if (!chartRef.current) return; // if the canvas is not rendered yet, do nothing

    const labels = data.map((i) => i.item_name); // labels for the chart (item names)
    const quantities = data.map((i) => i.quantity); // current stock quantities
    const targets = data.map((i) => i.target_quantity); // target stock quantities

    // if a chart instance already exists, destroy it before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    //
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Current Stock",
            data: quantities,
            backgroundColor: "#65bac2",
          },
          { label: "Target Stock", data: targets, backgroundColor: "#bc1a38" },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  };

  /* =========================
     LOAD STOCK ITEMS
  ========================= */
  function getAllStockedItems() {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setStockedFood(data);
        updateChart(data);
      }
    };

    xhr.open("GET", API, true);
    xhr.send();
  }

  /* =========================
   GET STOCK ITEM BY ID
========================= */
  function getStockItem(id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status === 200) {
        return JSON.parse(xhr.response) || [];
      }
    };

    xhr.open("GET", API + id, true);
    xhr.send();
  }

  /* =========================
     ADD ITEM
  ========================= */
  const handleAdd = async () => {
    if (itemName === "" || quantity === "" || targetQuantity === "") {
      setErrorMsgAdd("Please fill all fields");
      return;
    }
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status === 201) {
        // const newItem = JSON.parse(xhr.response);
        getAllStockedItems(); // Refresh the list from the server to ensure consistency

        document.getElementById("close-add-modal")?.click();

        setItemName("");
        setQuantity("");
        setTargetQuantity("");
      }
    };

    xhr.open("POST", API, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(
      JSON.stringify({
        item_name: itemName,
        quantity: Number(quantity),
        target_quantity: Number(targetQuantity),
      }),
    );
  };

  /* =========================
     DELETE ITEM
  ========================= */
  const deleteItem = async (id) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status === 200) {
        const deleted = stockedFood.filter((x) => x.public_id !== id);

        setStockedFood(deleted);
        updateChart(deleted);
      }
    };

    xhr.open("DELETE", API + id, true);
    xhr.send();
  };

  /* =========================
     EDIT ITEM
  ========================= */
  const handleEdit = async () => {
    console.log(itemName);
    console.log(quantity);
    console.log(targetQuantity);
    if (itemName === "" || quantity === "" || targetQuantity === "") {
      setErrorMsgEdit("Please fill all fields");
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status === 200) {
        const updated = JSON.parse(xhr.response);
        const item = getStockItem(editingId);

        if (item) {
          item.item_name = updated.item_name;
          item.quantity = updated.quantity;
          item.target_quantity = updated.target_quantity;
        }

        document.getElementById("close-edit-modal")?.click();
        getAllStockedItems(); // Refresh the list from the server to ensure consistency

        setErrorMsgEdit("");
      }
    };

    xhr.open("PUT", API + editingId, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(
      JSON.stringify({
        item_name: itemName,
        quantity: parseInt(quantity),
        target_quantity: parseInt(targetQuantity),
      }),
    );
  };

  /* =========================
     FILTERED SEARCH RESULTS
  ========================= */
  const filtered = search
    ? stockedFood.filter((i) =>
        i.item_name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    getAllStockedItems();
  }, []);

  /* =========================
     JSX RETURN
  ========================= */
  return (
    <>
      <Topbar toggleSidebar={toggleSidebar} />

      <main className="container">
        <Sidebar active={active} />

        <section className="main">
          <div className="main-grid">
            {/* LEFT SIDE */}
            <div className="main-structure-left-two-rows">
              <p>
                This is to add items to stock to show on website and in archive
              </p>

              <div className="stock-title">
                <h2 className="section-header">Current Stock</h2>

                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modal-add"
                  type="button"
                  className="btn stockModalTrigger"
                  onClick={() => {
                    setItemName("");
                    setQuantity("");
                    setTargetQuantity("");
                    setErrorMsgAdd("");
                  }}
                >
                  <i className="bi bi-plus-circle"></i> Add Item
                </button>
              </div>

              <section className="stock-info">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th className="stock-header item">Item</th>
                      <th className="stock-header">Stock</th>
                      <th className="stock-header">Target Stock</th>
                      <th className="stock-header">Options</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stockedFood
                      .sort((a, b) => b.quantity - a.quantity)
                      .map((item) => (
                        <tr key={item.public_id}>
                          <td>{item.item_name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.target_quantity}</td>
                          <td>
                            <button
                              className="btn btn-success btn-sm me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#modal-edit"
                              onClick={() => {
                                setEditingId(item.public_id);
                                setItemName(item.item_name);
                                setQuantity(item.quantity);
                                setTargetQuantity(item.target_quantity);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteItem(item.public_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </section>
            </div>

            {/* SEARCH PANEL */}
            <div className="main-structure-right">
              <label htmlFor="search-input">Search items:</label>
              <input
                id="search-input"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <br />
              <br />

              <table className="search-answer-quantity">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length === 0 && search !== "" && (
                    <tr>
                      <td colSpan="2">No items found</td>
                    </tr>
                  )}

                  {filtered.map((item) => (
                    <tr key={item.public_id}>
                      <td>{item.item_name}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CHART */}
            <div className="main-structure-right">
              <div className="graph">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="main-structure-bottom">
              <h5>Header 5</h5>
              <h6>Header 6</h6>
              <p>
                These borders are just here to show the containers, they can be
                merged and hidden, its just for structure.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ADD MODAL */}
      <div id="modal-add" className="modal stock-modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Item to Stock</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Name of Item
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="stock-number" className="form-label">
                  Current Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="target-stock" className="form-label">
                  Target Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                />
              </div>

              <div className="text-danger">{errorMsgAdd}</div>
            </div>

            <div className="modal-footer">
              <button
                id="close-add-modal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <div id="modal-edit" className="modal stock-modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Stock Item</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title-edit" className="form-label">
                  Name of Item
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="stock-number-edit" className="form-label">
                  Current Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="target-stock-edit" className="form-label">
                  Target Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                />
              </div>

              <div className="text-danger">{errorMsgEdit}</div>
            </div>

            <div className="modal-footer">
              <button
                id="close-edit-modal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-warning"
                onClick={handleEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
