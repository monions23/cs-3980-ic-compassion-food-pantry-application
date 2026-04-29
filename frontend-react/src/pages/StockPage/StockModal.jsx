export default function StockModal({
  mode,
  formData,
  handleChange,
  crudHandler,
  errorMsg,
}) {
  var title = "";

  if (mode === "Add") {
    title = "Add Item to Stock";
  } else if (mode === "Edit") {
    title = "Edit Stock Item";
  } else {
    throw new Error("Error: Undefined Mode for Modal");
  }
  return (
    <>
      {/* MODAL */}
      <div
        id={`modal-${mode.toLowerCase()}`}
        className="modal stock-modal"
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
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
                id={`close-${mode.toLowerCase()}-modal`}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={crudHandler}
              >
                {mode}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
