import "../App.css";
import { useSidebarToggle } from "../utilities/Sidebar-Toggle";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Archive() {
  {
    /* Universal hook that is passed to topbar and sidebar components */
  }
  const { active, toggleSidebar } = useSidebarToggle();

  return (
    <>
      <Topbar toggleSidebar={toggleSidebar}></Topbar>
      <main className="container">
        <Sidebar active={active}></Sidebar>

        {/* Main Content Table, Can be merged or sorted differently*/}
        <section className="main">
          <div className="main-grid">
            <section className="archive-title">
              <h1>Archive</h1>
            </section>
            <section className="archive-info">
              <table className="archive-table">
                <tr>
                  <th className="archive-header">Month and Year</th>
                  <th className="archive-header">
                    Average Number of Families Supported
                  </th>
                  <th className="archive-header">Most Popular Item</th>
                </tr>
                <tr>
                  <td className="archive-table-item">Add through JS</td>
                  <td className="archive-table-item">Add through JS</td>
                  <td className="archive-table-item">Add through JS</td>
                </tr>
              </table>
              <button class="archive-print-button">Print recent logs</button>
            </section>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer></Footer>
    </>
  );
}

export default Archive;
