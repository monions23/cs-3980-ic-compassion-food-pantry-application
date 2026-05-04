import "../App.css";
import { useState } from "react";
import Layout from "./Layout";
import { resetPassword, changeEmail } from "../utilities/API_Files/Account-API";
import { useEffect } from "react";

export default function Account() {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch("http://127.0.0.1:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    }

    loadUser();
  }, []);

  /* ====================
  RESET PASSWORD HANDLER
  ========================= */
  async function handlePasswordReset(event) {
    event.preventDefault();

    try {
      const response = await resetPassword(currentPassword, newPassword);
      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Password update failed");
        return;
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Connection error. Please try again.");
      return;
    }

    alert("Password successfully updated!");
  }

  /* ====================
  EMAIL CHANGE HANDLER
  ========================= */
  async function handleEmailChange(event) {
    event.preventDefault();

    try {
      const response = await changeEmail(newEmail, confirmPassword);
      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Failed to update email");
        return;
      }

      // IMPORTANT: replace token
      localStorage.setItem("access_token", data.access_token);

      alert("Email updated successfully");
    } catch (error) {
      console.error("Network error:", error);
      alert("Connection error. Please try again.");
      return;
    }
  }

  return (
    <>
      <Layout>
        <div className="main-grid">
          <div className="main-structure-left">
            <h1>Account</h1>
            <hr />
            <div className="account-info">
              <div className="account-row">
                <span className="account-label">Email:</span>
                <span>{user ? user.email : "Loading..."}</span>
              </div>
              <div className="account-row">
                <span className="account-label">Role:</span>
                <span>{user ? user.role : "Loading..."}</span>
              </div>
            </div>
          </div>
          <div className="main-structure-right">
            <h2>Dashboard</h2>
            <br />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowResetPassword(prev => !prev);
              }}
              id="resetPasswordLink"
            >
              Reset password
            </a>
            <hr />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowChangeEmail(prev => !prev);
              }}
              id="changeEmailBtn"
            >
              Change email
            </a>
            <hr />
            {/* Only show reset password div if show reset password is true */}
            {showResetPassword && (
              <div id="resetPasswordSection">
                <h3>Reset Password</h3>

                <form onSubmit={handlePasswordReset}>
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
            )}
            {/* Only show change email div if show change email is true */}
            {showChangeEmail && (
              <div id="changeEmailSection">
                <br />
                <h3>Change Email</h3>

                <form onSubmit={handleEmailChange}>
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
            )}
          </div>
          <div className="main-structure-left">
            <h3>Manage Account</h3>
            <p>Table with changing permissions in Admin View</p>
            <hr />
          </div>
          {/* <div className="main-structure-right"></div> */}
        </div>
      </Layout>
    </>
  );
}
