import { NavLink } from "react-router-dom";
import {
  LOGGED_OUT_SIDEBAR_LINKS,
  AUTHENTICATED_SIDEBAR_LINKS,
} from "../utilities/Sidebar/Sidebar_Config";

/* To toggle sidebar */
export default function Sidebar({ active, userRole, isAuthenticated }) {
  const sidebarLinks = isAuthenticated
    ? AUTHENTICATED_SIDEBAR_LINKS.filter((link) =>
        link.roles.includes(userRole),
      )
    : LOGGED_OUT_SIDEBAR_LINKS;
  return (
    <>
      {/* Display the filtered links */}
      <aside className={`sidebar ${active ? "active" : ""}`} id="sidebar">
        {sidebarLinks.map((link) => (
          <div key={link.path} className="sidebar-links">
            <NavLink to={link.path} className="sidebar-button" end>
              {link.label}
            </NavLink>
          </div>
        ))}

        {/* Logout button for authenticated users */}
        {isAuthenticated && (
          <div className="sidebar-links">
            <button
              onClick={() => {
                /* logout function */
              }}
              className="sidebar-button"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              Log Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
