import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "ascending",
  });

  const navigate = useNavigate();
  
  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://b2c-49u4.onrender.com/api/v1/order/order"
        );
        const fetchedOrders = response.data.orders || [];
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  console.log(orders);
  
  // Sorting function
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
    }
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete =async (id) => {
    try {
      const res = await axios.delete(`https://b2c-backend-1.onrender.com/api/v1/admin/order/delete/${id}`)
      console.log(res);
      navigate('/dashboard')
      toast.success("Order has been successfully deleted")
      setSuccessMessage("Order has been successfully deleted");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.log(error);
      setSuccessMessage("Order cannot be delete");
      setTimeout(() => setSuccessMessage(""), 3000);
      toast.error("Order cannot be delete")
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData(orders[index]);
  };

  const handleSaveEdit = () => {
    const updatedOrders = [...orders];
    updatedOrders[editIndex] = editData;
    setOrders(updatedOrders);
    setEditIndex(null);
    setSuccessMessage("Order has been successfully updated");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-400">
      <h3 className="text-lg font-semibold mb-4">All Orders</h3>

      {loading && <p>Loading...</p>}
      {error && <p className="text-green-500 text-lg font-bold">{`Orders not found`}</p>}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto rounded-md m-2">
        {!loading && !error && (
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Order ID
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("products")}
                >
                  Products
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                </th>
                <th
                  className="p-4 text-left cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Order Date
                </th>
                <th className="p-4 text-left flex justify-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sortedOrders) &&
                sortedOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition duration-200 border-b  border-collapse cursor-pointer"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    <td className="p-4 border-b ">{order.id}</td>
                    <td className="p-4 border-b">
                      {Object.values(order.products)
                        .map(({ name, quantity }) => `${name}: ${quantity}`)
                        .join(", ")}
                    </td>
                    <td className="p-4 border-b">Rs {order.amount}</td>
                    <td className="p-4 border-b">{order.status}</td>
                    <td className="p-4 border-b border-r">
                         {new Date(order.createdAt._seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="p-4 justify-center flex space-x-4">
                      <FaEdit
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }}
                        className="text-blue-500 cursor-pointer"
                      />
                      <FaTrash
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order.id);
                        }}
                        className="text-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
