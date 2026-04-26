import "../App.css";
import { useSidebarToggle } from "../utilities/Sidebar-Toggle";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function Account() {
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
        <section class="main">
          <div class="main-grid">
            <div class="main-structure-left">
              <h1>Account USER OR ADMIN ONLY</h1>
              <hr />
              <table class="account-table">
                <tr>
                  <th>
                    <strong>Username:</strong>
                  </th>
                  <td>######</td>
                </tr>
                <tr>
                  <th>
                    <strong>Email:</strong>
                  </th>
                  <td>Email@email.com</td>
                </tr>
                <tr>
                  <th>
                    <strong>Status:</strong>
                  </th>
                  <td>Admin/User/Viewer</td>
                  {/* <Admin can change permissions
                 User can veiw all pages but cant change permissions
                 Veiwer is someone who mistakenly logged in. 
                 Maybe they cann see the trends? */}
                </tr>
              </table>
            </div>
            <div class="main-structure-right">
              <h2>Header 2</h2>
              <br />
              <p>Reset password</p>
              <hr />
              <p>Reset Username</p>
              <hr />
              <p>Change email</p>
              <hr />

              <br />
              <br />
              <br />
              <br />
            </div>
            <div class="main-structure-left">
              <h3>Header 3</h3>
              <p>Table with changing permissions in Admin Veiw</p>
              <hr />
            </div>
            <div class="main-structure-right"></div>
          </div>
        </section>
      </main>

      <Footer></Footer>
    </>
  );
}

export default Account;
