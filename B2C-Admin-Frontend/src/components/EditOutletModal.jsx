import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaMapMarkerAlt, FaPhone, FaPlus, FaTimes, FaLocationArrow } from "react-icons/fa";

const EditOutletModal = ({ outlet, onClose, refreshOutlets }) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  // Initialize with all outlet properties
  const [formData, setFormData] = useState({
    name: outlet.name || "",
    contact: outlet.contact || "",
    phNo: outlet.phNo || "",
    area: outlet.area || "",
    outletPartnerId: outlet.outletPartnerId || "",
    lat: outlet.lat || "",
    long: outlet.long || "",
    img: null,
    address: {
      fullAddress: {
        flatNo: outlet.address?.fullAddress?.flatNo || "",
        area: outlet.address?.fullAddress?.area || "",
        city: outlet.address?.fullAddress?.city || "",
        state: outlet.address?.fullAddress?.state || "",
        zipCode: outlet.address?.fullAddress?.zipCode || "",
        country: outlet.address?.fullAddress?.country || "",
      }
    },
    deleveryPartners: outlet.deleveryPartners || [],
  });

  const [newPartner, setNewPartner] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(outlet.img || null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        fullAddress: {
          ...prev.address.fullAddress,
          [name]: value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPartner = () => {
    if (newPartner.trim() && !formData.deleveryPartners.includes(newPartner.trim())) {
      setFormData((prev) => ({
        ...prev,
        deleveryPartners: [...prev.deleveryPartners, newPartner.trim()]
      }));
      setNewPartner("");
    }
  };

  const handleRemovePartner = (partner) => {
    setFormData((prev) => ({
      ...prev,
      deleveryPartners: prev.deleveryPartners.filter(p => p !== partner)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object
      const data = new FormData();
      
      // Add basic info
      data.append("name", formData.name);
      data.append("contact", formData.contact);
      data.append("phNo", formData.phNo || formData.contact);
      data.append("area", formData.area);
      data.append("outletPartnerId", formData.outletPartnerId);
      
      // Add coordinates
      data.append("lat", formData.lat);
      data.append("long", formData.long);
      
      // Add address as JSON string
      data.append("address", JSON.stringify({
        fullAddress: formData.address.fullAddress,
        coordinates: {
          lat: parseFloat(formData.lat) || 0,
          long: parseFloat(formData.long) || 0
        }
      }));
      
      // Add delivery partners
      formData.deleveryPartners.forEach(partner => {
        data.append("deleveryPartners", partner);
      });
      
      // Add image if changed
      if (formData.img) {
        data.append("img", formData.img);
      }

      const response = await axios.patch(
        `https://b2c-backend-eik4.onrender.com/api/v1/admin/updateOutlet/${outlet.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Outlet updated successfully");
      onClose();
      
      // Force a refresh of the outlet data
      setTimeout(() => {
        refreshOutlets();
      }, 500);
    } catch (error) {
      console.error("Error updating outlet:", error);
      toast.error("Failed to update outlet: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Outlet: {outlet.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "basic" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "address" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("address")}
          >
            Location & Address
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "partners" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("partners")}
          >
            Delivery Partners
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "image" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("image")}
          >
            Image
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Outlet Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Partner ID</label>
                    <input
                      type="text"
                      name="outletPartnerId"
                      value={formData.outletPartnerId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Primary Contact*</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Alternative Phone</label>
                    <input
                      type="text"
                      name="phNo"
                      value={formData.phNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Area*</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Address Tab - Modified to remove map */}
            {activeTab === "address" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Latitude*</label>
                    <input
                      type="text"
                      name="lat"
                      value={formData.lat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Longitude*</label>
                    <input
                      type="text"
                      name="long"
                      value={formData.long}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                </div>

                <div className="p-4 rounded-lg border bg-blue-50 mb-4">
                  <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt /> Full Address
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Flat/House No.</label>
                      <input
                        type="text"
                        name="flatNo"
                        value={formData.address.fullAddress.flatNo}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Area/Locality</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.address.fullAddress.area}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.address.fullAddress.city}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.address.fullAddress.state}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.address.fullAddress.zipCode}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.address.fullAddress.country}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Partners Tab */}
            {activeTab === "partners" && (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPartner}
                    onChange={(e) => setNewPartner(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter delivery partner phone number"
                  />
                  <button 
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleAddPartner}
                  >
                    Add
                  </button>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FaPhone /> Current Delivery Partners
                  </h3>
                  
                  {formData.deleveryPartners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.deleveryPartners.map((partner, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                        >
                          <span className="font-medium">{partner}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePartner(partner)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No delivery partners added yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Image Tab */}
            {activeTab === "image" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">Outlet Image</label>
                  <input
                    type="file"
                    name="img"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    accept="image/*"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: Square image, minimum 500x500px
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Image */}
                  {outlet.img && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Current Image</h4>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <img
                          src={outlet.img}
                          alt="Current Outlet"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* New Image Preview */}
                  {formData.img && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">New Image Preview</h4>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <img
                          src={imagePreview}
                          alt="New Outlet"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Outlet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOutletModal;