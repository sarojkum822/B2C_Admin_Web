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
// import OutletSummary from "./components/OutletDetails_updated";
import OutletSummary from "./components/outlet";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import {ToastContainer} from 'react-toastify'
import Products from "./components/Products";
import DeliveryPartnerDetails from "./components/DeliveryPartnerDetails";
// import OutletDetailsPage from "./components/OutletDetailsPage";


const App = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (index) => {
    switch (index) {
      case 0:
        navigate("/dashboard");
        break;
      case 1:
        navigate("/customer-insights");
        break;
      case 2:
        navigate("/outlet");
        break;
      case 3:
        navigate("/delivery-insights");
        break;
      case 4:
        navigate("/orders");
        break;
      // default:
      //   navigate("/dashboard"); // Fallback to Dashboard
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
      <ToastContainer/>
      <div
        className={`w-full ${!isLoginPage ? "lg:ml-[100px]" : ""} mt-16 lg:mt-0`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />{" "}
          {/* Redirect from root to Login */}
          <Route path="/login" element={<Login />} />{" "}
          {/* Route for the Login component */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer-insights" element={<CustomerInsights />} />
          <Route path="/outlet" element={<OutletSummary />} />
          {/* <Route path="/outlet/:id" element={<OutletDetailsPage />} /> */}
          {/* <Route path="/outletpartner" element={<OutletPartner/>} /> */}
          <Route path="/delivery-insights" element={<DeliveryInsights />} />
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/order/:id" element={<OrderDetails/>}/>
          <Route path="/Products" element={<Products/>}/>
          <Route path="/delivery-partner/:partnerId" element={<DeliveryPartnerDetails />} />

          {/* Add more routes here if needed */}
        </Routes>
      </div>

    </div>
  );
};

export default App;
