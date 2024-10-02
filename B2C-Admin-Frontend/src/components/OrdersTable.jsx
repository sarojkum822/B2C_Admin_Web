import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const OrdersTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const [showDropdown, setShowDropdown] = useState({}); // Track dropdown visibility

  const orders = [
    {
      product: "30 pcs Egg Tray",
      qty: "x2",
      date: "Sep 5, 2024",
      revenue: "Rs 420.00",
      profit: "Rs 22.50",
      status: "Pending",
      statusColor: "text-red-500",
    },
    {
      product: "50 pcs Egg Carton",
      qty: "x5",
      date: "Sep 6, 2024",
      revenue: "Rs 1,050.00",
      profit: "Rs 50.00",
      status: "Completed",
      statusColor: "text-green-500",
    },
    {
      product: "10 pcs Packaged Eggs",
      qty: "x3",
      date: "Sep 7, 2024",
      revenue: "Rs 600.00",
      profit: "Rs 30.00",
      status: "Pending",
      statusColor: "text-red-500",
    },
    {
      product: "100 pcs Bulk Eggs",
      qty: "x1",
      date: "Sep 8, 2024",
      revenue: "Rs 3,000.00",
      profit: "Rs 150.00",
      status: "Shipped",
      statusColor: "text-blue-500",
    },
    {
      product: "15 pcs Organic Eggs",
      qty: "x4",
      date: "Sep 9, 2024",
      revenue: "Rs 900.00",
      profit: "Rs 45.00",
      status: "Pending",
      statusColor: "text-red-500",
    },
  ];

  // Sorting function
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
    }
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleDropdown = (column) => {
    setShowDropdown((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleDirectionChange = (direction) => {
    setSortConfig((prev) => ({ ...prev, direction }));
    setShowDropdown({}); // Close all dropdowns
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-6">
      <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('product')}>
                Products
                <button onClick={() => toggleDropdown('product')} className="ml-2">
                  ▼
                </button>
                {showDropdown['product'] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('qty')}>
                QTY
                <button onClick={() => toggleDropdown('qty')} className="ml-2">
                  ▼
                </button>
                {showDropdown['qty'] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('date')}>
                Date
                <button onClick={() => toggleDropdown('date')} className="ml-2">
                  ▼
                </button>
                {showDropdown['date'] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('revenue')}>
                Revenue
                <button onClick={() => toggleDropdown('revenue')} className="ml-2">
                  ▼
                </button>
                {showDropdown['revenue'] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('profit')}>
                Net Profit
                <button onClick={() => toggleDropdown('profit')} className="ml-2">
                  ▼
                </button>
                {showDropdown['profit'] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('status')}>
                Status
                <button onClick={() => toggleDropdown('status')} className="ml-2">
                  ▼
                </button>
                {showDropdown['status'] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="p-4 border-b">{order.product}</td>
                <td className="p-4 border-b">{order.qty}</td>
                <td className="p-4 border-b">{order.date}</td>
                <td className="p-4 border-b">{order.revenue}</td>
                <td className="p-4 border-b">{order.profit}</td>
                <td className={`p-4 border-b ${order.statusColor}`}>{order.status}</td>
                <td className="p-4 border-b flex space-x-2">
                  <FaEdit className="text-blue-500 cursor-pointer hover:text-blue-700 transition duration-200" />
                  <FaTrash className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
