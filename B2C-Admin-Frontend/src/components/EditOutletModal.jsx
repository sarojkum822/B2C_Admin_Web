import React, { useEffect, useState,useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaMapMarkerAlt, FaPhone, FaPlus, FaTimes } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Leaflet icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const EditOutletModal = ({ outlet, onClose, refreshOutlets }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [locationMessage, setLocationMessage] = useState(
    "Please choose exact location"
  );
  // Add near the other useState declarations at the top
  const [availableDrivers, setAvailableDrivers] = useState([]);

  // Initialize formData with the structure matching your input example
  // In EditOutletModal.jsx, around line 11-27
  const [formData, setFormData] = useState({
    name: outlet.name || "",
    phNo: outlet.phNo || "",
    outletPartnerId: outlet.outletPartnerId || "",
    address: {
      fullAddress: {
        flatNo: outlet.address?.fullAddress?.flatNo || "",
        area: outlet.address?.fullAddress?.area || "",
        city: outlet.address?.fullAddress?.city || "",
        state: outlet.address?.fullAddress?.state || "",
        zipCode: outlet.address?.fullAddress?.zipCode || "",
        country: outlet.address?.fullAddress?.country || "",
      },
      coordinates: {
        lat: outlet.address?.coordinates?.lat || 18.9685517,
        long: outlet.address?.coordinates?.long || 77.70372,
      },
    },
    // Change this line:
    deleveryPartners: Array.isArray(outlet.deleveryPartners)
      ? outlet.deleveryPartners
      : [],
    img: null,
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
          [name]: value,
        },
      },
    }));
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        coordinates: {
          ...prev.address.coordinates,
          [name]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddPartner = () => {
    if (newPartner && !formData.deleveryPartners.includes(newPartner)) {
      setFormData((prev) => ({
        ...prev,
        deleveryPartners: [...prev.deleveryPartners, newPartner],
      }));
      setNewPartner("");
    }
  };

  const handleRemovePartner = (partner) => {
    setFormData((prev) => ({
      ...prev,
      deleveryPartners: prev.deleveryPartners.filter((p) => p !== partner),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();

      // Append fields matching your expected input structure
      data.append("name", formData.name);
      data.append("phNo", formData.phNo);
      data.append("outletPartnerId", formData.outletPartnerId);
      data.append("address", JSON.stringify(formData.address));

      // Note: Using "deleveryPartners" to match your specified typo in the structure
      formData.deleveryPartners.forEach((partner) => {
        data.append("deleveryPartners", partner);
      });

      if (formData.img instanceof File) {
        data.append("img", formData.img);
      }

      const response = await axios.patch(
        `https://b2c-backend-eik4.onrender.com/api/v1/admin/outlet/update/${outlet.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Assuming the response matches your expected output structure
      if (response.data.status === "success") {
        toast.success(response.data.message || "Outlet updated successfully");
        onClose();
        setTimeout(() => refreshOutlets(), 500);
      }
    } catch (error) {
      console.error("Error updating outlet:", error);
      toast.error(
        "Failed to update outlet: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function before your component or in a separate utility file
  const geocodeAddress = async (address) => {
    try {
      // Only use the most relevant fields for geocoding
      const relevantFields = ["area", "city", "state", "country", "zipCode"];
      const addressParts = relevantFields
        .map((field) => address[field])
        .filter((val) => val)
        .join(", ");

      if (!addressParts) return null;

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addressParts
        )}&limit=1`
      );

      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          long: parseFloat(response.data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };
  const getCurrentLocation = () => {
    setLocationMessage("Getting your current location...");

    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            coordinates: {
              lat: latitude,
              long: longitude,
            },
          },
        }));
        setLocationMessage("Location updated successfully!");

        // Optionally, try to reverse geocode to get the address
        fetchAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationMessage(
          `Error: ${error.message}. Please allow location access.`
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchAddressFromCoordinates = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`
      );

      if (response.data && response.data.address) {
        const addr = response.data.address;

        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            fullAddress: {
              ...prev.address.fullAddress,
              area:
                addr.suburb ||
                addr.neighbourhood ||
                addr.hamlet ||
                prev.address.fullAddress.area,
              city:
                addr.city ||
                addr.town ||
                addr.village ||
                prev.address.fullAddress.city,
              state: addr.state || prev.address.fullAddress.state,
              country: addr.country || prev.address.fullAddress.country,
              zipCode: addr.postcode || prev.address.fullAddress.zipCode,
            },
          },
        }));

        setLocationMessage("Location and address updated successfully!");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Don't update the location message here, as we still have the coordinates
    }
  };

  // Then in your component, replace the useEffect with:
  useEffect(() => {
    // Prevent excessive API calls with a debounce mechanism
    const timeoutId = setTimeout(async () => {
      // Only proceed if we have some address data
      if (Object.values(formData.address.fullAddress).some((val) => val)) {
        setLocationMessage("Finding location from address...");
        // Don't geocode if user is actively editing coordinates
        const coordinates = await geocodeAddress(formData.address.fullAddress);
        if (coordinates) {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              coordinates,
            },
          }));
          setLocationMessage(
            "Location found! Please verify the exact position."
          );
        } else {
          setLocationMessage(
            "Couldn't find exact location. Please position marker manually."
          );
        }
      }
    }, 1500); // Wait 1.5 seconds after typing stops

    return () => clearTimeout(timeoutId);
  }, [formData.address.fullAddress]);

  useEffect(() => {
    // Only proceed if we have sufficient address data
    const hasAddress =
      formData.address.fullAddress.city || formData.address.fullAddress.zipCode;

    if (hasAddress) {
      // Clear any existing timeout
      const timeoutId = setTimeout(async () => {
        setLocationMessage("Finding location...");
        const coordinates = await geocodeAddress(formData.address.fullAddress);
        if (coordinates) {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              coordinates,
            },
          }));
          setLocationMessage("Location updated!");
        } else {
          setLocationMessage(
            "Couldn't find location. Please position marker manually."
          );
        }
      }, 500); // Reduced to 500ms for faster response

      return () => clearTimeout(timeoutId);
    }
  }, [formData.address.fullAddress]);

  // Add after your other useEffect hooks
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          "https://b2c-backend-eik4.onrender.com/api/v1/admin/deliveryInsights"
        );
        if (response.data && response.data.drivers) {
          setAvailableDrivers(response.data.drivers);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Failed to load delivery partners");
      }
    };

    fetchDrivers();
  }, []);

  // Add these state variables at the top of your component with other useState declarations
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

// Add this useEffect to handle clicking outside the dropdown to close it
useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Rest of the JSX remains largely the same, just updating the field names
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Edit Outlet: {formData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
  
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {["basic", "address", "partners", "image"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "basic" && "Basic Info"}
              {tab === "address" && "Location & Address"}
              {tab === "partners" && "Delivery Partners"}
              {tab === "image" && "Image"}
            </button>
          ))}
        </div>
  
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
              e.preventDefault();
            }
          }}
        >
          <div className="p-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outlet Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner ID
                    </label>
                    <input
                      type="text"
                      name="outletPartnerId"
                      value={formData.outletPartnerId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phNo"
                    value={formData.phNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
            )}
  
            {activeTab === "address" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lat"
                      value={formData.address.coordinates.lat}
                      onChange={handleCoordinateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="long"
                      value={formData.address.coordinates.long}
                      onChange={handleCoordinateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>
  
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-indigo-600 font-medium">
                      {locationMessage}
                    </p>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FaMapMarkerAlt className="w-4 h-4" />
                      Use My Location
                    </button>
                  </div>
                  <div className="h-72 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[formData.address.coordinates.lat, formData.address.coordinates.long]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker
                        position={[formData.address.coordinates.lat, formData.address.coordinates.long]}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e) => {
                            const marker = e.target;
                            const position = marker.getLatLng();
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                coordinates: { lat: position.lat, long: position.lng },
                              },
                            }));
                            setLocationMessage("Location updated! Please verify the exact position.");
                          },
                        }}
                      />
                      <MapUpdater center={[formData.address.coordinates.lat, formData.address.coordinates.long]} />
                    </MapContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Drag the marker to set the exact location coordinates
                  </p>
                </div>
  
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt /> Address Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Flat No.", name: "flatNo" },
                      { label: "Area", name: "area" },
                      { label: "City", name: "city" },
                      { label: "State", name: "state" },
                      { label: "ZIP Code", name: "zipCode" },
                      { label: "Country", name: "country" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={formData.address.fullAddress[field.name]}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
  
  {activeTab === "partners" && (
            <div className="space-y-6">
              <div className="flex gap-3">
              <div className="relative flex-1" ref={dropdownRef}>
  <div
    className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all text-sm cursor-pointer"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  >
    <span className="text-gray-700">
      {newPartner ? availableDrivers.find(driver => driver.id === newPartner)?.name || "Select Delivery Partner" : "Select Delivery Partner"}
    </span>
    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>
  
  {isDropdownOpen && (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
      <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
        {/* <input
          type="text"
          placeholder="Search partners..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            // Implement search functionality if needed
          }}
        /> */}
      </div>
      
      {/* Approved Partners Group */}
      {/* <div className="p-2 bg-gray-100 text-xs font-semibold text-gray-500 sticky top-2">
        Approved Partners
      </div> */}
      {availableDrivers
        .filter(driver => !formData.deleveryPartners.includes(driver.id))
        .filter(driver => {
          const isApproved = driver.approved === true || 
            (typeof driver.approved === "object" && driver.approved.generalDetails && 
            driver.approved.personalDocs && driver.approved.vehicleDetails && 
            driver.approved.bankDetails);
          return isApproved;
        })
        .map(driver => (
          <div
            key={`approved-${driver.id}`}
            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between"
            onClick={() => {
              setNewPartner(driver.id);
              setIsDropdownOpen(false);
            }}
          >
            <div>
              <div className="font-medium">{driver.name}</div>
              <div className="text-xs text-gray-500">
                ID: {driver.id} • {driver.totalDeliveries} Deliveries • {driver.ratings}★
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                Approved
              </span>
            </div>
          </div>
        ))}
      
      {/* Pending Partners Group */}
      {/* <div className="p-1 bg-gray-100 text-xs font-semibold text-gray-500 sticky relative top-16">
        Pending Partners
      </div> */}
      {availableDrivers
        .filter(driver => !formData.deleveryPartners.includes(driver.id))
        .filter(driver => {
          const isApproved = driver.approved === true || 
            (typeof driver.approved === "object" && driver.approved.generalDetails && 
            driver.approved.personalDocs && driver.approved.vehicleDetails && 
            driver.approved.bankDetails);
          return !isApproved;
        })
        .map(driver => (
          <div
            key={`pending-${driver.id}`}
            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between"
            onClick={() => {
              setNewPartner(driver.id);
              setIsDropdownOpen(false);
            }}
          >
            <div>
              <div className="font-medium">{driver.name}</div>
              <div className="text-xs text-gray-500">
                ID: {driver.id} • {driver.totalDeliveries} Deliveries • {driver.ratings}★
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                <span className="w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
                Pending
              </span>
            </div>
          </div>
        ))}
    </div>
  )}
</div>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                  onClick={handleAddPartner}
                  disabled={!newPartner}
                >
                  Add Partner
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <FaPhone /> Assigned Partners
                </h3>
                {formData.deleveryPartners.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.deleveryPartners.map((partnerId, index) => {
                      const partnerDetails = availableDrivers.find((driver) => driver.id === partnerId) || {};
                      const isApproved =
                        partnerDetails.approved === true ||
                        (typeof partnerDetails.approved === "object" &&
                          partnerDetails.approved.generalDetails &&
                          partnerDetails.approved.personalDocs &&
                          partnerDetails.approved.vehicleDetails &&
                          partnerDetails.approved.bankDetails);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{partnerDetails.name || "Unknown"}</span>
                            <br />
                            <span>ID: {partnerId}</span>
                            <br />
                            <span>
                              Deliveries: {partnerDetails.totalDeliveries || 0} | Rating:{" "}
                              {partnerDetails.ratings || 0}★ |{" "}
                              <span className={isApproved ? "text-green-600" : "text-red-600"}>
                                {isApproved ? "Approved" : "Pending"}
                              </span>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePartner(partnerId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No delivery partners assigned yet</p>
                )}
              </div>
            </div>
          )}

{activeTab === "image" && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Outlet Image
                  </label>
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
                  {outlet.img && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Current Image
                      </h4>
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <img
                          src={outlet.img}
                          alt="Current Outlet"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                  {formData.img && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        New Image Preview
                      </h4>
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