{
  /* Footer Component */
}
function Footer() {
  return (
    <>
      <footer>
        <hr className="center" />
        <div className="footer-grid">
          <img
            src="IC_Compassion_Logo_big.jpg"
            alt="Iowa City Compassion Logo"
            className="footer-logo"
          />
          <div className="footer-pantry-info">
            <p>
              Food Pantry Open 12:00 pm to 5:00 pm Wednesday
              <br />
              <br />
              Email: info@iccompassion.org <br />
              Phone: (319)-330-9883
              <br />
              <br />
              1035 Wade St <br />
              Iowa City, IA 52240 <br />@ 2026 by IC Compassion
            </p>
          </div>
          <a href="https://www.iccompassion.org/" className="footer-button">
            For more information
          </a>
        </div>
        <hr className="center" />
      </footer>
    </>
  );
}

export default Footer;
