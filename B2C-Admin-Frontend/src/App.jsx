import React, { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import Leftsidebar from "./components/Leftsidebar";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import CustomerInsights from "./components/CustomerInsights";
import DeliveryInsights from "./components/Delivery_Insights";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (index) => {
    if (index === 0) {
      navigate("/dashboard"); // Redirect to Dashboard
    }
    setSidebarOpen(false); // Close sidebar after navigation on mobile
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if the current path is the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Render sidebar only if not on the login page */}
      {!isLoginPage && (
        <Leftsidebar
          onIconClick={handleNavigation}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      <div
        className={`w-full ${
          !isLoginPage ? "lg:ml-[100px]" : ""
        } mt-16 lg:mt-0`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />{" "}
          {/* Redirect from root to Login */}
          <Route path="/login" element={<Login />} />{" "}
          {/* Route for the Login component */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer-insights" element={<CustomerInsights />} />
          <Route path="/delivery-insights" element={<DeliveryInsights />} />
          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
