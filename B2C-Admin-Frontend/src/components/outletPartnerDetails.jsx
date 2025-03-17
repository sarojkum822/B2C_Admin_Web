import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditPartnerModal from "./EditPartnerModal";
import EditOutletModal from "./EditOutletModal";
import { Link } from "react-router-dom";

const OutletPartnerDetails = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [partners, setPartners] = useState([]);
  const [editPartner, setEditPartner] = useState(null);
  const [editOutlet, setEditOutlet] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    img: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch outlet partners on mount
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://b2c-backend-eik4.onrender.com/api/v1/admin/getoutletpartners"
      );
      setPartners(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch outlet partners");
      setLoading(false);
    }
  };

  // Handle delete outlet partner
  const handleOutletPartner = async (id) => {
    try {
      await axios.delete(
        `https://b2c-backend-eik4.onrender.com/api/v1/admin/removeOutletPartner/${id}`
      );
      toast.success("Outlet partner deleted successfully");
      setPartners((prev) => prev.filter((partner) => partner.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Cannot delete outlet partner");
    }
  };

  // Handle input changes (not used in this context, but kept for potential future use)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter partners by ID
  const filteredPartners = partners.filter((partner) =>
    partner.id.toLowerCase().includes(filterText.toLowerCase())
  );

  // Refresh outlets from Redux (stub function, implement if needed)
  const refreshOutlets = () => {
    // fetchOutlets(true); // Uncomment and implement if needed
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* Outlet Partners Table */}
      <div className="shadow-lg  bg-white p-4 m-4 ml-4 sm:ml-10 mt-4 ">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Outlet Partners
        </h2>
        {/* Search/Filter input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by ID..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            {filterText && (
              <button
                onClick={() => setFilterText("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        {filteredPartners.length === 0 ? (
          <h1 className="text-green-600">No outlet partner found</h1>
        ) : (
          <div className="overflow-x-auto overflow-y-auto h-72">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 border-2 border-orange-100 border-b-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Profile</th>
                  <th className="px-4 py-2 text-left text-gray-600">ID</th> {/* Added ID column */}
                  <th className="px-4 py-2 text-left text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left text-gray-600">Phone</th>
                  <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-2">
                      <img
                        src={partner.data.img}
                        alt={`${partner.data.firstName} ${partner.data.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-2">{partner.id}</td> {/* Display ID */}
                    <td className="px-4 py-2">
                      {partner.data.firstName} {partner.data.lastName}
                    </td>
                    <td className="px-4 py-2">{partner.data.phone}</td>
                    <td className="px-4 py-2 flex space-x-4">
                      <button
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => setEditPartner(partner)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleOutletPartner(partner.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Partner Modal */}
      {editPartner && (
        <EditPartnerModal
          partner={editPartner}
          onClose={() => setEditPartner(null)}
          refreshPartners={fetchPartners}
        />
      )}
    </>
  );
};

export default OutletPartnerDetails;