
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditPartnerModal from "./EditPartnerModal";
import EditOutletModal from "./EditOutletModal";
import { Link } from "react-router-dom"; // Import Link

const OutletPartnerDetails = () => {
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [editPartner, setEditPartner] = useState(null);
  const [editOutlet, setEditOutlet] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    img: null, // Image upload
  });
  // const [outletData, setOutletData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch outlet partners on mount
  useEffect(() => {
    // fetchOutlets();
    fetchPartners();
  }, []);

 
  const fetchPartners = async () => {
    try {
      const response = await axios.get(
        "https://b2c-backend-eik4.onrender.com/api/v1/admin/getoutletpartners"
      );
      setPartners(response.data);
    } catch (error) {
      console.log(error);
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Refresh outlets from Redux
  const refreshOutlets = () => {
    fetchOutlets(true);
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
      <div className="shadow-md rounded-lg p-4 m-4 ml-4 sm:ml-10 mt-4 border-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Outlet Partners
        </h2>
        {partners.length === 0 ? (
          <h1 className="text-green-600">No outlet partner found</h1>
        ) : (
          <div className="overflow-x-auto overflow-y-auto h-72">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 border-2 border-orange-100 border-b-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Profile</th>
                  <th className="px-4 py-2 text-left text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left text-gray-600">Phone</th>
                  <th className="px-4 py-2 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-t hover:bg-gray-100">
                    <td className="px-4 py-2">
                      <img
                        src={partner.data.img}
                        alt={partner.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {partner.data.firstName} {partner.data.lastName}
                    </td>
                    <td className="px-4 py-2">{partner.data.phone}</td>
                    <td className="px-4 py-2 flex space-x-4">
                      <button className="text-blue-500 hover:text-blue-600" onClick={() => setEditPartner(partner)}>
                        <FaEdit />
                      </button>
                      <button className="text-red-500 hover:text-red-600" onClick={() => handleOutletPartner(partner.id)}>
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