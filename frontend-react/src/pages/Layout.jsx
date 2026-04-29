import Topbar from "../components/Topbar"; // topbar component
import Sidebar from "../components/Sidebar"; // sidebar component
import Footer from "../components/Footer"; // footer component

import { useSidebarToggle } from "../utilities/Sidebar-Toggle"; // custom hook for sidebar toggle

// components/Layout.js
export default function Layout({ children }) {
  const { active, toggleSidebar } = useSidebarToggle(); // sidebar toggle state and function

  return (
    <>
      <Topbar toggleSidebar={toggleSidebar} />
      <main className="container">
        <Sidebar active={active} />
        {/* This "children" is where the unique magic of each page lives */}
        <section className="main">{children}</section>
      </main>
      <Footer />
    </>
  );
}
