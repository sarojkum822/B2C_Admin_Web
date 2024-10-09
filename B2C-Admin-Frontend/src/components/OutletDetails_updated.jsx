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
                  className={field.fullWidth ? "w-full" : "flex space-x-2 md:space-x-4"}
                >
                  {/* Render select, input, or checkbox group based on field type */}
                  {/* Section Header */}
                  {field.type === "header" ? (
                      <h4 className="text-lg mb-2">{field.placeholder}</h4>
                    ) : field.type === "select" ? (
                      // Dropdown for Outlet Partner
                      <select
                        value={field.value}
                        onChange={field.onChange}
                        className="border border-gray-300 rounded w-full p-1 md:p-2"
                      >
                      <option value="" disabled>
                        {field.placeholder}
                      </option>
                      {field.options.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "checkbox-group" ? (
                    <div className="flex flex-wrap">
                      {field.options.map((option, i) => (
                        <label key={i} className="mr-4">
                          <input
                            type="checkbox"
                            value={option}
                            onChange={field.onChange}
                            className="mr-2"
                            checked={field.value.includes(option)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="border border-gray-300 rounded w-full p-1 md:p-2"
                      value={field.value || ""}
                      onChange={field.onChange}
                      readOnly={field.readOnly}
                    />
                  )}
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
  const [showEditOutletForm, setShowEditOutletForm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    aadharNo: "",
    password: "DP_85", // Default unique password for partners
    phoneNumber: "",
    outletName: "",
    location: "",
    contactNumber: "",
    outletPartner: "",
    deliveryPartners: [],
    photo: null, // Photo file state
  });
  const partners = ["Partner A", "Partner B", "Partner C"];
  const deliveryPartners = ["Delivery A", "Delivery B", "Delivery C"];

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
  const [outletData, setOutletData] = useState([
    {
      number: 1,
      area: "Marathalli",
      partner: "Partner A",
      contact: "123456",
      status: "Closed",
    },
    {
      number: 2,
      area: "Brookfield",
      partner: "Partner B",
      contact: "124578",
      status: "Active",
    },
    {
      number: 3,
      area: "HSR Layout",
      partner: "Partner C",
      contact: "135246",
      status: "Closed",
    },
    {
      number: 4,
      area: "Koramangala",
      partner: "Partner D",
      contact: "143256",
      status: "Active",
    },
    {
      number: 5,
      area: "Whitefield",
      partner: "Partner E",
      contact: "153456",
      status: "Closed",
    },
  ]);
  const [message, setMessage] = useState(""); //deletion


  // Handlers for form toggling
  const handleAddOutletClick = () => {
    setShowAddOutletForm(!showAddOutletForm);
    setShowEditOutletForm(false); 
    setShowAddPartnerForm(false); // Hide the other form
  };

  const handleAddPartnerClick = () => {
    setShowAddPartnerForm(!showAddPartnerForm);
    setShowAddOutletForm(false); // Hide the other form
  };

  const handleCloseForm = () => {
    setShowAddOutletForm(false);
    setShowAddPartnerForm(false);
    setShowEditOutletForm(false);
  };

  // Handler for form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for file upload (photo)
  const handlePhotoUpload = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  // Handler for delivery partner selection
  const handleDeliveryPartnerChange = (e) => {
    const { value, checked } = e.target;
    let updatedPartners = [...formData.deliveryPartners];
    if (checked) {
      updatedPartners.push(value);
    } else {
      updatedPartners = updatedPartners.filter((partner) => partner !== value);
    }
    setFormData({ ...formData, deliveryPartners: updatedPartners });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (showAddOutletForm) {
      // Handle adding new outlet
      setOutletData([...outletData, { ...formData, number: outletData.length + 1 }]);
      setMessage("Outlet added successfully!");
    } else if (showEditOutletForm) {
      // Handle editing existing outlet
      setOutletData((prev) => 
        prev.map((outlet) =>
          outlet.number === formData.number ? { ...formData } : outlet
        )
      );
      setMessage("Outlet updated successfully!");
    }
    handleCloseForm();
  };

  const handleEditOutlet = (outlet) => {
    setFormData({ ...outlet,
      location: outlet.area,
      contactNumber: outlet.contact,
      outletPartner: outlet.partner,
      deliveryPartners: formData.deliveryPartners,
     }); // Pre-fill the form with the outlet data
    setShowEditOutletForm(true); // Show edit form
    setShowAddOutletForm(false); // Hide add form if it's open
  };

  const handleDeleteOutlet = (number) => {
    setOutletData((prev) => prev.filter((outlet) => outlet.number !== number));
    setMessage("Outlet deleted successfully!");
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen w-full">
      {/* Outlet Summary Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Outlet Details</h1>
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
                <th className="px-6 py-3 text-left text-gray-600">Outlet Number</th>
                <th className="px-6 py-3 text-left text-gray-600">Area</th>
                <th className="px-6 py-3 text-left text-gray-600">Contact</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {outletData.map((outlet, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-gray-700">{outlet.number}</td>
                  <td className="px-6 py-4 text-gray-700">{outlet.area}</td>
                  <td className="px-6 py-4 text-gray-700">{outlet.contact}</td>
                  <td className="px-6 py-4 text-gray-700">{outlet.status}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button  onClick={() => handleEditOutlet(outlet)}
                    className="text-blue-500 hover:text-blue-600">
                      <FaEdit />
                    </button>
                    <button 
                    onClick={() => handleDeleteOutlet(outlet.number)}
                    className="text-red-500 hover:text-red-600">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between mt-5">
          <button
            onClick={handleAddPartnerClick}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            + Add an Outlet Partner
          </button>
          <button
            onClick={handleAddOutletClick}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            + Add an Outlet
          </button>
        </div>

      {/* Add Outlet Form Modal */}
      <AddFormModal
  title="Add Outlet"
  show={showAddOutletForm}
  handleClose={handleCloseForm}
  handleSubmit={handleSubmit}
  handlePhotoUpload={handlePhotoUpload}
  fields={[
    {
      placeholder: "Outlet No.",
      value: "00123", // Example value (can be dynamic)
      onChange: () => {}, // Read-only, no handler needed
      readOnly: true,
    },
    {
      placeholder: "Outlet Area",
      value: formData.location,
      onChange: (e) => setFormData({ ...formData, location: e.target.value }),
    },
    {
      placeholder: "Phone Number",
      value: formData.contactNumber,
      onChange: (e) => setFormData({ ...formData, contactNumber: e.target.value }),
    },
    
    {
      type: "select",
      placeholder: "Select an Outlet Partner",
      value: formData.outletPartner,
      onChange: (e) => setFormData({ ...formData, outletPartner: e.target.value }),
      options: partners,
    },
    {
      type: "header",
      placeholder: "Delivery Partners",
      fullWidth: true,
    },
    {
      type: "checkbox-group",
      placeholder: "Select Delivery Partners",
      value: formData.deliveryPartners,
      onChange: handleDeliveryPartnerChange,
      options: deliveryPartners,
    },
    
  ]}
/>
{/* Edit Outlet Modal */}
      <AddFormModal
        title="Edit Outlet"
        fields={[
          {
            placeholder: "Outlet No.",
            value: formData.number, // Using outlet number dynamically
            onChange: () => {}, // Read-only, no handler needed
            readOnly: true,
          },
          {
            placeholder: "Outlet Area",
            value: formData.location,
            onChange: (e) => setFormData({ ...formData, location: e.target.value }),
          },
          {
            placeholder: "Phone Number",
            value: formData.contactNumber,
            onChange: (e) => setFormData({ ...formData, contactNumber: e.target.value }),
          },
          {
            type: "select",
            placeholder: "Select an Outlet Partner",
            value: formData.outletPartner,
            onChange: (e) => setFormData({ ...formData, outletPartner: e.target.value }),
            options: partners,
          },
          {
            type: "header",
            placeholder: "Delivery Partners",
            fullWidth: true,
          },
          {
            type: "checkbox-group",
            placeholder: "Select Delivery Partners",
            value: formData.deliveryPartners,
            onChange: handleDeliveryPartnerChange,
            options: deliveryPartners,
          },
        ]}
        show={showEditOutletForm}
        handleClose={handleCloseForm}
        handleSubmit={handleSubmit}
        handlePhotoUpload={handlePhotoUpload}
      />
      {/* Add Outlet Partner Form Modal */}
      <AddFormModal
        title="Add Outlet Partner"
        show={showAddPartnerForm}
        handleClose={handleCloseForm}
        handleSubmit={handleSubmit}
        handlePhotoUpload={handlePhotoUpload}
        fields={[
          {
            placeholder: "First Name",
            value: formData.firstName,
            onChange: (e) => setFormData({ ...formData, firstName: e.target.value }),
          },
          {
            placeholder: "Last Name",
            value: formData.lastName,
            onChange: (e) => setFormData({ ...formData, lastName: e.target.value }),
          },
          {
            placeholder: "Aadhar No.",
            value: formData.aadharNo,
            onChange: (e) =>
              setFormData({ ...formData, aadharNo : e.target.value }),
          },
          {
            placeholder: "Unique Password",
            value: "OP_940", 
            onChange: () => {}, 
            readOnly: true,
          },
          {
            placeholder: "Phone Number",
            value: formData.phoneNumber,
            onChange: (e) => setFormData({ ...formData, phoneNumber: e.target.value }),
          },
        ]}
      />
    </div>
  );
};

export default OutletDetails;
