import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useAddOutletMutation, useGetOutletPartnersQuery, useGetDeliveryInsightsQuery } from "../redux/apiSlice";
import "leaflet/dist/leaflet.css";

// Leaflet icon setup remains the same
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

const AddAnOutletForm = ({ handleClose }) => {
  // Use RTK Query hooks
  const { data: outletPartners = [], isLoading: isLoadingPartners } = useGetOutletPartnersQuery();
  const { data: deliveryPartnerData, isLoading: isLoadingDelivery } = useGetDeliveryInsightsQuery();
  const [addOutlet, { isLoading: isSubmitting }] = useAddOutletMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [geocodeTimer, setGeocodeTimer] = useState(null);
  const defaultCenter = [28.6139, 77.209];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [imagePreview, setImagePreview] = useState(null);
  const [lat, setlat] = useState("");
  const [long, setlong] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    outletNumber: "(auto-generated)",
    area: "",
    outletPartner: "",
    phoneNumber: "",
    deliveryPartners: [], // Fixed: Initialize as empty array
    image: null,
    location: {
      fullAddress: {
        flatNo: "",
        area: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      coordinates: {
        lat: null,
        long: null,
      },
    },
  });

  // Get drivers array safely from the API response
  const drivers = deliveryPartnerData?.drivers || [];
  
  // Filter drivers based on search query
  const filteredDeliveryPartners = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMarkerPosition([lat, lng]);
    setMapCenter([lat, lng]);
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          lat: lat,
          long: lng,
        },
      },
    }));
    setlat(lat);
    setlong(lng);
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: {
          lat: lat,
          long: lng,
        },
      },
    }));
    setMapCenter([lat, lng]);
    setlat(lat);
    setlong(lng);
  };

  // Update marker position when coordinates change
  useEffect(() => {
    if (formData.location.coordinates.lat && formData.location.coordinates.long) {
      setMarkerPosition([
        formData.location.coordinates.lat,
        formData.location.coordinates.long,
      ]);
      setMapCenter([
        formData.location.coordinates.lat,
        formData.location.coordinates.long,
      ]);
    }
  }, [formData.location.coordinates]);

  // Geocode the address when it changes
  useEffect(() => {
    if (geocodeTimer) {
      clearTimeout(geocodeTimer);
    }

    const { fullAddress } = formData.location;
    if (fullAddress.area && fullAddress.city) {
      const timer = setTimeout(async () => {
        try {
          setIsLoading(true);
          const address =
            `${fullAddress.flatNo} ${fullAddress.area} ${fullAddress.city} ${fullAddress.state} ${fullAddress.zipCode}`.trim();

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=AIzaSyDyFsKc7zgLnTch-TLea1epPV09EZ920uA`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location data");
          }

          const data = await response.json();

          if (data.status === "OK" && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;

            setFormData((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                coordinates: {
                  lat,
                  long: lng,
                },
              },
            }));

            setlat(lat);
            setlong(lng);
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);

      setGeocodeTimer(timer);
    }
  }, [formData.location.fullAddress]);

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "area"
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : value,
    }));
  };

  const getLocationFromAddress = async () => {
    try {
      setIsLoading(true);
      const { fullAddress } = formData.location;
      const address =
        `${fullAddress.area} ${fullAddress.city} ${fullAddress.zipCode}`.trim();

      if (!address) {
        toast.error("Please fill in address details first");
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyDyFsKc7zgLnTch-TLea1epPV09EZ920uA`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();

      if (data.status === "OK" && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;

        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: {
              lat,
              long: lng,
            },
          },
        }));

        setlat(lat);
        setlong(lng);
        toast.success("Location fetched successfully");
      } else {
        toast.error("Could not find location for this address");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Failed to fetch location data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        fullAddress: {
          ...prev.location.fullAddress,
          [name]: value,
        },
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fixed: Handle delivery partner selection properly
  const handleDeliveryPartnersChange = (partnerId) => {
    setFormData((prev) => {
      const partners = [...prev.deliveryPartners];
      const index = partners.indexOf(partnerId);

      if (index === -1) {
        partners.push(partnerId);
      } else {
        partners.splice(index, 1);
      }

      return {
        ...prev,
        deliveryPartners: partners,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      formData.area,
      formData.outletPartner,
      formData.location.fullAddress.flatNo,
      formData.location.fullAddress.area,
    ];
  
    if (requiredFields.some((field) => !field)) {
      toast.error("All fields are required");
      return;
    }
  
    setErrorMessage("");
    setIsLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Create the form data properly
      formDataToSend.append("id", formData.phoneNumber);
      formDataToSend.append("phNo", formData.phoneNumber);
      formDataToSend.append("name", formData.area);
      formDataToSend.append("location", JSON.stringify(formData.location));
      formDataToSend.append("outletPartnerId", formData.outletPartner);
  
      // THIS IS THE CRITICAL FIX:
      // The backend expects "deleveryPartners" (note the typo) not "deliveryPartners"
      // Also, you need to append each delivery partner ID separately
      formData.deliveryPartners.forEach((partnerId) => {
        formDataToSend.append("deleveryPartners", partnerId);  // Fixed: no array brackets
      });
  
      if (formData.image) {
        formDataToSend.append("img", formData.image);
      }
  
      // Use the RTK Query mutation
      await addOutlet(formDataToSend).unwrap();
      toast.success("Outlet added successfully");
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to add outlet: ${error.message || "Unknown error"}`);
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
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Adding..." : "+ ADD"}
          </button>
        </div>
      </div>

      <form
        className="space-y-4"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          padding: "20px",
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
            {outletPartners && outletPartners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
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

        <div className="mb-6">
          <label className="block text-orange-500 font-medium mb-2">
            DELIVERY PARTNERS
          </label>
          <div className="space-y-2 border border-gray-300 rounded-md p-4">
            {deliveryPartnerData && (
              <div className="mb-2 text-sm text-gray-600">
                Total Drivers: {deliveryPartnerData.totalDrivers} | 
                Total Deliveries: {deliveryPartnerData.totalDeliveries}
              </div>
            )}

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search delivery partners..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
  
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {isLoadingDelivery ? (
                  <div className="text-center py-4">Loading delivery partners...</div>
                ) : filteredDeliveryPartners.length === 0 ? (
                  <div className="text-center py-4">No delivery partners found</div>
                ) : (
                  filteredDeliveryPartners.map((driver) => (
                    <label
                      key={driver.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                      style={{ width: "100%" }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.deliveryPartners.includes(driver.id)}
                        onChange={() => handleDeliveryPartnersChange(driver.id)}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <div
                        className="flex flex-col"
                        style={{ width: "calc(100% - 40px)" }}
                      >
                        <span className="font-medium">{driver.name}</span>
                        <div style={{ maxHeight: "50px", overflowY: "auto" }}>
                          <span className="text-sm text-gray-500">
                            ID: {driver.id} | Ratings: {driver.ratings} |
                            Deliveries: {driver.totalDeliveries} | Region:{" "}
                            {driver.region || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              {formData.deliveryPartners.length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm font-medium">Selected partners: {formData.deliveryPartners.length}</p>
                </div>
              )}
            </div>
          </div>
  
          <div>
            <label className="block text-orange-500 font-medium mb-1">
              LOCATION
            </label>
            <div className="space-y-2">
              <input
                type="text"
                name="zipCode"
                value={formData.location.fullAddress.zipCode}
                onChange={handleAddressChange}
                placeholder="ZIP Code"
                className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
  
              <input
                type="text"
                name="area"
                value={formData.location.fullAddress.area}
                onChange={handleAddressChange}
                placeholder="Area"
                className="w-44 ml-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="city"
                value={formData.location.fullAddress.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="w-32 ml-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
  
              <input
                type="text"
                name="state"
                value={formData.location.fullAddress.state}
                onChange={handleAddressChange}
                placeholder="State"
                className="w-[195px] ml-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
  
              <input
                type="text"
                name="flatNo"
                value={formData.location.fullAddress.flatNo}
                onChange={handleAddressChange}
                placeholder="Flat No"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
  
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={getLocationFromAddress}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Getting Location..."
                    : "Get Location from Address"}
                </button>
              </div>
  
              <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  onClick={handleMapClick}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={markerPosition}
                    draggable={true}
                    eventHandlers={{
                      dragend: handleMarkerDragEnd,
                    }}
                  ></Marker>
                  <MapUpdater center={mapCenter} />
                </MapContainer>
              </div>
  
              {formData.location.coordinates.lat && (
                <div className="text-sm text-gray-600">
                  Location coordinates: {formData.location.coordinates.lat.toFixed(4)}, {formData.location.coordinates.long.toFixed(4)}
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
                