import "../App.css";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { getPantryRecords } from "../utilities/API_Files/Pantry-API";

export default function Archive() {
  const [pantryRecords, setPantryRecords] = useState([]);

  useEffect(() => {
    async function loadPantryRecords() {
      try {
        const data = await getPantryRecords();
        setPantryRecords(data);
      } catch (err) {
        console.error("Failed to load records:", err);
      }
    }
    loadPantryRecords();
  }, []);

  const sorted = [...pantryRecords].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
  );

  return (
    <>
      <Layout>
        <div className="main-grid">
          <div className="main-structure-left">
          <section className="archive-title">
            <h1 style={{ display: "inline-block" }}>Archive</h1>
          </section>
          </div>
          <div className="main-structure-right">
            <button
              id="print-btn"
              className="archive-print-button"
              onClick={() => window.print()}
            >
              Print recent logs
            </button>
            <br />
           
          
          </div>
          <div className="main-structure-bottom">
          <section className="archive-info">
            <table className="archive-table">
              <thead>
                <tr>
                  <th className="archive-header">Date</th>
                  <th className="archive-header">Family size</th>
                </tr>
              </thead>
              <tbody>
                {pantryRecords.length === 0 ? (
                  <tr>
                    <td colSpan="2">No records found</td>
                  </tr>
                ) : (
                  sorted.map((record, i) => {
                    if (!record.created_at) return null;
                    const dateObj = new Date(record.created_at + "Z");
                    if (isNaN(dateObj)) return null;
                    const localDate = dateObj.toLocaleString();
                    const familySize = record.num_ppl_in_families || 0;

                    return (
                      <tr key={i}>
                        <td>{localDate}</td>
                        <td>{familySize}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <br />
          </section>
          </div>
        </div>
      </Layout>
    </>
  );
}
