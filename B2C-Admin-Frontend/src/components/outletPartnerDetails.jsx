import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOutletDetails } from '../redux/outletDetails';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OutletPartnerDetails = () => {
  const dispatch = useDispatch();
  const { outletData } = useSelector((state) => state.outletDetails);

  const navigate  = useNavigate()

  const handleDeleteOutlet=async(id)=>{
    try {
      const res = await axios.delete(`https://b2c-backend-1.onrender.com/api/v1/admin/outlet/delete/${id}`)
      toast.success("outlet deleted succesfully")
      navigate('/dashboard')
    } catch (error) {
      console.log(error);
      toast.error("Cannot delete delivery partner")
    }
  }
  return (
    <>
      <div className="shadow-md rounded-lg p-4 m-4 ml-4 sm:ml-10 mt-4 border-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          All Outlets
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto ">
            <thead className="bg-gray-100 border-2 border-orange-100 border-b-gray-300">
              <tr>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-gray-600 text-sm sm:text-base">
                  Outlet Name
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-gray-600 text-sm sm:text-base">
                  Contact
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-gray-600 text-sm sm:text-base">
                  Area
                </th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-gray-600 text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {outletData.map((outlet, index) => (
                <tr key={index} className="border-t hover:bg-gray-100 rounded-md">
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base">
                    {outlet.name}
                  </td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base">
                    {outlet.contact}
                  </td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-sm sm:text-base">
                    {outlet.area}
                  </td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 flex space-x-4 text-sm sm:text-base">
                    <button className="text-blue-500 hover:text-blue-600">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-600" onClick={(e)=>handleDeleteOutlet(outlet.id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OutletPartnerDetails;
