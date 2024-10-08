import React, { useState } from "react";
import {
  FaPlus,
  FaRupeeSign,
  FaStore,
  FaShoppingCart,
  FaUsers,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

// Reusable Modal Form Component
const AddFormModal = ({
  title,
  fields,
  show,
  handleClose,
  handleSubmit,
  handlePhotoUpload,
}) => {
  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-xs md:max-w-md relative">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Photo Upload */}
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 md:h-16 md:w-16 bg-gray-200 rounded-full flex items-center justify-center">
                  📷
                </div>
                <label
                  htmlFor="photo-upload"
                  className="ml-4 bg-gray-300 px-3 md:px-4 py-1 md:py-2 rounded hover:bg-gray-400 cursor-pointer"
                >
                  Upload Photo
                </label>
                {/* Hidden file input */}
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Dynamic Fields */}
              {fields.map((field, index) => (
                <div
                  key={index}
                  className={
                    field.fullWidth ? "w-full" : "flex space-x-2 md:space-x-4"
                  }
                >
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    className="border border-gray-300 rounded w-full p-1 md:p-2"
                    value={field.value || ""}
                    onChange={field.onChange}
                    readOnly={field.readOnly}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded w-full hover:bg-orange-600"
              >
                {title.includes("Partner") ? "Save Partner" : "Save Outlet"}
              </button>
            </form>

            <button
              className="mt-4 text-red-500 hover:underline"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const OutletDetails = () => {
  // State to manage which form to show
  const [showAddOutletForm, setShowAddOutletForm] = useState(false);
  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    driverLicense: "",
    password: "DP_85", // Default unique password for partners
    phoneNumber: "",
    outletName: "",
    location: "",
    contactNumber: "",
    outletPartner: "",
    deliveryPartners: [],
    photo: null, // Photo file state
  });

  const outletPartners = ["Partner A", "Partner B", "Partner C"]; // Example outlet partners
  const deliveryPartners = ["BHUGURAM", "EKRAMUL"]; // Example delivery partners

  // Outlet Summary Data
  const summaryData = [
    {
      label: "Revenue",
      value: "₹ 1,07,825",
      icon: <FaRupeeSign className="text-orange-500" />,
    },
    {
      label: "Orders",
      value: "9200",
      icon: <FaShoppingCart className="text-orange-500" />,
    },
    {
      label: "Outlets",
      value: "23",
      icon: <FaStore className="text-orange-500" />,
    },
    {
      label: "Delivery Partners",
      value: "78",
      icon: <FaUsers className="text-orange-500" />,
    },
  ];

  // Outlet List Data
  const outletData = [
    {
      number: 1,
      area: "Marathalli",
      partner: "Partner A",
      contact: "123456",
      status: "Closed",
    },
    // More outlets ...
  ];

  // Handlers for form toggling
  const handleAddOutletClick = () => {
    setShowAddOutletForm(!showAddOutletForm);
    setShowAddPartnerForm(false); // Hide the other form
  };

  const handleAddPartnerClick = () => {
    setShowAddPartnerForm(!showAddPartnerForm);
    setShowAddOutletForm(false); // Hide the other form
  };

  const handleCloseForm = () => {
    setShowAddOutletForm(false);
    setShowAddPartnerForm(false);
  };

  // Handler for form inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for file upload (photo)
  const handlePhotoUpload = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // For demo purposes, logging the form data
    handleCloseForm();
  };

  const handlePartnerSelection = (e) => {
    setFormData({ ...formData, outletPartner: e.target.value });
  };

  const handleDeliveryPartnerSelection = (e) => {
    const selectedPartner = e.target.value;
    const isChecked = e.target.checked;

    setFormData((prevState) => ({
      ...prevState,
      deliveryPartners: isChecked
        ? [...prevState.deliveryPartners, selectedPartner]
        : prevState.deliveryPartners.filter((partner) => partner !== selectedPartner),
    }));
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen w-full">
      {/* Outlet Summary Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Outlet Details
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-lg font-bold text-gray-800">{item.value}</p>
              </div>
              <div className="text-2xl">{item.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Outlet List Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Outlets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">
                  Outlet Number
                </th>
                <th className="px-6 py-3 text-left text-gray-600">Area</th>
                <th className="px-6 py-3 text-left text-gray-600">
                  Outlet Partner
                </th>
                <th className="px-6 py-3 text-left text-gray-600">Contact</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {outletData.map((outlet, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{outlet.number}</td>
                  <td className="px-6 py-4">{outlet.area}</td>
                  <td className="px-6 py-4">{outlet.partner}</td>
                  <td className="px-6 py-4">{outlet.contact}</td>
                  <td
                    className={`px-6 py-4 ${
                      outlet.status === "Closed"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {outlet.status}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-500 mr-4 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex mt-4 space-x-2">
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center"
          onClick={handleAddOutletClick}
        >
          <FaPlus className="mr-2" />
          Add Outlet
        </button>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          onClick={handleAddPartnerClick}
        >
          <FaPlus className="mr-2" />
          Add Outlet Partner
        </button>
      </div>

      {/* Add Outlet Modal */}
      <AddFormModal
        title="Add Outlet"
        fields={[
          {
            placeholder: "Outlet Name",
            value: formData.outletName,
            onChange: handleInputChange,
            name: "outletName",
          },
          {
            placeholder: "Location",
            value: formData.location,
            onChange: handleInputChange,
            name: "location",
          },
          {
            placeholder: "Contact Number",
            value: formData.contactNumber,
            onChange: handleInputChange,
            name: "contactNumber",
          },
          {
            type: "select",
            placeholder: "Outlet Partner",
            value: formData.outletPartner,
            onChange: handlePartnerSelection,
            options: outletPartners,
          },
          {
            type: "checkbox-group",
            placeholder: "Delivery Partners",
            options: deliveryPartners,
            onChange: handleDeliveryPartnerSelection,
          },
        ]}
        show={showAddOutletForm}
        handleClose={handleCloseForm}
        handleSubmit={handleSubmit}
        handlePhotoUpload={handlePhotoUpload}
      />

      {/* Add Outlet Partner Modal */}
      <AddFormModal
        title="Add Outlet Partner"
        fields={[
          {
            placeholder: "First Name",
            value: formData.firstName,
            onChange: handleInputChange,
            name: "firstName",
          },
          {
            placeholder: "Last Name",
            value: formData.lastName,
            onChange: handleInputChange,
            name: "lastName",
          },
          {
            placeholder: "Driver License",
            value: formData.driverLicense,
            onChange: handleInputChange,
            name: "driverLicense",
          },
          {
            placeholder: "Phone Number",
            value: formData.phoneNumber,
            onChange: handleInputChange,
            name: "phoneNumber",
          },
        ]}
        show={showAddPartnerForm}
        handleClose={handleCloseForm}
        handleSubmit={handleSubmit}
        handlePhotoUpload={handlePhotoUpload}
      />
    </div>
  );
};

export default OutletDetails;
