import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPartner, resetState } from '../redux/OutletPartnerForm'; // Assuming partnerSlice is in the same folder
import { toast } from 'react-toastify';
import { fetchOutletDetails } from '../redux/outletDetails';
import { useNavigate } from 'react-router-dom';

const OutletPartnerForm = ({ handleClose }) => {

  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    aadharNumber: '',
    uniquePassword: '',
    phoneNumber: '',
    profileImage: null,
  });


  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.partner); // Access loading, error, and success from Redux state


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        profileImage: file, // Set the file in state
      }));
  
      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    

    // Check if the image file is present in the formData
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.aadharNumber,
      formData.uniquePassword,
      formData.phoneNumber,
      formData.profileImage,
    ];
  
    // Check if any required field is missing
    if (requiredFields.some(field => !field)) {
      toast.error('All fields are required');
      return; // Stop the form submission
    }
  
    console.log('Form Data Before Submit:', formData);
  
    // Proceed with dispatching addPartner
    dispatch(addPartner(formData))
      .unwrap()
      .then(() => {
        // Handle success
        handleClose();
        setFormData({
          firstName: '',
          lastName: '',
          aadharNumber: '',
          uniquePassword: '',
          phoneNumber: '',
          profileImage: null,
        }); // Reset form data
        setRefresh(!refresh);
        navigate('/outlet')
      })
      
      .catch((err) => {
        // Handle error
        console.error('Error adding partner:', err);
      });
  };

  useEffect(() => {
    // This will run when the component mounts AND when 'refresh' changes.
    // Make sure you have the correct action to fetch your data (e.g., fetchOutletDetails)
    dispatch(fetchOutletDetails());  // Or whatever your fetch action is.
}, [dispatch, refresh]);
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 relative">
      <button
        onClick={handleClose}
        className="absolute underline text-red-400 top-4 right-4 hover:scale-110 bg-white hover:border-2  pl-2 pr-2"
      >
        Close &times;
      </button>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="text-2xl font-bold text-navy-900 mb-6">Add an Outlet Partner</div>

          <div className="space-y-4">
            {/* Input fields for first name, last name, aadhar number, password, phone number */}
            <div>
              <label htmlFor="firstName" className="block text-orange-500 font-medium mb-1">
                FIRST NAME
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-orange-500 font-medium mb-1">
                LAST NAME
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="aadharNumber" className="block text-orange-500 font-medium mb-1">
                AADHAR NUMBER
              </label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                placeholder="12345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="uniquePassword" className="block text-orange-500 font-medium mb-1">
                UNIQUE PASSWORD
              </label>
              <input
                type="password"
                id="uniquePassword"
                name="uniquePassword"
                value={formData.uniquePassword}
                onChange={handleInputChange}
                placeholder="12345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-orange-500 font-medium mb-1">
                PHONE NUMBER
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="12345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="profileImage" className="block text-orange-500 font-medium mb-1">
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  onChange={handleImageChange}
                  accept=".png,.jpg,.jpeg,.svg"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-500 hover:file:bg-orange-100"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Adding...' : '+ ADD'}
          </button>

          {error && <div className="text-red-500 mt-2">{error}</div>}
          {success && <div className="text-green-500 mt-2">Partner added successfully!</div>}
        </div>
      </form>
    </div>
  );
};

export default OutletPartnerForm;
