import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Leftsidebar from "./Leftsidebar";

// Setting up the custom marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customIcon = new L.Icon({
  iconUrl: "/src/assets/Images/marker-icon.png", // Path to your marker image
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Sample coordinates for outlets in Bengaluru
const outlets = [
  {
    id: 1,
    name: "Outlet 1 - HSR Layout",
    position: [12.9141, 77.6411],
    description: "Located in the heart of HSR Layout.",
  },
  {
    id: 2,
    name: "Outlet 2 - Electronic City",
    position: [12.8252, 77.6833],
    description: "Serving the Electronic City area.",
  },
  {
    id: 3,
    name: "Outlet 3 - Whitefield",
    position: [12.9675, 77.75],
    description: "Located near Whitefield IT Park.",
  },
  {
    id: 4,
    name: "Outlet 4 - Koramangala",
    position: [12.9352, 77.6245],
    description: "Central Koramangala outlet.",
  },
  // Add more outlets as needed
];

const DeliveryInsights = () => {
  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);

  const handleAddPartnerClick = () => {
    setShowAddPartnerForm(true);
  };

  const handleCloseForm = () => {
    setShowAddPartnerForm(false);
  };
  const [deliveries, setDeliveries] = useState([]);
  const [partners, setPartners] = useState([]);
  const [deliveryOverview, setDeliveryOverview] = useState({});
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [deliveryList, setDeliveryList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    const fetchDeliveryOverview = async () => {
      const data = {
        totalDeliveries: 1835,
        deliveryPartners: 96,
        avgDeliveryTime: "43.5 mins",
      };
      setDeliveryOverview(data);
    };

    const fetchDeliveryPartners = async () => {
      const data = [
        {
          id: 21,
          name: "Naruto Uzumaki",
          region: "Electronic City",
          rating: 4.5,
          deliveries: 52,
        },
        {
          id: 16,
          name: "Sakura Haruno",
          region: "HSR Layout",
          rating: 4.8,
          deliveries: 21,
        },
        {
          id: 9,
          name: "Sasuke Uchiha",
          region: "Whitefield",
          rating: 4.2,
          deliveries: 9,
        },
        {
          id: 32,
          name: "Kakashi Hatake",
          region: "Koramangala",
          rating: 4.6,
          deliveries: 12,
        },
      ];
      setPartners(data);
    };

    const fetchDeliveryList = async () => {
      const data = [
        {
          id: "#53200002",
          details: "12 Pc Egg Tray, 6 Pcs Egg Tray",
          price: "Rs 209",
          time: "On-Time",
        },
        {
          id: "#53200005",
          details: "30 Pc Egg Tray",
          price: "Rs 315",
          time: "Late",
        },
        {
          id: "#53200345",
          details: "12 Pc Egg Tray, 30 Pcs Egg Tray",
          price: "Rs 420",
          time: "On-Time",
        },
        {
          id: "#53200016",
          details: "6 Pcs Egg Tray",
          price: "Rs 99",
          time: "On-Time",
        },
      ];
      setDeliveryList(data);
    };

    fetchDeliveryOverview();
    fetchDeliveryPartners();
    fetchDeliveryList();
  }, []);

  // Filter partners based on selected region
  const filteredPartners =
    selectedRegion === "All"
      ? partners
      : partners.filter((partner) => partner.region === selectedRegion);

  // Handle partner selection
  const handlePartnerClick = (partner) => {
    setSelectedPartner(partner);
  };

  return (
    <div className="flex min-h-screen min-w-screen  lg:pl-3  round">
      <div>
        <Leftsidebar />
      </div>
      <div className="bg-gray-200 w-full ">
        <div className="flex flex-col p-4 space-y-6 ">
          {/* Delivery Header Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center ml-[10px]">
              Delivery
            </h1>
          </div>

          {/* Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4">
            <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg flex justify-between items-center">
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                  Total Deliveries
                </h2>
                <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                  {deliveryOverview.totalDeliveries || 0}
                </p>
              </div>
              <img
                src="/src/assets/Images/delivery.png"
                className="w-9 h-9 lg:w-12 lg:h-12"
              />
            </div>
            <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg flex justify-between  items-center">
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                  Delivery Partners
                </h2>
                <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                  {deliveryOverview.deliveryPartners || 0}
                </p>
              </div>
              <img
                src="/src/assets/Images/Partners.png"
                className="w-9 h-9 lg:w-12 lg:h-12"
              />
            </div>
            <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg  flex justify-between  items-center">
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                  Average Delivery Time
                </h2>
                <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                  {deliveryOverview.avgDeliveryTime || "N/A"}
                </p>
              </div>
              <img
                src="/src/assets/Images/Clock.png"
                className="w-9 h-9 lg:w-12 lg:h-12"
              />
            </div>
          </div>

          {/* Delivery Partners Table */}
          <div className="md:flex flex-row justify-center items-center ">
            <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-9">
              <div className="flex items-center justify-between ">
                <div className="flex space-x-1 md:space-x-4 ">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Delivery Partners
                  </h2>
                  <button className="md:mb-4 " onClick={handleAddPartnerClick}>
                    <img
                      src="/src//assets//Images//Plus.png"
                      className="h-6 w-9 md:w-6 hover:scale-110 cursor-pointer"
                    />
                  </button>
                </div>
                {/* Region Dropdown */}
                <div className="mb-4 ml-12 md:ml-0">
                  <label className="text-gray-700 mr-2" htmlFor="region-select">
                    Select Region:
                  </label>
                  <select
                    id="region-select"
                    className="border rounded p-2"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Electronic City">Electronic City</option>
                    <option value="HSR Layout">HSR Layout</option>
                    <option value="Whitefield">Whitefield</option>
                    <option value="Koramangala">Koramangala</option>
                  </select>
                </div>
              </div>
              <table className="w-full  text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-4 py-2">Id</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Region</th>
                    <th className="px-4 py-2">Rating</th>
                    <th className="px-4 py-2">Total Deliveries</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((partner, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 border-b cursor-pointer"
                      onClick={() => handlePartnerClick(partner)}
                    >
                      <td className="px-4 py-2">{partner.id}</td>
                      <td className="px-4 py-2">{partner.name}</td>
                      <td className="px-4 py-2">{partner.region}</td>
                      <td className="px-4 py-2">{partner.rating}</td>
                      <td className="px-4 py-2">{partner.deliveries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal section */}
            {showAddPartnerForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <h3 className="text-xl font-semibold mb-4">
                    Add New Delivery Partner
                  </h3>

                  {/* Form */}
                  <form className="space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                        📷
                      </div>
                      <button className="ml-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        Upload Photo
                      </button>
                    </div>

                    <div className="flex space-x-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="border border-gray-300 rounded w-full p-2"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="border border-gray-300 rounded w-full p-2"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <input
                        type="text"
                        placeholder="Driver License"
                        className="border border-gray-300 rounded w-full p-2"
                      />
                      <input
                        type="text"
                        placeholder="Unique Password"
                        className="border border-gray-300 rounded w-full p-2"
                        value="DP_85"
                        readOnly
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="border border-gray-300 rounded w-full p-2"
                    />

                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-4 py-2 rounded w-full hover:bg-orange-600"
                    >
                      Save Delivery Partner
                    </button>
                  </form>

                  <button
                    className="mt-4 text-red-500 hover:underline"
                    onClick={handleCloseForm}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Map Section using Leaflet */}
            <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6 mt-3 md:mt-0 md:ml-3">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Location Map
              </h2>
              <div className="h-56">
                <MapContainer
                  center={[12.9141, 77.6411]} // Centered around HSR Layout
                  zoom={12}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {outlets.map((outlet) => (
                    <Marker key={outlet.id} position={outlet.position}>
                      <Popup>
                        <strong>{outlet.name}</strong>
                        <br />
                        {outlet.description}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Delivery Partner Overview */}
          {selectedPartner && (
            <div className="flex-row md:flex md:space-x-4 justify-center">
              <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src="/src/assets/Images/Naruto.jpg"
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {selectedPartner.name}
                    </h3>
                    <p className="text-sm text-gray-500">naruto@ninja.com</p>
                  </div>
                </div>
                <div className="mt-4 text-base">
                  <p className="text-gray-700">
                    <strong>Partner Id:</strong> {selectedPartner.id}
                  </p>
                  <p className="text-gray-700">
                    <strong>Deliveries:</strong> {selectedPartner.deliveries}
                  </p>
                  <p className="text-gray-700">
                    <strong>Region:</strong> {selectedPartner.region}
                  </p>

                  <p className="text-gray-700">
                    <strong>Rating:</strong> {selectedPartner.rating}
                  </p>
                </div>
              </div>

              {/* Delivery List */}
              <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-6 md:mt-0 mt-3">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Deliveries
                </h2>
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-800">
                    <tr>
                      <th className="px-4 py-2">Delivery Id</th>
                      <th className="px-4 py-2">Details</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryList.map((delivery, index) => (
                      <tr key={index} className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-2">{delivery.id}</td>
                        <td className="px-4 py-2">{delivery.details}</td>
                        <td className="px-4 py-2">{delivery.price}</td>
                        <td className="px-4 py-2">{delivery.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryInsights;
