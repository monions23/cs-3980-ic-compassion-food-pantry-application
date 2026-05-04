import { NavLink } from "react-router-dom";
import {
  LOGGED_OUT_SIDEBAR_LINKS,
  AUTHENTICATED_SIDEBAR_LINKS,
} from "../utilities/Sidebar/Sidebar_Config";

import { useAuth } from "../utilities/UseAuth";
/* To toggle sidebar */
export default function Sidebar({ active }) {
  const { isAuthenticated, userRole, logout } = useAuth();

  // Filter sidebar links
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
            <NavLink
              onClick={() => logout(localStorage.getItem("access_token"))}
              className="sidebar-button"
              end
            >
              Log Out
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
}
