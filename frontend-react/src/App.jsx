/* Routing Functionality */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./Routes";
import { lazy, Suspense } from "react";

/* Custom styles + Bootstrap 
  (Custom styles must be imported last for precedence)
*/
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Required for dropdowns, modals, etc.
import "./App.css";

// Page Imports
import Home_Logged_Out from "./pages/Home_Logged_Out";
import Login_Signup from "./pages/Login_Signup";
const Home = lazy(() => import("./pages/Home"));
const Archive = lazy(() => import("./pages/Archive"));
const Trends = lazy(() => import("./pages/Trends"));
const Stock = lazy(() => import("./pages/StockPage/Stock"));
const Pantry = lazy(() => import("./pages/PantryPage/Pantry"));
const Account = lazy(() => import("./pages/Account"));
const Documents = lazy(() => import("./pages/Documents"));

function App() {
  return (
    <Router>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={<Home_Logged_Out />} />
          <Route path="/login-signup" element={<Login_Signup />} />
          {/* Protected Routes (Guarded) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/pantry" element={<Pantry />} />
            <Route path="/account" element={<Account />} />
            <Route path="/documents" element={<Documents />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
