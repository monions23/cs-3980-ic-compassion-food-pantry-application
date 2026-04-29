import { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto"; // for charts
import Layout from "./Layout";

// API CALLS
import {
  getAllStock,
  addStockItem,
  deleteStockItem,
  editStockItem,
} from "../utilities/Stock-API";

export default function Stock() {
  // Utilities
  const [search, setSearch] = useState(""); // search input state
  const [errorMsg, setErrorMsg] = useState(""); // error message for add and edit forms
  const [editingId, setEditingId] = useState(null); // id of the item being edited, null if not editing

  // Chart reference
  const chartRef = useRef(null); // reference to the chart canvas
  const chartInstance = useRef(null); // reference to the Chart.js instance

  // Stocked food (all data)
  const [stockedFood, setStockedFood] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    target_quantity: "",
  });

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
  };

  /* =========================
     GET ALL STOCK ITEMS
  ========================= */
  async function getAllStockedItems() {
    try {
      const data = await getAllStock();

      setStockedFood(data);
      updateChart(data);

      setErrorMsg(""); // clear old errors on success
    } catch (err) {
      setErrorMsg(err.message); // THIS is where error updates happen
    }
  }

  /* =========================
     ADD ITEM
  ========================= */
  const handleAdd = async () => {
    // make sure there are no empty fields in the form
    if (
      formData.item_name === "" ||
      formData.quantity === "" ||
      formData.target_quantity === ""
    ) {
      setErrorMsg("Please fill all fields");
      return;
    }

    try {
      await addStockItem(formData);
      getAllStockedItems();
      document.getElementById("close-add-modal")?.click();

      // Then, reset all values
      setFormData({
        item_name: "",
        quantity: "",
        target_quantity: "",
      });
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.message); // THIS is where error updates happen
    }
  };

  /* =========================
     DELETE ITEM
  ========================= */
  const handleDelete = async (id) => {
    try {
      await deleteStockItem(id);
      const deleted = stockedFood.filter((x) => x.public_id != id);
      setStockedFood(deleted);
      updateChart(deleted);
    } catch (err) {
      setErrorMsg(err.message); // THIS is where error updates happen
    }
  };

  /* =========================
     EDIT ITEM
  ========================= */
  const handleEdit = async () => {
    console.log(formData);
    if (
      formData.item_name === "" ||
      formData.quantity === "" ||
      formData.target_quantity === ""
    ) {
      setErrorMsg("Please fill all fields");
      return;
    }

    try {
      await editStockItem(editingId, formData);
      document.getElementById("close-edit-modal")?.click();
      getAllStockedItems(); // Refresh the list from the server to ensure consistency

      setFormData({
        item_name: "",
        quantity: "",
        target_quantity: "",
      });
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.message); // THIS is where error updates happen
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    getAllStockedItems();
  }, []);

  /* =========================
     HANDLE CHANGE TO FORM VALUES
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // This dynamically updates whichever field was changed
    });
  };

  /* =========================
     UPDATE CHART WHEN STOCKED FOOD CHANGES
  ========================= */
  useEffect(() => {
    updateChart(stockedFood);
  }, [stockedFood]);

  /* =========================
     FILTERED SEARCH RESULTS
  ========================= */
  const filtered = search
    ? stockedFood.filter((i) =>
        i.item_name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  /* =========================
     JSX RETURN
  ========================= */
  return (
    <>
      <Layout>
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
                  setFormData({
                    item_name: "",
                    quantity: "",
                    target_quantity: "",
                  });
                  setErrorMsg("");
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
                              setFormData({
                                item_name: item.item_name,
                                quantity: item.quantity,
                                target_quantity: item.target_quantity,
                              });
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.public_id)}
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
            <br></br>
            <div className="chart-container">
              <div className="graph">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </Layout>

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
                  value={formData.item_name}
                  onChange={handleChange}
                  name="item_name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="stock-number" className="form-label">
                  Current Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  name="quantity"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="target-stock" className="form-label">
                  Target Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.target_quantity}
                  onChange={handleChange}
                  name="target_quantity"
                />
              </div>

              <div className="text-danger">{errorMsg}</div>
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
                  value={formData.item_name}
                  onChange={handleChange}
                  name="item_name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="stock-number-edit" className="form-label">
                  Current Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  name="quantity"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="target-stock-edit" className="form-label">
                  Target Stock
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.target_quantity}
                  onChange={handleChange}
                  name="target_quantity"
                />
              </div>

              <div className="text-danger">{errorMsg}</div>
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
    </>
  );
}
