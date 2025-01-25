import React from "react";
import { FiHome, FiUsers, FiMapPin, FiTruck, FiList, FiGrid, FiLogOut, FiMenu } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import headlogo from "../assets/headlogo.png";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";

const Leftsidebar = ({ onIconClick, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FiHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FiUsers />, label: "Customers", path: "/customer-insights" },
    { icon: <FiMapPin />, label: "Outlets", path: "/outlet" },
    { icon: <FiTruck />, label: "Delivery", path: "/delivery-insights" },
    { icon: <FiList />, label: "Orders", path: "/orders" },
    { icon: <FiGrid />, label: "Products", path: "/products" },
    { icon: <FiLogOut />, label: "Logout", path: null }
  ];

  const [activeIndex, setActiveIndex] = React.useState(
    menuItems.findIndex(item => item.path === location.pathname)
  );

  const handleIconClick = (index) => {
    setActiveIndex(index);

    if (index === menuItems.length - 1) {
      handleLogout();
    } else {
      navigate(menuItems[index].path);
    }

    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-orange-500 shadow-md">
        <div className="flex justify-between items-center p-4">
          <Link to="/dashboard" className="flex items-center">
            <img
              src={headlogo}
              className="w-[120px] h-[40px] object-contain"
              alt="Logo"
            />
          </Link>
          <button onClick={toggleSidebar} className="text-white">
            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
          lg:w-[120px] w-[200px] h-screen 
          bg-orange-500 
          fixed top-0 z-40 
          transition-all duration-300 ease-in-out 
          ${isOpen ? 'left-0' : '-left-full'} 
          lg:left-0 
          pt-16 lg:pt-4
          shadow-[10px_0_15px_-3px_rgba(0,0,0,0.1)]
        `}
      >
        {/* Logo */}
        <div className="mb-5 hidden lg:block text-center">
          <img
            src={headlogo}
            className="w-[80px] h-[80px] object-contain mx-auto"
            alt="Logo"
          />
        </div>

        {/* Menu Items */}
        <div className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`
                flex flex-col items-center justify-center 
                p-2 rounded-lg 
                cursor-pointer 
                transition-all duration-300 
                group
                ${activeIndex === index 
                  ? 'bg-orange-600 text-white' 
                  : 'hover:bg-orange-400/50 text-white'}
              `}
              onClick={() => handleIconClick(index)}
            >
              <span 
                className={`
                  text-2xl mb-1
                  transition-transform duration-200 
                  group-hover:scale-110
                  ${activeIndex === index ? 'text-white' : 'text-white/90'}
                `}
              >
                {item.icon}
              </span>
              <span className="text-xs text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Leftsidebar;