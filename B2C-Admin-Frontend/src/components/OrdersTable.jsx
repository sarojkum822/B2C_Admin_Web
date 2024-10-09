import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const OrdersTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const [showDropdown, setShowDropdown] = useState({}); // Track dropdown visibility
  const [editIndex, setEditIndex] = useState(null);  // Track the order being edited
  const [editData, setEditData] = useState(null);    // Temporary state to store edited data
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  const [orders, setOrders] = useState([
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
  ]);

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

  const handleDelete = (index) => {
    const newOrders = orders.filter((_, i) => i !== index);
    setOrders(newOrders);
    setSuccessMessage("Order has been successfully deleted");
    setTimeout(() => setSuccessMessage(""), 3000); // Clear the success message after 3 seconds
  };

  // Function to handle order edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData(orders[index]); // Load selected order data into form for editing
  };

  // Function to save edited order
  const handleSaveEdit = () => {
    const updatedOrders = [...orders];
    updatedOrders[editIndex] = editData;
    setOrders(updatedOrders);
    setEditIndex(null);
    setSuccessMessage("Order has been successfully updated");
    setTimeout(() => setSuccessMessage(""), 3000); // Clear the success message after 3 seconds
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-6 overflow-y-auto h-[300px] scrollbar-thin scrollbar-thumb-gray-400">
      <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
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
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                {editIndex === index ? (
                  <>
                    <td className="p-4 border-b">
                      <input
                        type="text"
                        value={editData.product}
                        onChange={(e) => setEditData({ ...editData, product: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-4 border-b">
                      <input
                        type="text"
                        value={editData.qty}
                        onChange={(e) => setEditData({ ...editData, qty: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-4 border-b">
                      <input
                        type="text"
                        value={editData.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-4 border-b">
                      <input
                        type="text"
                        value={editData.revenue}
                        onChange={(e) => setEditData({ ...editData, revenue: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-4 border-b">
                      <input
                        type="text"
                        value={editData.profit}
                        onChange={(e) => setEditData({ ...editData, profit: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-4 border-b">
                      <input
                        type="text"
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-4 border-b">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditIndex(null)}
                        className="bg-gray-300 text-black px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 border-b">{order.product}</td>
                    <td className="p-4 border-b">{order.qty}</td>
                    <td className="p-4 border-b">{order.date}</td>
                    <td className="p-4 border-b">{order.revenue}</td>
                    <td className="p-4 border-b">{order.profit}</td>
                    <td className={`p-4 border-b ${order.statusColor}`}>{order.status}</td>
                    <td className="p-4 border-b flex space-x-2">
                      <FaEdit
                        className="text-blue-500 cursor-pointer hover:text-blue-700 transition duration-200"
                        onClick={() => handleEdit(index)}
                      />
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200"
                        onClick={() => handleDelete(index)}
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;