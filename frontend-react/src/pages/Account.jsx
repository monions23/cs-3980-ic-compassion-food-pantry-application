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
        <section className="main">
          <div className="main-grid">
            <div className="main-structure-left">
              <h1>Account USER OR ADMIN ONLY</h1>
              <hr />
              <table className="account-table">
                <th>
                  <strong>Username:</strong>
                </th>
                <td>######</td>
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
                  <td>Admin/User/Veiwer</td>
                  {/* Admin can change permissions
                 User can veiw all pages but cant change permissions
                 Veiwer is someone who mistakenly logged in. 
                 Maybe they can see the trends? */}
                </tr>
              </table>
            </div>
            <div className="main-structure-right">
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
            <div className="main-structure-left">
              <h3>Header 3</h3>
              <p>Table with changing permissions in Admin Veiw</p>
              <hr />
            </div>
            <div className="main-structure-right"></div>
          </div>
        </section>
      </main>

      <Footer></Footer>
    </>
  );
}

export default Account;
