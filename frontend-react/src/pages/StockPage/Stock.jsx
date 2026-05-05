import { useEffect, useState } from "react";

// Components
import Layout from "../Layout";
import StockChart from "./StockChart";
import StockModal from "./StockModal";

// API CALLS
import {
  getAllStock,
  addStockItem,
  deleteStockItem,
  editStockItem,
} from "../../utilities/API_Files/Stock-API";

export default function Stock() {
  // Utilities
  const [search, setSearch] = useState(""); // search input state
  const [errorMsg, setErrorMsg] = useState(""); // error message for add and edit forms
  const [editingId, setEditingId] = useState(null); // id of the item being edited, null if not editing

  // Stocked food (all data)
  const [stockedFood, setStockedFood] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    item_name: "",
    quantity: "",
    target_quantity: "",
  });

  /* =========================
     GET ALL STOCK ITEMS
  ========================= */
  async function getAllStockedItems() {
    try {
      const data = await getAllStock();
      setStockedFood(data);
      setErrorMsg(""); // clear old errors on success
    } catch (err) {
      setErrorMsg(err.message); // THIS is where error updates happen
    }
  }

  /* =========================
     ADD ITEM
  ========================= */
  const handleAdd = async () => {
  if (
    formData.item_name === "" ||
    formData.quantity === "" ||
    formData.target_quantity === ""
  ) {
    setErrorMsg("Please fill all fields");
    return;
  }

  if (formData.quantity < 0 || formData.target_quantity < 0) {
    setErrorMsg("Stock values cannot be negative");
    return;
  }

  const normalizedName = formData.item_name.trim().toLowerCase();

  const exists = stockedFood.some(
    (item) => item.item_name.trim().toLowerCase() === normalizedName
  );

  if (exists) {
    setErrorMsg("An item with this name already exists");
    return;
  }

  try {
    await addStockItem(formData);
    getAllStockedItems();
    document.getElementById("close-add-modal")?.click();

    setFormData({
      item_name: "",
      quantity: "",
      target_quantity: "",
    });
    setErrorMsg("");
  } catch (err) {
    setErrorMsg(err.message);
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

    //Throw error if negative
    if (formData.quantity < 0 || formData.target_quantity < 0) {
      setErrorMsg("Stock values cannot be negative");
      return;
    }

    const normalizedName = formData.item_name.trim().toLowerCase();

    const exists = stockedFood.some(
      (item) =>
        item.public_id !== editingId && // allow same item being edited
        item.item_name.trim().toLowerCase() === normalizedName
    );

    if (exists) {
      setErrorMsg("Another item with this name already exists");
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

    // ALTERNATE SOLUTION FOR LINTER
    //     const fetchStock = async () => {
    //   try {
    //     const data = await getAllStock();
    //     setStockedFood(data);
    //     setErrorMsg("");
    //   } catch (err) {
    //     setErrorMsg(err.message);
    //   }
    // };
    // fetchStock();
  }, []); // empty array = runs once on mount

  /* =========================
     HANDLE CHANGE TO FORM VALUES
  ========================= */
  const handleChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  // Only apply rules to numeric fields
  if (name === "quantity" || name === "target_quantity") {
    // Convert to number
    const num = Number(value);

    // Prevent negatives
    if (num < 0) {
      setErrorMsg("Stock values cannot be negative");
      return; // stop update entirely
    }

    // Optional: prevent decimals
    if (!Number.isInteger(num)) {
      setErrorMsg("Stock must be a whole number");
      return;
    }

    newValue = num;
  }

  setErrorMsg(""); // clear error if valid

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};

  /* =========================
     UPDATE CHART WHEN STOCKED FOOD CHANGES
  ========================= */
  // useEffect(() => {
  //   updateChart(stockedFood);
  // }, [stockedFood]);

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
                <i className="add-stock-button">Add Item</i> 
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
                            className="stock-edit-button"
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
                            className="stock-delete-btn"
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
            {/* Check if there is a search term entered; if so returned filtered data, otherwise return all stocked food */}
            <StockChart data={search ? filtered : stockedFood}></StockChart>
          </div>
        </div>
      </Layout>

      <StockModal
        mode="Add"
        formData={formData}
        handleChange={handleChange}
        crudHandler={handleAdd}
        errorMsg={errorMsg}
      ></StockModal>
      <StockModal
        mode="Edit"
        formData={formData}
        handleChange={handleChange}
        crudHandler={handleEdit}
        errorMsg={errorMsg}
      ></StockModal>
    </>
  );
}
