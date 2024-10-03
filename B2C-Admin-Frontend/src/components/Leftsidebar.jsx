import React from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import headlogo from "../assets/headlogo.png";
import s1 from "../assets/s1.png";
import s2 from "../assets/s2.png";
import s3 from "../assets/s3.png";
import s4 from "../assets/s4.png";
import s5 from "../assets/s5.png";

const Leftsidebar = ({ onIconClick, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const icons = [s1, s2, s3, s4, s5];
  const labels = [
    "Dashboard",
    "Customers Info",
    "Outlets",
    "Delivery Partners",
    "Notifications",
  ];

  // Determine the active index based on the current path
  const getActiveIndex = () => {
    switch (location.pathname) {
      case "/dashboard":
        return 0; // Dashboard
      case "/customer-insights":
        return 1; // Customer Insights
      case "/outlets":
        return 2; // Outlets
      case "/delivery-partners":
        return 3; // Delivery Partners
      case "/notifications":
        return 4; // Notifications
      default:
        return null; // No active index
    }
  };

  const [activeIndex, setActiveIndex] = React.useState(getActiveIndex());

  const handleIconClick = (index) => {
    setActiveIndex(index);
    if (onIconClick) {
      onIconClick(index);
    }
    if (window.innerWidth < 1024) {
      // Close sidebar on mobile after clicking
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-[#ff7f00] fixed top-0 left-0 right-0 z-50">
        <Link to="/dashboard" className="flex items-center">
          <img
            src={headlogo}
            className="w-[120px] h-[40px] object-contain"
            alt="Logo"
          />
        </Link>
        <button onClick={toggleSidebar} className="text-white text-3xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`lg:w-[120px] w-[200px] h-screen bg-[#ff7f00] flex flex-col items-center fixed transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "left-0" : "-left-full"
        } lg:left-0 pt-16 lg:pt-4`}
      >
        <div className="mb-5 hidden lg:block">
          <img
            src={headlogo}
            className="w-[80px] h-[80px] object-contain"
            alt="Logo"
          />
        </div>
        {icons.map((icon, index) => (
          <div
            className={`flex flex-col items-center justify-center mb-2 p-2 rounded-lg transition-all duration-300 ease-in-out w-full hover:bg-[#FFB056] ${
              activeIndex === index ? "bg-[#FFB056]" : ""
            }`}
            key={index}
            onClick={() => handleIconClick(index)}
          >
            <img
              src={icon}
              className="w-[30px] h-[30px] cursor-pointer transform transition-transform duration-100 hover:scale-110"
              alt={`Sidebar icon ${index + 1}`}
            />
            <span className="mt-1 text-white text-sm">{labels[index]}</span>{" "}
            {/* Add labels beneath the icons */}
          </div>
        ))}
      </div>
    </>
  );
};

export default Leftsidebar;
