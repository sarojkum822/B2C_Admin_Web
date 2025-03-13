import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditPartnerModal = ({ partner, onClose, refreshPartners }) => {
    console.log(partner);
    
  const [formData, setFormData] = useState({
    firstName: partner.data.firstName,
    lastName: partner.data.lastName,
    aadharNumber: partner.data.aadharNo || "",
    uniquePassword: partner.data.password || "",
    img: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, img: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("aadharNumber", formData.aadharNumber);
      formDataToSend.append("uniquePassword", formData.uniquePassword);
      if (formData.img) {
        formDataToSend.append("img", formData.img);
      }
      
      await axios.patch(
        `https://b2c-backend13.onrender.com/api/v1/admin/updateOutletPartner/${partner.id}`,
        formDataToSend, { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      toast.success("Outlet partner updated successfully!");
      refreshPartners();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update outlet partner.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Edit Partner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-orange-500 font-medium mb-1">First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-orange-500 font-medium mb-1">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-orange-500 font-medium mb-1">Aadhar Number</label>
            <input type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-orange-500 font-medium mb-1">Unique Password</label>
            <input type="password" name="uniquePassword" value={formData.uniquePassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-orange-500 font-medium mb-1">Profile Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-sm text-gray-500" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded mt-2" />}
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPartnerModal;
