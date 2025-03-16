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
import { toast } from "react-toastify";
import axios from 'axios'

import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
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

const DeliveryInsights = () => {
  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);

  const [deliveries, setDeliveries] = useState([]);
  const [partners, setPartners] = useState([]);
  const [deliveryOverview, setDeliveryOverview] = useState({});
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [deliveryList, setDeliveryList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [phone,setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName,setFirstName] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [data, setData] = useState([]);
  const [TotalDeliveries, setTotalDeliveries] = useState("");
  const [totalDrivers, settotalDrivers] = useState("");
  const [partnerDetails, setpartnerDetails] = useState([]);
  const [error,setError] = useState(true);
  const [image, setImage] = useState(null)

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddPartnerClick = () => {
    setShowAddPartnerForm(true);
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
  
    // Create FormData object
    const formData = new FormData();
  
    // Append other data
    formData.append("phone", phone);
    formData.append("firstName", firstName);
    formData.append("password", password);
  
    // Append image only if it's uploaded
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const response = await axios.post(
        "https://b2c-backend-eik4.onrender.com/api/v1/admin/makedeliverypartner",
        formData
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );
  
      // Show success message
      toast.success("Delivery partner added successfully!");
      setRefreshTrigger((prev) => prev + 1);
      setShowAddPartnerForm(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while adding the delivery partner.";
      toast.error(errorMessage);
      console.error("Error:", error);
    }
  };
  

  
 
  const fetchDeliveryPartners = async () => {
    setLoading(true); // Show a loading state while fetching
    setError(null); // Reset any previous error
    try {
      const response = await fetch(
        "https://b2c-backend-eik4.onrender.com/api/v1/admin/deliveryInsights"
      );
  
      if (!response.ok) {
        // Check if response is not successful
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const partnerDetails = await response.json();
      console.log("partnerDetails", partnerDetails);
      console.log("TotalDeliveries", partnerDetails.totalDeliveries);
      console.log("totalDrivers", partnerDetails.totalDrivers);
  
      settotalDrivers(partnerDetails.totalDrivers);
      setTotalDeliveries(partnerDetails.totalDeliveries);
      setData(partnerDetails.drivers);
    } catch (error) {
      console.error("API error:", error);
      setError("Failed to fetch delivery partners. Please try again later.");
    } finally {
      setLoading(false); // End loading state
    }
  };
  const handleCloseForm = ()=>{
    setShowAddPartnerForm(false)
  }
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File uploaded:", file);
      setImage(file);
      // You can implement further logic here to preview the image, send it to the server, etc.
    }
  };


  // Filter partners based on selected region
  const filteredPartners =
    selectedRegion === "All"
      ? partners
      : partners.filter((partner) => partner.region === selectedRegion);

  // Handle partner selection
  const handlePartnerClick = (partner) => {
    setSelectedPartner(partner);
  };

  useEffect(()=>{
  })
  const handleApprovePartner = async (id) => {
    try {
      const response = await axios.patch(
        `https://b2c-backend-eik4.onrender.com/api/v1/admin/approveDelivery/${id}`
      );
        toast.success("Delivery partner approved successfully!");
        console.log("Success:", response.data);
        fetchDeliveryPartners()
    } catch (error) {
      toast.error("An error occurred while approving the delivery partner.");
      console.error("Error:", error);
    }
  };

 

 
  
  useEffect(() => {
    fetchDeliveryPartners();
  }, [refreshTrigger]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const handleDeleteDeleveryPartner=async(id)=>{
    try {
      const res = await axios.delete(`https://b2c-backend-eik4.onrender.com/api/v1/admin/deliverypartner/delete/${id}`)
      console.log(res);
      navigate('/delivery-insights')
      toast.success("delivery Partner deleted")
    } catch (error) {
      console.log(error);
      toast.error("Cannot delete delivery partner")
    }
  }

  return (
    <div className="flex min-h-screen min-w-screen  lg:pl-3  round">
      {/* <div>
          <Leftsidebar />
        </div> */}
      <div className=" w-full ">
        <div className="flex flex-col p-4 space-y-6 ">
          {/* Delivery Header Section */}
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl font-bold text-gray-700 flex items-center ml-[10px]">
              Delivery Partner
            </h1>
          </div>

          {/* Overview Section */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 md:px-6">
            <div className="bg-white shadow-lg h-28 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
              <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg flex justify-between items-center w-full h-full">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                    Total Deliveries
                  </h2>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                    {TotalDeliveries || 0}
                  </p>
                </div>
                <img src={delivery} className="w-9 h-9 lg:w-12 lg:h-12" />
              </div>
            </div>
            <div className="bg-white shadow-lg h-28 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
              <div className="bg-white shadow-md p-3 lg:p-6 rounded-lg flex justify-between items-center w-full h-full">
                <div>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-700">
                    Delivery Partners
                  </h2>
                  <p className="text-xl lg:text-3xl font-bold text-gray-900 mt-2">
                    {totalDrivers || 0}
                  </p>
                </div>
                <img src={partner} className="w-9 h-9 lg:w-12 lg:h-12" />
              </div>
            </div>
            <div className="bg-white shadow-lg h-28 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
              <div className="bg-white shadow-md p-4 lg:p-6 rounded-lg flex justify-between items-center w-full h-full">
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
          <div className="flex flex-col md:flex-row w-full justify-center items-center md:space-x-6 min-w-screen md:px-6 ">
            {/* Table Section */}
            <div className="w-full bg-white shadow-md rounded-lg p-4 mb-4 md:mb-0 border-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-col space-y-4 items-center">
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
              <div className="max-h-85 overflow-y-auto custom-scrollbar shadow-lg rounded-lg border border-gray-200">
                {/* Set max height for scroll */}
                <table className="w-full text-xs md:text-sm text-gray-600">
                  <thead className="bg-gray-100 text-gray-800 sticky top-0 z-10 shadow-md">
                    <tr className="text-left">
                      <th className="px-4 py-2 font-semibold">Id</th>
                      <th className="px-4 py-2 font-semibold">Name</th>
                      <th className="px-4 py-2 font-semibold">Region</th>
                      <th className="px-4 py-2 font-semibold">Rating</th>
                      <th className="px-4 py-2 font-semibold">Deliveries</th>
                      <th className="px-4 py-2 font-semibold">
                        Verification Status
                      </th>
                      <th className="px-4 py-2 font-semibold">Actions</th>
                      <th className="px-4 py-2 font-semibold">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((driver) => {
                      const approvalStatus = Object.keys(driver.approved).every(
                        (key) => driver.approved[key] === true
                      )
                        ? "Approved"
                        : "Pending";
                      return (
                        <tr
                          key={driver.id}
                          onClick={() =>
                            navigate(`/delivery-partner/${driver.id}`)
                          }
                          className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
                        >
                          <td className="px-4 py-3">{driver.id}</td>
                          <td className="px-4 py-3">{driver.name}</td>
                          <td className="px-4 py-3">{driver.region}</td>
                          <td className="px-4 py-3">{driver.ratings}</td>
                          <td className="px-4 py-3">
                            {driver.totalDeliveries}
                          </td>
                          <td className="px-4 py-3">{approvalStatus}</td>
                          {/* New Approval Action Column */}
                          <td className="px-4 py-3">
                            {approvalStatus === "Pending" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents the click from triggering row navigation
                                  handleApprovePartner(driver.id);
                                }}
                                className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                              >
                                Approve
                              </button>
                            ) : (
                              <span className="text-green-600 font-semibold">
                                ✓ Verified
                              </span>
                            )}
                          </td>
                          <td>
                            <button className="w-full flex justify-center " onClick={(e)=>handleDeleteDeleveryPartner(driver.id)}>
                              <FaTrashAlt color="red" size={15} />
                            </button >
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Map Section */}
            {/* <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-4 z-0">
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
              </div> */}

            {/* <div className="status border-2 rounded-md shadow-md w-[27rem] h-[21rem]">
                  <div className="">
                  <h1 className="text-[1.2rem] m-2 border-b-2 font-medium">Verification Status</h1>
                  </div>


              </div> */}

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
                        value={firstName}
                        onChange={(e)=>setFirstName(e.target.value)}
                        type="text"
                        placeholder="First Name"
                        className="border border-gray-300 rounded w-full p-1 md:p-2"
                      />
                    </div>

                    <input
                      value={phone}
                      onChange={(e)=>setPhone(e.target.value)}
                      type="text"
                      placeholder="Phone Number"
                      className="border border-gray-300 rounded w-full p-1 md:p-2"
                    />

                    <input
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                      type="text"
                      placeholder="Password"
                      className="border border-gray-300 rounded w-full p-1 md:p-2"
                    />

                    <button onClick={handleAddPartner}
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