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
import Orders from './Orders'
import axios from 'axios';
import DashboardStatusCart from './DashboardStatusCart';

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  

  const handleToggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const navigate = useNavigate()
  
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
      } else {
        navigate('/login')
      }
    });
  },[auth,onAuthStateChanged])

  return (
    <div className="flex-grow bg-[#f8f8f8] p-4 lg:p-6 relative m-2">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 lg:mb-0 ml-4">Dashboard</h1>
        <div className="text-sm relative w-full lg:w-auto">
          <span onClick={handleToggleCalendar} className="cursor-pointer block w-full lg:w-auto bg-white p-2 rounded">
            {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
          </span>
          {showCalendar && (
            <div className="absolute z-50 right-0 mt-2">
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
          )}
        </div>
      </div>

      <DashboardStatusCart/>

      <OrderDashboard />
      
      {/* <OrdersTable />
       */}
       <Orders/>

      <BestsellersTable />
    </div>
  );
};

export default Dashboard;