import "../App.css";
import { useSidebarToggle } from "../utilities/Sidebar-Toggle";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Trends() {
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

        <section className="main">
          <div className="main-grid">
            <div className="main-structure-left">
              <h1>Trends</h1>
              <p>
                <strong>p strong</strong>
              </p>
              <p>
                A big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph, A big
                paragraph, A big paragraph, A big paragraph, A big paragraph, A
                big paragraph, A big paragraph, A big paragraph
              </p>
            </div>
            <div className="main-structure-right">
              <h2>Header 2</h2>
              <br />
              <p>p</p>
              <hr />
              <h4>h4</h4>
            </div>
            <div className="main-structure-left">
              <h3>Header 3</h3>
            </div>
            <div className="main-structure-right">
              <div className="graph">
                <p>A graph goes here</p>
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

      <Footer></Footer>
    </>
  );
}

export default Trends;
