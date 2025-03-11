import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOutletDetails } from '../redux/outletDetails'; // Adjust the import path if needed
import { FaRupeeSign, FaShoppingCart, FaStore, FaUsers } from 'react-icons/fa';
import AddAnOutletPartner from './AddAnOutletPartner';

const OutletDetails = () => {
  const dispatch = useDispatch();

  // Accessing the state from Redux store
  const { summaryData, outletData, loading, error } = useSelector((state) => state.outletDetails);
  console.log(summaryData);
  
  // Dispatch the action to fetch outlet details on component mount
  useEffect(() => {
    dispatch(fetchOutletDetails());
  }, [dispatch]);
  
  if (error) return <div>Error: {error}</div>;


  
  return (
    <div className="p-2 sm:p-6 md:p-10 border-2 h-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Outlet Details</h1>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { label: 'Revenue', value: `₹ ${summaryData.revenue}`, icon: <FaRupeeSign className="text-orange-500" /> },
          { label: 'Orders', value: summaryData.totalOrders, icon: <FaShoppingCart className="text-orange-500" /> },
          { label: 'Outlets', value: summaryData.totalOutlets, icon: <FaStore className="text-orange-500" /> },
          { label: 'Partners', value: summaryData.totalPartners, icon: <FaUsers className="text-orange-500" /> },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 "
          >
            <div>
              <p className="text-sm sm:text-base text-gray-500">{item.label}</p>
              <p className="text-base sm:text-lg font-bold text-gray-800">{item.value}</p>
            </div>
            <div className="text-xl sm:text-2xl">{item.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletDetails;
