import React from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import headlogo from "../assets/headlogo.png";
import s1 from "../assets/s1.png";
import s2 from "../assets/s2.png";
import s3 from "../assets/s3.png";
import s4 from "../assets/s4.png";
import s5 from "../assets/order.png";
import { CiViewList } from "react-icons/ci";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";

const Leftsidebar = ({ onIconClick, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const icons = [s1, s2, s3, s4, <CiViewList />, s2, <FiLogOut />];
  const labels = [
    "Dashboard",
    "Customers Info",
    "Outlets",
    "Delivery Partners",
    "Orders",
    "Products",
    "Logout",
  ];

  const getActiveIndex = () => {
    switch (location.pathname) {
      case "/dashboard":
        return 0;
      case "/customer-insights":
        return 1;
      case "/outlet":
        return 2;
      case "/delivery-insights":
        return 3;
      case "/orders":
        return 4;
      case "/products":
        return 5;
      default:
        return null;
    }
  };

  const [activeIndex, setActiveIndex] = React.useState(getActiveIndex());

  const handleIconClick = (index) => {
    setActiveIndex(index);

    if (index === 6) {
      handleLogout();
    } else {
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
        case 5:
          navigate("/products");
          break;
        default:
          break;
      }
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
            {typeof icon === "string" ? (
              <img
                src={icon}
                className="w-[30px] h-[30px] cursor-pointer transform transition-transform duration-100 hover:scale-110"
                alt={`Sidebar icon ${index + 1}`}
              />
            ) : (
              <span
                className={`text-white text-3xl cursor-pointer transition-transform duration-100 hover:scale-110`}
              >
                {icon}
              </span>
            )}
            <span className="mt-1 text-white text-sm cursor-pointer">
              {labels[index]}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Leftsidebar;
