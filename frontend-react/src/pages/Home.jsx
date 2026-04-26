import "../App.css";
import { useSidebarToggle } from "../utilities/Sidebar-Toggle";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";


function Home() {
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
            <div className="main-structure-left">
              <h1>
                Welcome to IC Compassion Food Pantry Tracker! THIS IS USER
                LOGGED IN
              </h1>
              <p>
                <strong>p strong</strong>
              </p>
              <p>This will be quick links like homepage of myui</p>
              <div className="icon-span">
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
                <img src="icon-temporary.png" alt="Icon Homepage Links" />
              </div>
            </div>
            <div className="main-structure-right">
              <h2>When to expect people</h2>
              <br />
              <p>
                A table showing when the next people have chosen to arrive
                between 12 and 5 pm on wednesday
              </p>
              <table className="main-arrivals-table">
                <tbody>
                  <tr>
                    <th>12:00-12:30</th>
                    <th>3</th>
                  </tr>
                  <tr>
                    <th>12:30-1:00</th>
                    <th>5</th>
                  </tr>
                  <tr>
                    <th>1:00-1:30</th>
                    <th>2</th>
                  </tr>
                  <tr>
                    <th>1:30-2:00</th>
                    <th>0</th>
                  </tr>
                  <tr>
                    <th>2:00-2:30</th>
                    <th>17</th>
                  </tr>
                  <tr>
                    <th>2:30-3:00</th>
                    <th>3</th>
                  </tr>
                  <tr>
                    <th>3:00-3:30</th>
                    <th>0</th>
                  </tr>
                  <tr>
                    <th>3:30-4:00</th>
                    <th>1</th>
                  </tr>
                  <tr>
                    <th>4:00-4:30</th>
                    <th>7</th>
                  </tr>
                  <tr>
                    <th>4:30-5:00</th>
                    <th>7</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="main-structure-bottom">
              <h5>Reminders of low stock</h5>
              <h6>Header 6</h6>
              <p>
                This will be displaying data that is important to IC
                Compassion... maybe current stock or how many people helped
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer></Footer>
    </>
  );
}

export default Home;
