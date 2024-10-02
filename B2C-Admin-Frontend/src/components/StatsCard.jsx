import React from 'react';
import { FaRupeeSign, FaClipboardList, FaBox, FaUsers } from 'react-icons/fa';

const StatsCard = ({ title, value, percentage, color }) => {
  let Icon;
  switch (title) {
    case 'Revenue':
      Icon = FaRupeeSign;
      break;
    case 'Orders':
      Icon = FaClipboardList;
      break;
    case 'Inventory':
      Icon = FaBox;
      break;
    case 'Customers Insight':
      Icon = FaUsers;
      break;
    default:
      Icon = null;
  }

  return (
    <div className={`bg-white p-4 lg:p-6 rounded-lg shadow-md flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]`}>
      <div>
        <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-1">{title}</h3>
        <p className="text-xl lg:text-2xl font-bold text-gray-900">{value}</p>
        <span className={`text-${color}-500 font-medium text-sm lg:text-base`}>{percentage}</span>
      </div>
      {Icon && <Icon className={`text-${color}-500 text-2xl lg:text-3xl`} />}
    </div>
  );
};

export default StatsCard;