import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import delivery from "../assets/Images/delivery.png";
import partner from "../assets/Images/Partners.png";
import clock from "../assets/Images/Clock.png";
import plus from "../assets/Images/Plus.png";
import naruto from "../assets/Images/Naruto.jpg";
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

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File uploaded:", file);
      // You can implement further logic here to preview the image, send it to the server, etc.
    }
  };

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
        {
          id: 23,
          name: "Might Guy",
          region: "Koramangala",
          rating: 4.6,
          deliveries: 6,
        },
        {
          id: 90,
          name: "Itachi Ucchiha",
          region: "Whitefield",
          rating: 4.6,
          deliveries: 21,
        },
        {
          id: 61,
          name: "Sarada Uchhiha",
          region: "HSR Layout",
          rating: 4.6,
          deliveries: 12,
        },
        {
          id: 32,
          name: "Boruto uzumaki",
          region: "Electronic City",
          rating: 4.9,
          deliveries: 20,
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
        {
          id: "#53200016",
          details: "6 Pcs Egg Tray",
          price: "Rs 99",
          time: "On-Time",
        },
        {
          id: "#53200016",
          details: "6 Pcs Egg Tray",
          price: "Rs 99",
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
      {/* <div>
        <Leftsidebar />
      </div> */}
      <div className=" w-full ">
        <div className="flex flex-col p-4 space-y-6 ">
          {/* Delivery Header Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center ml-[10px]">
              Delivery
            </h1>
          </div>

          {/* Overview Section */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 md:px-6">
            <div className="bg-white shadow-lg h-36 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
              <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg flex justify-between items-center w-full h-full">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                    Total Deliveries
                  </h2>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                    {deliveryOverview.totalDeliveries || 0}
                  </p>
                </div>
                <img src={delivery} className="w-9 h-9 lg:w-12 lg:h-12" />
              </div>
            </div>

            <div className="bg-white shadow-lg h-36 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
              <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg flex justify-between  items-center w-full h-full">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                    Delivery Partners
                  </h2>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                    {deliveryOverview.deliveryPartners || 0}
                  </p>
                </div>
                <img src={partner} className="w-9 h-9 lg:w-12 lg:h-12" />
              </div>
            </div>

            <div className="bg-white shadow-lg h-36 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
              <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg  flex justify-between  items-center w-full h-full">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                    Average Delivery Time
                  </h2>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                    {deliveryOverview.avgDeliveryTime || "N/A"}
                  </p>
                </div>
                <img src={clock} className="w-9 h-9 lg:w-12 lg:h-12" />
              </div>
            </div>
          </div>

          {/* Delivery Partners Table */}
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-6 min-w-screen md:px-6">
            {/* Table Section */}
            <div className="w-full md:w-2/3 bg-white shadow-md rounded-lg p-4 mb-4 md:mb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-col   space-y-4  items-center ">
                  <div className="flex space-x-2 md:space-x-4">
                    <h2 className="text-base md:text-lg font-semibold text-gray-700">
                      Delivery Partners
                    </h2>
                    <button onClick={handleAddPartnerClick}>
                      <img
                        src={plus}
                        className="h-5 w-5 mr-32 md:h-6 md:w-6 hover:scale-110 cursor-pointer"
                      />
                    </button>
                  </div>
                  {/* Region Dropdown */}
                  <div>
                    <label
                      className="text-gray-700 mr-1 md:mr-2 text-sm md:text-base"
                      htmlFor="region-select"
                    >
                      Select Region:
                    </label>
                    <select
                      id="region-select"
                      className="border rounded p-1 md:p-2 text-xs md:text-sm"
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
              </div>
              <div className="max-h-52 overflow-y-auto custom-scrollbar">
                {/* Set max height for scroll */}
                <table className="w-full text-xs md:text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 z-10">
                    {/* Keep header fixed */}
                    <tr className="text-left">
                      <th className="px-2 md:px-4 py-1 md:py-2">Id</th>
                      <th className="px-2 md:px-4 py-1 md:py-2">Name</th>
                      <th className="px-2 md:px-4 py-1 md:py-2">Region</th>
                      <th className="px-2 md:px-4 py-1 md:py-2">Rating</th>
                      <th className="px-2 md:px-4 py-1 md:py-2">Deliveries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPartners.map((partner, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 border-b cursor-pointer "
                        onClick={() => handlePartnerClick(partner)}
                      >
                        <td className="px-2 md:px-4 py-1 md:py-2">
                          {partner.id}
                        </td>
                        <td className="px-2 md:px-4 py-1 md:py-2">
                          {partner.name}
                        </td>
                        <td className="px-2 py-1 md:px-4 md:py-2">
                          {partner.region}
                        </td>
                        <td className="px-2 py-1 md:px-4 md:py-2">
                          {partner.rating}
                        </td>
                        <td className="px-2 py-1 md:px-4 md:py-2">
                          {partner.deliveries}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Map Section */}
            <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-4 z-0">
              <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
                Location Map
              </h2>
              <div className="h-48 md:h-[270px]">
                <MapContainer
                  center={[12.9141, 77.6411]} // Centered around HSR Layout
                  zoom={12}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%", zIndex: 1 }}
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

            {/* Modal Section */}
            {showAddPartnerForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-xs md:max-w-md relative">
                  <h3 className="text-lg font-semibold mb-4">
                    Add New Delivery Partner
                  </h3>

                  {/* Form */}
                  <form className="space-y-4">
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

                    <div className="flex space-x-2 md:space-x-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="border border-gray-300 rounded w-full p-1 md:p-2"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="border border-gray-300 rounded w-full p-1 md:p-2"
                      />
                    </div>

                    <div className="flex space-x-2 md:space-x-4">
                      <input
                        type="text"
                        placeholder="Driver License"
                        className="border border-gray-300 rounded w-full p-1 md:p-2"
                      />
                      <input
                        type="text"
                        placeholder="Unique Password"
                        className="border border-gray-300 rounded w-full p-1 md:p-2"
                        value="DP_85"
                        readOnly
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="border border-gray-300 rounded w-full p-1 md:p-2"
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
          </div>

          {/* Delivery Partner Overview */}
          {selectedPartner && (
            <div className="flex-row md:flex md:space-x-4 justify-center md:px-6">
              <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={naruto}
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
                <div className="max-h-52 overflow-y-scroll custom-scrollbar">
                  {" "}
                  {/* Set max height for scroll */}
                  <table className="w-full text-left text-xs md:text-sm text-gray-600">
                    <thead className="bg-gray-100 text-gray-800 sticky top-0 z-10">
                      {/* Keep header fixed */}
                      <tr>
                        <th className="px-2 md:px-4 py-1 md:py-2">
                          Delivery Id
                        </th>
                        <th className="px-2 md:px-4 py-1 md:py-2">Details</th>
                        <th className="px-2 md:px-4 py-1 md:py-2">Price</th>
                        <th className="px-2 md:px-4 py-1 md:py-2">
                          Delivery Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryList.map((delivery, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-b">
                          <td className="px-2 md:px-4 py-1 md:py-2">
                            {delivery.id}
                          </td>
                          <td className="px-2 md:px-4 py-1 md:py-2">
                            {delivery.details}
                          </td>
                          <td className="px-2 md:px-4 py-1 md:py-2">
                            {delivery.price}
                          </td>
                          <td className="px-2 md:px-4 py-1 md:py-2">
                            {delivery.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryInsights;
