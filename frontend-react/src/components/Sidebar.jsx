import { NavLink } from "react-router-dom";

/* To toggle sidebar */
function Sidebar({ active }) {
  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${active ? "active" : ""}`} id="sidebar">
        <div className="sidebar-links">
          <NavLink to="/" className="sidebar-button" end>
            Home
          </NavLink>
        </div>
        <div className="sidebar-links">
          <NavLink to="/archive" className="sidebar-button" end>
            Archive
          </NavLink>
        </div>
        <div className="sidebar-links">
          <NavLink to="/trends" className="sidebar-button" end>
            Trends
          </NavLink>
        </div>
        <div className="sidebar-links">
          <NavLink to="/stock" className="sidebar-button" end>
            Stock
          </NavLink>
        </div>
        <div className="sidebar-links">
          <NavLink to="/account" className="sidebar-button" end>
            Account
          </NavLink>
        </div>
        <div className="sidebar-links">
          <NavLink to="/tasks" className="sidebar-button" end>
            Task Manager
          </NavLink>
        </div>
        <div className="sidebar-links">
          <NavLink to="/pantry" className="sidebar-button" end>
            Pantry
          </NavLink>
        </div>
        <div className="sidebar-links">Log Out</div>
        {/* Doesn't do anything yet */}
      </aside>
    </>
  );
}

export default Sidebar;
