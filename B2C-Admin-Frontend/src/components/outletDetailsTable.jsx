import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaChevronDown,
  FaChevronUp,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaExternalLinkAlt,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import EditOutletModal from "./EditOutletModal";
import OutletPartnerDetails from "./outletPartnerDetails";

const OutletDetailsTable = () => {
  const [outletData, setOutletData] = useState([]);
  const [editOutlet, setEditOutlet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOutlet, setExpandedOutlet] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalOutlets: 0,
    totalPartners: 0,
  });

  const [availableDrivers, setAvailableDrivers] = useState([]);

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
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    fetchOutlets();
  }, []);

  // In OutletDetailsTable.jsx, modify the fetchOutlets function like this:
  const fetchOutlets = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    if (!forceRefresh && outletData.length > 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://b2c-backend-eik4.onrender.com/api/v1/admin/allOutlet"
      );

      // Process the outlets to ensure deleveryPartners is always an array
      const processedOutlets = response.data.outlets.map((outlet) => {
        // Handle the case where deleveryPartners is a single number or any non-array value
        let partners = outlet.deleveryPartners;
        if (!Array.isArray(partners)) {
          // If it's a number or string, convert it to a single-item array
          partners = partners ? [partners.toString()] : [];
        }

        return {
          ...outlet,
          deleveryPartners: partners,
        };
      });

      setOutletData(processedOutlets);
      setDashboardStats({
        revenue: response.data.revenue || 0,
        totalOrders: response.data.totalOrders || 0,
        totalOutlets: response.data.totalOutlets || 0,
        totalPartners: response.data.totalPartners || 0,
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteOutlet = async (id) => {
    try {
      await axios.delete(
        `https://b2c-backend-eik4.onrender.com/api/v1/admin/outlet/delete/${id}`
      );
      toast.success("Outlet deleted successfully");
      fetchOutlets(true);
    } catch (error) {
      console.error(error);
      toast.error("Cannot delete outlet");
    }
  };

  const refreshOutlets = () => {
    fetchOutlets(true);
  };

  const toggleOutletExpansion = (id) => {
    setExpandedOutlet(expandedOutlet === id ? null : id);
  };

  const openInMaps = (lat, long) => {
    window.open(`https://www.google.com/maps?q=${lat},${long}`, "_blank");
  };

  const formatAddress = (address) => {
    if (!address || !address.fullAddress) return "No address available";
    const { flatNo, area, city, state, zipCode } = address.fullAddress;
    return `${flatNo || ""} ${area || ""}, ${city || ""}, ${state || ""} ${
      zipCode || ""
    }`.trim();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-orange-500 animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-sm">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg p-4 m-4 bg-red-50 border border-red-200 text-red-700">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 m-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                ₹{dashboardStats.revenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaStore className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{dashboardStats.totalOrders}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaStore className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Outlets</p>
              <p className="text-2xl font-bold">
                {dashboardStats.totalOutlets}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaStore className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Delivery Partners</p>
              <p className="text-2xl font-bold">
                {dashboardStats.totalPartners}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaUsers className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Outlets Table */}
      <div className="shadow-lg  bg-white p-4 m-4 ml-4 sm:ml-10 mt-4 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Outlets</h2>
          <button
            onClick={refreshOutlets}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outlet Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {outletData.map((outlet) => (
                <React.Fragment key={outlet.id}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors ${
                      expandedOutlet === outlet.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div
                        className="cursor-pointer font-medium flex items-center gap-2"
                        onClick={() => toggleOutletExpansion(outlet.id)}
                      >
                        {expandedOutlet === outlet.id ? (
                          <FaChevronUp className="text-blue-500" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                        <div>
                          <p className="font-medium text-blue-600">
                            {outlet.name}
                          </p>
                          <p className="text-xs text-gray-500">{outlet.area}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-500" />
                        <span>{outlet.contact}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(outlet.contact);
                            // Optional: Show a tooltip or notification
                            toast.success("Contact copied to clipboard!");
                            // Or you could use a more subtle approach like changing the button text temporarily
                          }}
                          className="p-1 rounded hover:bg-gray-100"
                          title="Copy to clipboard"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                    {outlet.outletPartnerId}
                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          outlet.outletPartnerId
                                        );
                                        // Optional: Show a tooltip or notification
                                        toast.success(
                                          "Partner ID copied to clipboard!"
                                        );
                                        // Or you could use a more subtle approach like changing the button text temporarily
                                      }}
                                      className="p-1 rounded hover:bg-gray-100"
                                      title="Copy to clipboard"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-500"
                                      >
                                        <rect
                                          x="9"
                                          y="9"
                                          width="13"
                                          height="13"
                                          rx="2"
                                          ry="2"
                                        ></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                      </svg>
                                    </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="text-sm text-gray-600 truncate max-w-xs">
                          {formatAddress(outlet.address)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          className="text-blue-500 hover:text-blue-600 p-1"
                          onClick={() => setEditOutlet(outlet)}
                          title="Edit outlet"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600 p-1"
                          onClick={() => handleDeleteOutlet(outlet.id)}
                          title="Delete outlet"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded outlet details */}
                  {expandedOutlet === outlet.id && (
                    <tr>
                      <td colSpan="5" className="bg-blue-50 p-0">
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Outlet Details */}
                            <div className="bg-white rounded-lg shadow p-6">
                              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                                Outlet Details
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">ID</p>
                                  <p className="font-medium">{outlet.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Name</p>
                                  <p className="font-medium">{outlet.name}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-sm text-gray-500">
                                    Partner ID
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                      {outlet.outletPartnerId}
                                    </p>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          outlet.outletPartnerId
                                        );
                                        // Optional: Show a tooltip or notification
                                        toast.success(
                                          "Partner ID copied to clipboard!"
                                        );
                                        // Or you could use a more subtle approach like changing the button text temporarily
                                      }}
                                      className="p-1 rounded hover:bg-gray-100"
                                      title="Copy to clipboard"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-gray-500"
                                      >
                                        <rect
                                          x="9"
                                          y="9"
                                          width="13"
                                          height="13"
                                          rx="2"
                                          ry="2"
                                        ></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium">
                                    {outlet.phNo || outlet.contact}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Area</p>
                                  <p className="font-medium">{outlet.area}</p>
                                </div>
                              </div>
                            </div>

                            {/* Address and Map */}
                            <div className="bg-white rounded-lg shadow p-6">
                              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                                Location
                              </h3>
                              {/* Replace the address section code around line 273-287 */}
                              <div className="mb-4">
                                <div className="flex items-start gap-2">
                                  <FaMapMarkerAlt className="text-red-500 mt-1" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">
                                        {formatAddress(outlet.address)}
                                      </p>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            formatAddress(outlet.address)
                                          );
                                          toast.success(
                                            "Address copied to clipboard"
                                          );
                                        }}
                                        className="text-gray-500 hover:text-blue-600 p-1"
                                        title="Copy Address"
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
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                                      <p>
                                        Lat: {outlet.lat}, Long: {outlet.long}
                                      </p>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            `${outlet.lat}, ${outlet.long}`
                                          );
                                          toast.success(
                                            "Coordinates copied to clipboard"
                                          );
                                        }}
                                        className="text-gray-500 hover:text-blue-600 p-1"
                                        title="Copy Coordinates"
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
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Map Preview */}
                              <div className="mt-4 relative border rounded-lg overflow-hidden h-24 bg-gray-100">
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <button
                                    className="bg-white px-4 py-2 rounded-md shadow-md text-blue-600 hover:bg-blue-50 font-medium flex items-center gap-2"
                                    onClick={() => {
                                      const url = `https://www.openstreetmap.org/?mlat=${outlet.lat}&mlon=${outlet.long}&zoom=15`;
                                      window.open(url, "_blank");
                                    }}
                                  >
                                    <FaExternalLinkAlt size={14} />
                                    Open in OpenStreetMap
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Partners */}
                          <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                              Delivery Partners
                            </h3>
                            {Array.isArray(outlet.deleveryPartners) &&
                            outlet.deleveryPartners.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {outlet.deleveryPartners.map(
                                  (partnerId, idx) => {
                                    // Find the partner details from the drivers array
                                    const partnerDetails =
                                      availableDrivers.find(
                                        (driver) => driver.id === partnerId
                                      );

                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                      >
                                        <div className="p-2 bg-blue-100 rounded-full">
                                          <FaPhone className="text-blue-500" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {partnerDetails
                                              ? partnerDetails.name
                                              : "Unknown"}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            <div className="flex justify-between item bg-center">
                                            {partnerId}
                                            <button
                                              onClick={() => {
                                                navigator.clipboard.writeText(
                                                  partnerId
                                                );
                                                // Optional: Show a tooltip or notification
                                                toast.success(
                                                  "Contact copied to clipboard!"
                                                );
                                                // Or you could use a more subtle approach like changing the button text temporarily
                                              }}
                                              className="p-1 rounded hover:bg-gray-100"
                                              title="Copy to clipboard"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-gray-500"
                                              >
                                                <rect
                                                  x="9"
                                                  y="9"
                                                  width="13"
                                                  height="13"
                                                  rx="2"
                                                  ry="2"
                                                ></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                              </svg>
                                            </button>
                                            </div>
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                No delivery partners assigned
                              </p>
                            )}
                          </div>

                          {/* Outlet Image */}
                          {outlet.img && (
                            <div className="bg-white rounded-lg shadow p-6">
                              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                                Outlet Image
                              </h3>
                              <div className="flex justify-center">
                                <img
                                  src={outlet.img}
                                  alt={outlet.name}
                                  className="rounded-lg max-h-64 object-contain"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => toggleOutletExpansion(outlet.id)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                            >
                              Close
                            </button>
                            {/* <Link
                              to={`/outlet/${outlet.id}`}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                            >
                              View Full Details
                            </Link> */}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {outletData.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No outlets found</p>
          </div>
        )}
      </div>

      {/* Edit Outlet Modal */}
      {editOutlet && (
        <EditOutletModal
          outlet={editOutlet}
          onClose={() => setEditOutlet(null)}
          refreshOutlets={refreshOutlets}
        />
      )}
    </>
  );
};

export default OutletDetailsTable;
