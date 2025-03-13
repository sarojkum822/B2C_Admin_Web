import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({
    rate: "",
    discount: "",
    countInStock: "",
  });

  const [shippingCharge, setShippingCharge] = useState("");
  const [message, setMessage] = useState("");
  const [shipping, setShipping] = useState(0);
  const [messageType, setMessageType] = useState(""); // For success/error styling
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  const handleUpdateShipping = async () => {
    try {
      await axios.post(
        "https://b2c-backend-eik4.onrender.com/api/v1/order/shipping",
        {
          charge: Number(shippingCharge),
        }
      );
      toast.success("Shipping charge updated successfully!");
      setMessage("Shipping charge updated successfully.");
      setMessageType("success");
      fetchShippingCharge();
      setTimeout(() => setMessage(""), 3000);
      setIsEditingShipping(false); // Stop editing after update
    } catch (error) {
      console.error("Error updating shipping charge:", error);
      toast.error("Failed to update shipping charge.");
      setMessage("Failed to update shipping charge.");
      setMessageType("error");
    }
  };

  const fetchShippingCharge = async () => {
    try {
      const response = await axios.get(
        "https://b2c-backend-eik4.onrender.com/api/v1/order/shipping"
      );
      setShipping(response.data.charge);
    } catch (error) {
      console.error("Error fetching shipping charge:", error);
    }
  };

  useEffect(() => {
    fetchShippingCharge();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://b2c-backend-eik4.onrender.com/api/v1/admin/getallproducts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setUpdatedValues({
      rate: product.price.toFixed(2),
      discount: product.discount,
      countInStock: product.countInStock,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedValues({ ...updatedValues, [name]: value });
  };

  const handleSave = async () => {
    try {
      const { id } = editingProduct;
      await axios.patch(
        `https://b2c-backend-eik4.onrender.com/api/v1/admin/changeproductprice/${id}`,
        updatedValues
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, ...updatedValues } : product
        )
      );

      setEditingProduct(null);
      fetchProducts();
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err.message);
      toast.error("Failed to update product.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-center text-red-600 font-medium">{error}</p>
        <div className="text-center mt-4">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 text-center">
            Products Management
          </h1>
          <p className="mt-2 text-center text-gray-600 text-sm sm:text-base">
            Manage your product inventory, prices and shipping
          </p>
        </header>

        {/* Shipping Card */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-800 border-b pb-2">
            Shipping Settings
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-3 sm:mb-0">
              <p className="text-gray-600 text-sm">Current Shipping Charge:</p>
              <p className="font-bold text-xl sm:text-2xl text-gray-800">
                ₹{shipping.toFixed(2)}
              </p>
            </div>

            <div className="md:w-1/2">
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end">
                  {/* Edit Shipping Charge Button - Now right-aligned and smaller in web view */}
                  {!isEditingShipping && (
                    <button
                      onClick={() => setIsEditingShipping(true)}
                      className="w-full sm:w-auto mt-6 bg-orange-500 text-white px-5 py-2.5 sm:px-4 sm:py-2 rounded-md hover:bg-orange-600 transition-colors text-sm"
                    >
                      Edit Shipping Charge
                    </button>
                  )}

                  {isEditingShipping ? (
                    // Input fields when editing
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="number"
                        value={shippingCharge}
                        onChange={(e) => setShippingCharge(e.target.value)}
                        placeholder="Enter new shipping charge"
                        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={handleUpdateShipping}
                          className="bg-orange-500 text-white px-24 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm flex-grow sm:flex-grow-0"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setIsEditingShipping(false)}
                          className="px-10 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex-grow sm:flex-grow-0"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {message && (
                  <p
                    className={`mt-2 text-xs sm:text-sm ${
                      messageType === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Product Listings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-2 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-2 sm:px-6 py-2 font-medium sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 border-l">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap sm:text-sm text-sm font-medium text-gray-500 border-l">
                      {product.discount > 0 ? (
                        <span className="bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded-full text-xs">
                          {product.discount}% off
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 border-l">
                      <span
                        className={`px-1 sm:px-2 py-1 rounded-full text-sm font-medium ${
                          product.countInStock > 10
                            ? "bg-green-100 text-green-800"
                            : product.countInStock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.countInStock > 0
                          ? product.countInStock
                          : "Out"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add a spacer at the bottom for mobile */}
        <div className="h-16"></div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-6 rounded-lg shadow-xl overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Edit {editingProduct.name}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label
                  htmlFor="rate"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Price (₹):
                </label>
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  value={updatedValues.rate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="Enter new price"
                />
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Discount (%):
                </label>
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  value={updatedValues.discount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="Enter discount percentage"
                />
              </div>

              <div>
                <label
                  htmlFor="countInStock"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >
                  Available Stock:
                </label>
                <input
                  type="number"
                  name="countInStock"
                  id="countInStock"
                  value={updatedValues.countInStock}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="Enter available quantity"
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-xs sm:text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
