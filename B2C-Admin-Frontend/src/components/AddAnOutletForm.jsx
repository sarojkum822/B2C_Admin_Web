import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AddAnOutletForm = ({ handleClose }) => {

  const [formData, setFormData] = useState({
    outletNumber: '',
    area: '',
    outletPartner: '',
    phoneNumber: '',
    deliveryPartners: [],
    image: null,
    location: {
      fullAddress: {
        flatNo: '',
        area: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      coordinates: {
        lat: null,
        long: null
      }
    }
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lat, setlat] = useState("");
  const [long, setlong] = useState("");
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      outletNumber: '(auto-generated)'
    }));
  }, []);

  const getGeolocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                lat: position.coords.latitude,
                long: position.coords.longitude
              }
            }
          }));
          setlat(position.coords.latitude);
          setlong(position.coords.longitude);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "area" ? value.charAt(0).toUpperCase() + value.slice(1) : value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        fullAddress: {
          ...prev.location.fullAddress,
          [name]: value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeliveryPartnersChange = (partnerId) => {
    setFormData(prev => {
      const partners = [...prev.deliveryPartners];
      const index = partners.indexOf(partnerId);

      if (index === -1) {
        partners.push(partnerId);
      } else {
        partners.splice(index, 1);
      }

      return {
        ...prev,
        deliveryPartners: partners
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      formData.area,
      formData.outletPartner,
      formData.location.fullAddress.flatNo,
      formData.location.fullAddress.area
    ];

    if (requiredFields.some(field => !field)) {
      toast.error('All fields are required');
      return; // Stop the form submission
    }

    setErrorMessage(''); // Clear any previous error message
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('id', formData.phoneNumber);
      formDataToSend.append('phNo', formData.phoneNumber);
      formDataToSend.append('name', formData.area);
      formDataToSend.append('location', JSON.stringify(formData.location));
      formDataToSend.append('outletPartnerId', formData.outletPartner);
      formData.deliveryPartners.forEach((partnerId) => {
        formDataToSend.append('deliveryPartners[]', partnerId);
      });
      if (formData.image) {
        formDataToSend.append('img', formData.image);
      }

      const response = await fetch('https://b2c-49u4.onrender.com/api/v1/admin/addOutlet', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to add outlet');

      const data = await response.json();
      console.log('Success:', data);
      handleClose(); // Close modal on success
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Add an Outlet</h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 hover:scale-110 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : '+ ADD'}
          </button>
        </div>
      </div>

      <form className="space-y-4"
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin', padding: '20px', // This works on Firefox, other browsers need custom styles
        }}
      >
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Outlet Number
          </label>
          <input
            type="text"
            value={formData.outletNumber}
            disabled
            className="w-full px-4 py-2 text-gray-600 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            placeholder="4 (auto-generated)"
          />
        </div>


        <div>
          <label className="block text-orange-500 font-medium mb-1">
            OUTLET AREA
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter Area Name"
          />
        </div>

        <div>
          <label className="block text-orange-500 font-medium mb-1">
            OUTLET PARTNER
          </label>
          <select
            name="outletPartner"
            value={formData.outletPartner}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select an Outlet Partner</option>
            <option value="partner_a">Partner A </option>
            <option value="partner_a">Partner B </option>
            <option value="partner_a">Partner C </option>
          </select>
        </div>

        <div>
          <label className="block text-orange-500 font-medium mb-1">
            PHONE NUMBER
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="12345678"
          />
        </div>

        <div>
          <label className="block text-orange-500 font-medium mb-1">
            DELIVERY PARTNERS
          </label>
          <div className="space-y-2 border border-gray-300 rounded-md p-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="partner_a"
                checked={formData.deliveryPartners.includes('partner_a')}
                onChange={() => handleDeliveryPartnersChange('partner_a')}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Delivery A</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="partner_b"
                checked={formData.deliveryPartners.includes('partner_b')}
                onChange={() => handleDeliveryPartnersChange('partner_b')}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Delivery B</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                value="partner_c"
                checked={formData.deliveryPartners.includes('partner_c')}
                onChange={() => handleDeliveryPartnersChange('partner_c')}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Delivery C</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-orange-500 font-medium mb-1">
            LOCATION
          </label>
          <div className="space-y-2">
            <input
              type="text"
              name="flatNo"
              value={formData.location.fullAddress.flatNo}
              onChange={handleAddressChange}
              placeholder="Flat No"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                name="area"
                value={formData.location.fullAddress.area}
                onChange={handleAddressChange}
                placeholder="Area"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={getGeolocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Getting Location...' : 'Get Location'}
              </button>
            </div>
            {formData.location.coordinates.lat && (
              <div className="text-sm text-gray-600">
                Lat: {formData.location.coordinates.lat.toFixed(4)},
                Long: {formData.location.coordinates.long.toFixed(4)}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-orange-500 font-medium mb-1">
            OUTLET IMAGE
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
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
      </form>
    </>
  );
};

export default AddAnOutletForm;
