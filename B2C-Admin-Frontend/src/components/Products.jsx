import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // Stores the product being edited
  const [updatedValues, setUpdatedValues] = useState({ rate: "", discount: "", countInStock: "" }); // Fix the field name here

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://b2c-backend-1.onrender.com/api/v1/admin/getallproducts");
        setProducts(response.data); // Assuming API returns an array of products
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product); // Set the product being edited
    setUpdatedValues({ rate: product.rate, discount: product.discount, countInStock: product.countInStock }); // Include countInStock here
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedValues({ ...updatedValues, [name]: value });
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      const { id } = editingProduct;
      await axios.patch(`https://b2c-backend-1.onrender.com/api/v1/admin/changeproductprice/${id}`, updatedValues);

      // Update the product list locally after successful API call
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, ...updatedValues } : product
        )
      );

      setEditingProduct(null); // Exit editing mode
      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err.message);
      toast.error("Failed to update product.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 font-bold mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-bold">Price:</span> ${product.rate}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-bold">Discount:</span> {product.discount}%
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-bold">In Stock:</span> {product.countInStock}
            </p>
            <button
              onClick={() => handleEdit(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-1/3 h-full p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
                placeholder="Enter the count in stock"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
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
