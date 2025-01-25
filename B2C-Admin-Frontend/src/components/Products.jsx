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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://b2c-backend-1.onrender.com/api/v1/admin/getallproducts"
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

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setUpdatedValues({
      rate: product.rate,
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
        `https://b2c-backend-1.onrender.com/api/v1/admin/changeproductprice/${id}`,
        updatedValues
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, ...updatedValues } : product
        )
      );

      setEditingProduct(null);
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err.message);
      toast.error("Failed to update product.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-bold mt-10">{error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-950">
        Products Management
      </h1>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase">
                Price
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase">
                Discount
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase">
                In Stock
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-orange-200 font-medium text-sm"
              >
                <td className="px-4 sm:px-6 py-4 text-gray-700">
                  {product.name}
                </td>
                <td className="px-4 sm:px-6 py-4 text-gray-700">
                  ${product.rate}
                </td>
                <td className="px-4 sm:px-6 py-4 text-gray-700">
                  {product.discount}%
                </td>
                <td className="px-4 sm:px-6 py-4 text-gray-700">
                  {product.countInStock}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-orange-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded hover:bg-orange-600 transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-4 sm:p-6 rounded-lg shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
              Edit Product
            </h2>
            <div className="mb-4">
              <label htmlFor="rate" className="block font-medium mb-2">
                Rate:
              </label>
              <input
                type="number"
                name="rate"
                id="rate"
                value={updatedValues.rate}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter new rate"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="discount" className="block font-medium mb-2">
                Discount:
              </label>
              <input
                type="number"
                name="discount"
                id="discount"
                value={updatedValues.discount}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new discount"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="countInStock" className="block font-medium mb-2">
                In Stock:
              </label>
              <input
                type="number"
                name="countInStock"
                id="countInStock"
                value={updatedValues.countInStock}
                onChange={handleInputChange}
                className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the count in stock"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 text-sm rounded hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-red-500 text-white px-4 py-2 text-sm rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
