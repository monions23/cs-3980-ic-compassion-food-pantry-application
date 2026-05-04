import { useEffect, useState } from "react";

function Topbar({ toggleSidebar }) {
  const [email, setEmail] = useState("Not signed in");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // ❌ No token → not signed in
    if (!token) {
      setEmail("Not signed in");
      return;
    }

    // ✅ Decode token (fast + no API call needed)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email);
    } catch (e) {
      console.error("Invalid token");
      setEmail("Not signed in");
    }
  }, []);

  return (
    <>
      <div id="overlay" className="overlay" onClick={toggleSidebar}></div>

      <section className="topbar">
        <div className="logo">
          <span onClick={toggleSidebar}>☰</span> Iowa City Compassion Food Pantry
        </div>

        <div className="user">
          <span>Welcome, {email}</span>
        </div>
      </section>
    </>
  );
}

export default Topbar;