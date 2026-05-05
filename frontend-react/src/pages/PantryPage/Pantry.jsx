import { useEffect, useState } from "react";

import Layout from "../Layout";

import {
  getPantryRecords,
  addPantryRecord,
  deletePantryRecord,
} from "../../utilities/API_Files/Pantry-API";

// HELPER FUNCTIONS
import {
  filterLastHour,
  updateTodayTotal,
} from "../../utilities/Helper_Functions/Pantry_Date_Helpers";

export default function Pantry() {
  // Data state
  const [records, setRecords] = useState([]); // keep track of records
  const [todayTotal, setTodayTotal] = useState(0); // keep track of total clients served in day
  const [errorMsg, setErrorMsg] = useState(""); // keep track of error message

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    num_ppl_in_families: "",
  });

  /* =========================
     GET RECENT RECORDS (HANDLER)
  ========================= */
  async function getRecentRecords() {
    try {
      const data = await getPantryRecords(); // retrieve the data

      // update how many clients have visited today
      const dailyTotal = updateTodayTotal(data);
      console.log(dailyTotal);
      setTodayTotal(dailyTotal);

      // filter and display data from last hour
      const filteredData = filterLastHour(data);
      setRecords(filteredData);
      return filteredData;
    } catch (err) {
      console.error(err.message);
    }
  }

  /* =========================
     ADDING RECORD HANDLER
  ========================= */
  const handleAdd = async () => {
    // check that fields are not empty
    if (formData.name === "" || formData.num_ppl_in_families === "") {
      setErrorMsg("Please fill all fields");
      return;
    }

    // handle name data for insertion
    var name_words = formData.name.split(" ");
    var name_shortened = name_words[0].at(0) + name_words[1];
    var name_data = name_shortened.toLowerCase();
    const processedData = { ...formData, name: name_data };

    try {
      await addPantryRecord(processedData);
      getRecentRecords();

      // Then, reset all values
      setFormData({
        name: "",
        num_ppl_in_families: "",
      });
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  /* =========================
     DELETING RECORD HANDLER
  ========================= */
  const handleDelete = async (id) => {
    try {
      await deletePantryRecord(id);
      getRecentRecords();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    getRecentRecords();
  }, []); // empty array = runs once on mount

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

  return (
    <>
      <Layout>
        <div className="main-grid">
          {/* <!-- LEFT: FORM --> */}
          <div className="main-structure-left-two-rows">
            <form id="pantry-form" className="pantry-form">
              <h2 className="section-header">Food Pantry Form</h2>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Client Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="num-in-family" className="form-label">
                  Number of People in Family
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.num_ppl_in_families}
                  name="num_ppl_in_families"
                  id="num-in-family"
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 4"
                  required
                />
              </div>

              <div id="msg" className="text-danger mb-2">
                {errorMsg}
              </div>

              <button
                type="button"
                className="btn btn-primary pantry-submit"
                onClick={handleAdd}
              >
                Submit Record
              </button>
            </form>
          </div>

          {/* <!-- MIDDLE: UPDATES --> */}
          <div className="main-structure-right">
            <h2 className="section-header">Updates</h2>

            {/* Render updates list */}
            <div id="updates-list" className="updates-scroll-box">
              {records.length === 0 ? (
                <div className="pantry-history-info">No records yet</div> // ✅ div not p
              ) : (
                [...records]
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at),
                  )
                  .map((r) => (
                    <div
                      key={r.public_id}
                      className="pantry-update update-card"
                    >
                      <div className="pantry-updates-header">
                        Family of {r.num_ppl_in_families}
                      </div>
                      <br />
                      <div className="pantry-updates-date">
                        {new Date(r.created_at).toLocaleString()}
                      </div>
                      <button
                        className="Pantry-delete-btn"
                        onClick={() => handleDelete(r.public_id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* <!-- RIGHT: (OPTIONAL EMPTY OR FUTURE USE) --> */}
          <div className="main-structure-right">
            <h2 className="section-header">Today's Impact</h2>

            <div className="card p-3 text-center">
              <h5>People Served Today</h5>
              <h1 id="today-total" style={{ fontSize: "3rem" }}>
                {todayTotal}
              </h1>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
