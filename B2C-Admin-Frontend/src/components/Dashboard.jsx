import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import OrdersTable from './OrdersTable';
import BestsellersTable from './BestsellersTable';
import OrderDashboard from './OrderDashboard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom';
import Orders from './Orders';
import axios from 'axios';
import DashboardStatusCart from './DashboardStatusCart';
import { FaCalendarAlt, FaTachometerAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  const handleToggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (end) {
      setShowCalendar(false);
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoading(false);
      } else {
        navigate('/login');
      }
    });
    
    // Simulate loading for components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 min-h-screen">
      {/* Header with sticky functionality */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaTachometerAlt className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="relative">
              <button
                onClick={handleToggleCalendar}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <span>
                  {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                </span>
              </button>
              
              {showCalendar && (
                <div className="absolute right-0 mt-2 z-50 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-1">
                    <DatePicker
                      selected={startDate}
                      onChange={handleDateChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      onClickOutside={() => setShowCalendar(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Cards */}
        <div className="mb-8">
          <DashboardStatusCart />
        </div>

        {/* Order Dashboard */}
        <div className="mb-8 bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Analytics</h2>
          </div>
          <div className="p-6">
            <OrderDashboard />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mb-8 bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-hidden">
            <Orders />
          </div>
        </div>

        {/* Bestsellers */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Bestselling Products</h2>
          </div>
          <div className="overflow-hidden">
            <BestsellersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

// Add custom styles for date picker
const styles = `
  .react-datepicker {
    font-family: 'Inter', sans-serif;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .react-datepicker__header {
    background-color: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding-top: 0.5rem;
  }
  
  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #3b82f6;
    border-radius: 0.25rem;
    color: white;
  }
  
  .react-datepicker__day--keyboard-selected {
    background-color: #93c5fd;
    border-radius: 0.25rem;
  }
  
  .react-datepicker__day:hover {
    background-color: #e5e7eb;
    border-radius: 0.25rem;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Dashboard;