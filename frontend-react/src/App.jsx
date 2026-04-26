/* Routing Functionality */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Custom styles + Bootstrap 
  (Custom styles must be imported last for precedence)
*/
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Required for dropdowns, modals, etc.
import "./App.css";

/* Pages */
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Trends from "./pages/Trends";
import Stock from "./pages/Stock";
import Account from "./pages/Account";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/tasks" element={<Tasks />} />
          <Route path="/pantry" element={<Pantry />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
