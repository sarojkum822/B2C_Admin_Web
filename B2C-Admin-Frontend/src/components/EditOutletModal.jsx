import React, { useEffect, useState } from "react";
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

  // Rest of the JSX remains largely the same, just updating the field names
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Outlet: {formData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Outlet Name*
                    </label>
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
                    <label className="block text-gray-700 mb-2 font-medium">
                      Partner ID
                    </label>
                    <input
                      type="text"
                      name="outletPartnerId"
                      value={formData.outletPartnerId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Phone Number*
                  </label>
                  <input
                    type="text"
                    name="phNo"
                    value={formData.phNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Latitude*
                    </label>
                    <input
                      type="text"
                      name="lat"
                      value={formData.address.coordinates.lat}
                      onChange={handleCoordinateChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Longitude*
                    </label>
                    <input
                      type="text"
                      name="long"
                      value={formData.address.coordinates.long}
                      onChange={handleCoordinateChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6 mt-4">
                  {/* <label className="block text-gray-700 mb-2 font-medium">Select Location on Map</label> */}
                  <p className="text-blue-600 font-medium mb-2">
                    {locationMessage}
                  </p>
                  <div className="h-64 w-full rounded-lg border overflow-hidden">
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Drag the marker to set the exact location coordinates
                      </p>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Use My Location
                      </button>
                    </div>
                    <MapContainer
                      center={[
                        formData.address.coordinates.lat,
                        formData.address.coordinates.long,
                      ]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker
                        position={[
                          formData.address.coordinates.lat,
                          formData.address.coordinates.long,
                        ]}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e) => {
                            const marker = e.target;
                            const position = marker.getLatLng();
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                coordinates: {
                                  lat: position.lat,
                                  long: position.lng, // Changed from lng to long
                                },
                              },
                            }));
                            setLocationMessage(
                              "Location updated! Please verify the exact position."
                            );
                          },
                        }}
                      />
                      <MapUpdater
                        center={[
                          formData.address.coordinates.lat,
                          formData.address.coordinates.long,
                        ]}
                      />
                    </MapContainer>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Use My Location
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Drag the marker to set the exact location coordinates
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-blue-50 mb-4">
                  <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt /> Full Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Flat No.
                      </label>
                      <input
                        type="text"
                        name="flatNo"
                        value={formData.address.fullAddress.flatNo}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Area</label>
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
                      <label className="block text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.address.fullAddress.zipCode}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Country
                      </label>
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

            {activeTab === "partners" && (
              <div>
                {/* Replace the existing input and button in the partners tab with this */}
                <div className="flex gap-2">
                  <select
                    value={newPartner}
                    onChange={(e) => setNewPartner(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a delivery partner
                    </option>
                    {availableDrivers
                      .filter(
                        (driver) =>
                          !formData.deleveryPartners.includes(driver.id)
                      )
                      .map((driver) => (
                        <option
                          key={driver.id}
                          value={driver.id}
                          className="py-2 px-3 hover:bg-blue-50"
                        >
                          <span className="font-medium">
                            {driver.name || "Unknown"}
                          </span>
                          <span className="text-amber-500 ml-1">
                            ({driver.ratings || 0}★)
                          </span>
                          <span className="text-gray-500 ml-2">
                            - ID: {driver.id}
                          </span>
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={handleAddPartner}
                    disabled={!newPartner}
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
                      {formData.deleveryPartners.map((partnerId, index) => {
                        const partnerDetails =
                          availableDrivers.find(
                            (driver) => driver.id === partnerId
                          ) || {};
                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                          >
                            <span className="font-medium">
                              {partnerDetails.name || "Unknown"} (
                              {partnerDetails.ratings || 0}★) - {partnerId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemovePartner(partnerId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No delivery partners added yet
                    </p>
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
