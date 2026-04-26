function Topbar({ toggleSidebar }) {
  return (
    <>
      <div id="overlay" className="overlay" onClick={toggleSidebar}></div>
      {/* Top Bar */}
      <section className="topbar">
        <div className="logo">
          {/* This is the ☰ Iowa City Compassion in top left */}
          <span onClick={toggleSidebar}>☰</span> Iowa City Compassion Food
          Pantry
        </div>
        <div className="user">
          <span>Username</span>
          <img src="https://via.placeholder.com/40" alt="User" />
        </div>
      </section>
    </>
  );
}

export default Topbar;
