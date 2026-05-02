import "../App.css";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { resetPassword, changeEmail } from "../utilities/API_Files/Account-API";

function Account() {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");

  /* ====================
  RESET PASSWORD HANDLER
  ========================= */
  async function handlePasswordReset(event) {
    event.preventDefault();
    resetPassword(currentPassword, newPassword);
  }

  /* ====================
  EMAIL CHANGE HANDLER
  ========================= */
  async function handleEmailChange(event) {
    event.preventDefault();
    changeEmail(newEmail, confirmPassword, setUserEmail);
  }

  // document.addEventListener("DOMContentLoaded", () => {
  //   const resetLink = document.getElementById("resetPasswordLink");
  //   if (resetLink) {
  //     resetLink.addEventListener("click", (event) => {
  //       event.preventDefault();

  //       const section = document.getElementById("resetPasswordSection");
  //       if (section) {
  //         section.style.display = "block";
  //       } else {
  //         console.error("resetPasswordSection NOT FOUND");
  //       }
  //     });
  //   }

  //   const btn = document.getElementById("changeEmailBtn");
  //   if (btn) {
  //     btn.addEventListener("click", () => {
  //       const section = document.getElementById("changeEmailSection");
  //       if (section) {
  //         section.style.display = "block";
  //       } else {
  //         console.error("changeEmailSection NOT FOUND");
  //       }
  //     });
  //   }
  // });
  return (
    <>
      <Layout>
        <div className="main-grid">
          <div className="main-structure-left">
            <h1>Account</h1>
            <hr />
            <div className="account-info">
              <div className="account-row">
                <span className="account-label">Username:</span>
                <span>######</span>
              </div>
              <div className="account-row">
                <span className="account-label">Email:</span>
                <span>Email@email.com</span>
              </div>
              <div className="account-row">
                <span className="account-label">Status:</span>
                <span>Admin/User/Viewer</span>
              </div>
            </div>
          </div>
          <div className="main-structure-right">
            <h2>Dashboard</h2>
            <br />
            <a href="#" id="resetPasswordLink">
              Reset password
            </a>
            <hr />
            <a href="#" id="changeEmailBtn">
              Change email
            </a>
            <hr />

            <br />
            <br />
            <br />
            <br />
            <div id="resetPasswordSection" style={{ display: "none" }}>
              <h3>Reset Password</h3>

              <form onSubmit={() => resetPassword(event)}>
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="Current password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  id="newPassword"
                  placeholder="New password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button type="submit">Reset</button>
              </form>
            </div>
            <div id="changeEmailSection" style={{ display: "none" }}>
              <h3>Change Email</h3>

              <form onSubmit={() => submitChangeEmail(event)}>
                <input
                  type="email"
                  id="newEmail"
                  placeholder="New email"
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="submit">Update Email</button>
              </form>
            </div>
          </div>
          <div className="main-structure-left">
            <h3>Manage Account</h3>
            <p>Table with changing permissions in Admin Veiw</p>
            <hr />
          </div>
          <div className="main-structure-right"></div>
        </div>
      </Layout>
    </>
  );
}

export default Account;
