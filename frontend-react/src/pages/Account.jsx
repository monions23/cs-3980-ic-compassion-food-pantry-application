import { useState, useEffect } from "react";

//. Components
import Layout from "./Layout";

// API Calls
import {
  resetPassword,
  changeEmail,
  getUser,
  getAllUsers,
  updateRole,
} from "../utilities/API_Files/Account-API";

export default function Account() {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  /* ====================
  LOAD A USER
  ========================= */
  async function loadUser() {
    const token = localStorage.getItem("access_token");

    const data = await getUser(token);
    setUser(data);

    if (data.role === "SuperAdmin") {
      loadAdminTable();
    }
  }

  /* ====================
  LOAD USERS IN ADMIN TABLE
  ========================= */
  async function loadAdminTable() {
    const token = localStorage.getItem("access_token");

    const data = await getAllUsers(token);
    setUsers(data);
  }

  /* ====================
  UPDATE A ROLE
  ========================= */
  async function updateRoleHandler(userId, newRole) {
    const token = localStorage.getItem("access_token");

    await updateRole(token, userId, newRole);

    alert("Role updated!");
  }

  /* ====================
  PASSWORD RESET HANDLER
  ========================= */
  async function handlePasswordReset(e) {
    e.preventDefault();
    const res = await resetPassword(currentPassword, newPassword);
    if (!res.ok) return alert("Failed");
    alert("Password updated!");
  }

  /* ====================
  EMAIL CHANGE HANDLER
  ========================= */
  async function handleEmailChange(e) {
    e.preventDefault();
    const res = await changeEmail(newEmail, confirmPassword);
    const data = await res.json();

    if (!res.ok) return alert("Failed");

    localStorage.setItem("access_token", data.access_token);
    alert("Email updated!");
  }

  return (
    <Layout>
      <div className="main-grid">
        {/* LEFT SIDE */}
        <div className="main-structure-left">
          <h1>My Account</h1>
          <hr />

          <table className="account-table">
            <tbody>
              <tr>
                <th>Email:</th>
                <td>{user ? user.email : "Loading..."}</td>
              </tr>
              <tr>
                <th>Role:</th>
                <td>{user ? user.role : "Loading..."}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE */}
        <div className="main-structure-right">
          <h2>Account Settings</h2>
          <br />

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowResetPassword(!showResetPassword);
            }}
          >
            Reset password
          </a>

          <hr />

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowChangeEmail(!showChangeEmail);
            }}
          >
            Change email
          </a>

          <hr />

          {showResetPassword && (
            <div>
              <h3>Reset Password</h3>
              <form onSubmit={handlePasswordReset}>
                <input
                  type="password"
                  placeholder="Current password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="submit">Reset</button>
              </form>
            </div>
          )}

          {showChangeEmail && (
            <div>
              <h3>Change Email</h3>
              <form onSubmit={handleEmailChange}>
                <input
                  type="email"
                  placeholder="New email"
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Update Email</button>
              </form>
            </div>
          )}
        </div>

        {/* ADMIN TABLE */}
        {user?.role === "SuperAdmin" && (
          <div className="main-structure-bottom">
            <h3>Manage Account</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>
                      <select
                        defaultValue={u.role}
                        onChange={(e) =>
                          updateRoleHandler(u.id, e.target.value)
                        }
                      >
                        <option value="BasicUser">Basic User</option>
                        <option value="SuperAdmin">Super Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />
          </div>
        )}
      </div>
    </Layout>
  );
}
