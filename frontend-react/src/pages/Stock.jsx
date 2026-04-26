import "../App.css";
import { useSidebarToggle } from "../utilities/Sidebar-Toggle";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Stock() {
  {
    /* Universal hook that is passed to topbar and sidebar components */
  }
  const { active, toggleSidebar } = useSidebarToggle();

  return (
    <>
      <Topbar toggleSidebar={toggleSidebar}></Topbar>

      {/* Main Content Table, Can be merged or sorted differently */}
      <main className="container">
        <Sidebar active={active}></Sidebar>

        {/* Main Content Table, Can be merged or sorted differently */}
        <section className="main">
          <div className="main-grid">
            <div className="main-structure-left-two-rows">
              <p>
                This is to add items to stock to show on website and in archive
              </p>
              <div className="stock-title">
                <h2 className="section-header">Current Stock</h2>
                <button
                  id="stockModalTrigger"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-add"
                  type="button"
                  className="btn stockModalTrigger"
                >
                  <i className="bi bi-plus-circle"></i> Add Item
                </button>
              </div>
              <section className="stock-info">
                <table className="stock-table" id="stock-table">
                  <thead>
                    <tr>
                      <th className="stock-header item">Item</th>
                      <th className="stock-header">Stock</th>
                      <th className="stock-header">Target Stock</th>
                      <th className="stock-header">Options</th>
                    </tr>
                  </thead>
                  <tbody id="stock-table-data"></tbody>
                </table>
              </section>
            </div>
            <div className="main-structure-right">
              <div className="graph">
                <p>
                  A Table to search through the stock and list the number here
                </p>
              </div>
            </div>
            <div className="main-structure-right">
              <div className="graph">
                <p>A graph showing change in stock within past two months</p>
              </div>
            </div>
            <div className="main-structure-bottom">
              <h5>Header 5</h5>
              <h6>Header 6</h6>
              <p>
                These borders are just here to show the containers, they can be
                merged and hidden, its just for structure. I separated left and
                right in the table so that if we wanted we can make a middle
                partition easy.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* MODALS
        modal needs to be in body level
        modal dialog for adding */}
      <div id="modal-add" class="modal stock-modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Item to Stock</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div id="new-stock-item">
                <div class="mb-3">
                  <label for="title" class="form-label">
                    Name of Item
                  </label>
                  <input type="text" class="form-control" id="title" />
                </div>
                <div class="mb-3">
                  <label for="stock-number" class="form-label">
                    What is the current stock of the item?
                  </label>
                  <input type="number" class="form-control" id="stock-number" />
                </div>
                <div class="mb-3">
                  <label for="target-stock" class="form-label">
                    What is the ideal stock of the item?
                  </label>
                  <input type="number" class="form-control" id="target-stock" />
                </div>
                <div class="text-danger" id="msg"></div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                id="close-add-modal"
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                <i class="bi bi-x"></i> Close
              </button>
              <button id="add-btn" type="button" class="btn btn-primary">
                <i class="bi bi-plus-circle"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div id="modal-edit" class="modal stock-modal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Stock Item</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div id="edit-stock-item-form">
                <div class="mb-3">
                  <label for="title-edit" class="form-label">
                    Name of Item
                  </label>
                  <input type="text" class="form-control" id="title-edit" />
                </div>
                <div class="mb-3">
                  <label for="stock-number-edit" class="form-label">
                    What is the current stock of the item?
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="stock-number-edit"
                  />
                </div>
                <div class="mb-3">
                  <label for="target-stock-edit" class="form-label">
                    What is the ideal stock of the item?
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="target-stock-edit"
                  />
                </div>
                <div class="text-danger" id="msg-edit"></div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                id="close-edit-modal"
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                <i class="bi bi-x"></i> Close
              </button>
              <button id="edit-btn" type="button" class="btn btn-warning">
                <i class="bi bi-check-circle"></i> Yes, Update it
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}

export default Stock;
