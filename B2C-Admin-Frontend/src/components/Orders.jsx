import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    fetchOrders,
    deleteOrder,
    setSuccessMessage,
    clearSuccessMessage,
} from "../redux/ordersSlice.js";

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error, successMessage } = useSelector(
        (state) => state.orders
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "createdAt",
        direction: "descending", // Default to most recent orders first
    });
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Adjust the number of items per page as needed

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setTimeout(() => dispatch(clearSuccessMessage()), 3000);
        }
    }, [successMessage, dispatch]);

    const filteredOrders = orders.filter((order) =>
        order.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper to get date from order object
    const getOrderDate = (order) => {
        if (order.createdAt && order.createdAt._seconds) {
            return new Date(order.createdAt._seconds * 1000);
        }
        return new Date(0); // fallback
    };

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortConfig.key === "createdAt") {
            const dateA = getOrderDate(a);
            const dateB = getOrderDate(b);
            
            if (sortConfig.direction === "ascending") {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        } else {
            if (sortConfig.direction === "ascending") {
                return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
            } else {
                return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
            }
        }
    });

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const handleDelete = (id) => {
        
            dispatch(deleteOrder(id))
                .then(() => {
                    dispatch(setSuccessMessage("Order has been successfully deleted"));
                    // Adjust page if needed after deletion
                    if (currentPageData.length === 1 && currentPage > 0) {
                        setCurrentPage(currentPage - 1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Order cannot be deleted");
                });
        
    };

    // Pagination logic
    const offset = currentPage * itemsPerPage;
    const currentPageData = sortedOrders.slice(offset, offset + itemsPerPage);

    // Updated product display name mapping with E-prefixed format
    const productDisplayNameMap = {
        "12pc_tray": "E12",
        "6pc_tray": "E6",
        "26pc_tray": "E6",  // Assuming this is a typo and should be E6
        "30pc_tray": "E30",
        // New E-prefixed format mapping (in case the IDs are already in E format)
        "E6": "E6",
        "E12": "E12",
        "E30": "E30",
        // Add other mappings as needed
    };

    // Function to get status badge styling
    const getStatusBadgeClass = (status) => {
        const lowerStatus = status.toLowerCase();
        
        if (lowerStatus === "pending") {
            return "bg-yellow-200 border-2 text-yellow-800 border-yellow-300";
        } else if (lowerStatus === "delivered") {
            return "bg-green-400 border-2 text-green-800 border-green-300";
        } else if (lowerStatus === "canceled" || lowerStatus === "cancelled") {
            return "bg-red-300 border-2 text-red-800 border-red-300";
        } else if (lowerStatus === "processing") {
            return "bg-blue-300 text-blue-800 border-blue-300";
        } else if (lowerStatus === "shipped") {
            return "bg-purple-300 text-purple-800 border-purple-300";
        } else {
            return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    // Function to render the sort icon
    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <FaSort className="ml-1 inline text-gray-400" />;
        }
        
        return sortConfig.direction === "ascending" ? (
            <FaSortUp className="ml-1 inline text-gray-700" />
        ) : (
            <FaSortDown className="ml-1 inline text-gray-700" />
        );
    };

    const renderProducts = (products) => {
        if (!products) {
            return null;
        }

        if (Array.isArray(products)) {
            // Case 1: products is an array
            return products.map((product) => (
                <span key={product.productId} className="inline-block mr-2 mb-1">
                    {productDisplayNameMap[product.name] || product.name}: {product.quantity},
                </span>
            ));
        } else if (typeof products === 'object' && products !== null) {
            // Case 2: products is an object
            const productItems = [];
            for (const productId in products) {
                if (products.hasOwnProperty(productId)) {
                    const product = products[productId];
                    let displayName = productDisplayNameMap[productId] || productId; // Use mapped name or original ID

                    if (typeof product === 'object' && product.hasOwnProperty('quantity')) {
                        productItems.push(
                            <span key={productId} className="inline-block mr-2 mb-1">
                                {productDisplayNameMap[product.name] || product.name}: {product.quantity},
                            </span>
                        );
                    } else if (typeof product === 'number') {
                        productItems.push(
                            <span key={productId} className="inline-block mr-2 mb-1">
                                {displayName}: {product},
                            </span>
                        );
                    }
                }
            }
            return productItems;
        } else {
            return null; // Handle unexpected types
        }
    };
    
    // Function to format date
    const formatOrderDate = (order) => {
        if (order.createdAt && order.createdAt._seconds) {
            const date = new Date(order.createdAt._seconds * 1000);
            return date.toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
            });
        }
        return "";
    };
    
    // Function to render pagination controls
    const renderPagination = () => {
        const pageCount = Math.ceil(sortedOrders.length / itemsPerPage);
        
        if (pageCount <= 1) return null;
        
        return (
            <div className="flex justify-center mt-4 space-x-2">
                <button 
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className={`px-3 py-1 rounded border ${currentPage === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                >
                    Previous
                </button>
                
                {[...Array(pageCount).keys()].map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${currentPage === page 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-blue-600 hover:bg-blue-50 border'}`}
                    >
                        {page + 1}
                    </button>
                ))}
                
                <button 
                    onClick={() => setCurrentPage(Math.min(pageCount - 1, currentPage + 1))}
                    disabled={currentPage >= pageCount - 1}
                    className={`px-3 py-1 rounded border ${currentPage >= pageCount - 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                >
                    Next
                </button>
            </div>
        );
    };
    
    return (
        <div className="bg-white p-6 shadow rounded mb-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-400">
            <h3 className="text-lg font-semibold ml-4 mb-4">All Orders</h3>

            {/* Search Bar */}
            <div className="mb-4 relative">
                <div className="flex items-center border ml-2 rounded-lg overflow-hidden shadow-sm">
                    <div className="px-4 py-2 bg-gray-50">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 focus:outline-none"
                    />
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              </div>
            )}
            
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    <p className="font-medium">{`Orders not found`}</p>
                </div>
            )}
            
            {successMessage && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <div className="overflow-x-auto rounded-md m-2">
                {!loading && !error && (
                    <>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("id")}
                                    >
                                        <div className="flex items-center">
                                            Order ID
                                            {renderSortIcon("id")}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("products")}
                                    >
                                        <div className="flex items-center">
                                            Products
                                            {renderSortIcon("products")}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("amount")}
                                    >
                                        <div className="flex items-center">
                                            Amount
                                            {renderSortIcon("amount")}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("status")}
                                    >
                                        <div className="flex items-center">
                                            Status
                                            {renderSortIcon("status")}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("createdAt")}
                                    >
                                        <div className="flex items-center">
                                            Order Date
                                            {renderSortIcon("createdAt")}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentPageData.length > 0 ? (
                                    currentPageData.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                                            onClick={() => navigate(`/order/${order.id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 flex flex-wrap">
                                                    {renderProducts(order.products)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Rs {Math.round(order.amount).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatOrderDate(order)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(order.id);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 transition duration-150 focus:outline-none"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        {renderPagination()}
                        
                        {sortedOrders.length > 0 && (
                            <div className="mt-4 text-sm text-gray-500">
                                Showing {offset + 1} to {Math.min(offset + itemsPerPage, sortedOrders.length)} of {sortedOrders.length} orders
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Orders;