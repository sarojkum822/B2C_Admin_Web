import React from 'react';
import { FaRupeeSign, FaStore, FaShoppingCart, FaUsers } from 'react-icons/fa';  // Importing icons

const OutletSummary = () => {
  const summaryData = [
    { label: 'Revenue', value: '₹ 1,07,825', icon: <FaRupeeSign className="text-orange-500" /> },
    { label: 'Orders', value: '9200', icon: <FaShoppingCart className="text-orange-500" /> },
    { label: 'Outlets', value: '23', icon: <FaStore className="text-orange-500" /> },
    { label: 'Delivery Partners', value: '78', icon: <FaUsers className="text-orange-500" /> }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Outlet Details</h1> {/* Heading */}
      <div className="grid grid-cols-4 gap-4 my-5">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <div>
            <p className="text-sm text-gray-500">{item.label}</p>  {/* Adjust font size */}
              <p className="text-lg font-bold text-gray-800">{item.value}</p> {/* Adjust font size */}
              
            </div>
            <div className="text-2xl">{item.icon}</div> {/* Icon placed right */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletSummary;
