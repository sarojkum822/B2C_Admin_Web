import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryPartnerDetails } from '../redux/deliveryPartnerDetailsSlice';
import delivery from "../assets/Images/delivery.png";
import clock from "../assets/Images/Clock.png";
import partner from "../assets/Images/Partners.png";

const DeliveryPartnerDetails = () => {
    const { partnerId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { partnerData, loading, error } = useSelector((state) => state.deliveryPartnerDetails);
    const [modalImage, setModalImage] = useState(null);

    const handleBackClick = () => {
        navigate('/delivery-insights');
    };

    useEffect(() => {
        dispatch(fetchDeliveryPartnerDetails(partnerId));
    }, [dispatch, partnerId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!partnerData) {
        return <div className="flex justify-center items-center h-screen">No partner data found</div>;
    }

    
  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6 ml-4 ">
        <button 
          onClick={handleBackClick}
          className="flex items-center hover:scale-110 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>

          Back to Delivery Insights
          
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center border-2 m-2">
          <div className="mr-4">
            <img src={delivery} alt="Deliveries" className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Deliveries</h3>
            <p className="text-2xl font-bold text-gray-900">
              {partnerData.totalOrders?.count || 0}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center  border-2 m-2">
          <div className="mr-4">
            <img src={partner} alt="Partner" className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Wallet Balance</h3>
            <p className="text-2xl font-bold text-gray-900">
              ₹{partnerData.wallet || 0}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center  border-2 m-2">
          <div className="mr-4">
            <img src={clock} alt="Ratings" className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Ratings</h3>
            <p className="text-2xl font-bold text-gray-900">
              {partnerData.ratings || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {/* Personal Details */}
        <div className="bg-white shadow-lg rounded-lg p-6  border-2 m-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Details</h2>
          <div className="space-y-3">
            <div className="flex justify-center mb-4">
              <img 
                src={partnerData.generalDetails?.image || 'https://via.placeholder.com/150'}
                alt="Partner Profile" 
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <p><strong>Name:</strong> {partnerData.generalDetails?.firstName} {partnerData.generalDetails?.lastName}</p>
            <p><strong>Phone:</strong> {partnerData.generalDetails?.phone}</p>
            <p><strong>Email:</strong> {partnerData.password}</p>
            <p><strong>Blood Group:</strong> {partnerData.generalDetails?.bloodGroup}</p>
            <p><strong>Date of Birth:</strong> {new Date(partnerData.generalDetails?.dob?._seconds * 1000).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white shadow-lg rounded-lg p-6  border-2 m-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4 ">Address Details</h2>
          <div className="space-y-3">
            <p><strong>Address:</strong> {partnerData.generalDetails?.address?.fullAddress?.addressLine1}, {partnerData.generalDetails?.address?.fullAddress?.addressLine2}</p>
            <p><strong>Area:</strong> {partnerData.generalDetails?.address?.fullAddress?.area}</p>
            <p><strong>City:</strong> {partnerData.generalDetails?.address?.fullAddress?.city}</p>
            <p><strong>State:</strong> {partnerData.generalDetails?.address?.fullAddress?.state}</p>
            <p><strong>Country:</strong> {partnerData.generalDetails?.address?.fullAddress?.country}</p>
            <p><strong>Zip Code:</strong> {partnerData.generalDetails?.address?.fullAddress?.zipCode}</p>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white shadow-lg rounded-lg p-6  border-2 m-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bank Details</h2>
          <div className="space-y-3">
            <p><strong>Bank Name:</strong> {partnerData.bankDetails?.bankName}</p>
            <p><strong>Account Number:</strong> {partnerData.bankDetails?.accNo}</p>
            <p><strong>Account Holder Name:</strong> {partnerData.bankDetails?.accHolderName}</p>
            <p><strong>Branch Name:</strong> {partnerData.bankDetails?.branchName}</p>
            <p><strong>IFSC Code:</strong> {partnerData.bankDetails?.ifscCode}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white shadow-lg rounded-lg p-6  border-2 m-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Documents</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Aadhar Card</h3>
              <div className="flex space-x-2">
                <img
                  src={partnerData.personalDocs?.aadharDoc?.frontImage}
                  alt="Aadhar Front"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setModalImage(partnerData.personalDocs?.aadharDoc?.frontImage)}
                />
                <img
                  src={partnerData.personalDocs?.aadharDoc?.backImage}
                  alt="Aadhar Back"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setModalImage(partnerData.personalDocs?.aadharDoc?.backImage)}
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PAN Card</h3>
              <div className="flex space-x-2">
                <img
                  src={partnerData.personalDocs?.panDoc?.frontImage}
                  alt="PAN Front"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setModalImage(partnerData.personalDocs?.panDoc?.frontImage)}
                />
                <img
                  src={partnerData.personalDocs?.panDoc?.backImage}
                  alt="PAN Back"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setModalImage(partnerData.personalDocs?.panDoc?.backImage)}
                />
              </div>
            </div>
            <div className="col-span-2">
              <h3 className="font-semibold mb-2">Driving License</h3>
              <div className="flex space-x-2">
                <img
                  src={partnerData.personalDocs?.DLDoc?.frontImage}
                  alt="DL Front"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setModalImage(partnerData.personalDocs?.DLDoc?.frontImage)}
                />
                <img
                  src={partnerData.personalDocs?.DLDoc?.backImage}
                  alt="DL Back"
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => setModalImage(partnerData.personalDocs?.DLDoc?.backImage)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6  border-2 m-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order History</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Order Status</th>
              <th className="p-2 text-left">Accepted by Rider</th>
              <th className="p-2 text-left">Products Collected</th>
            </tr>
          </thead>
          <tbody>
            {partnerData.totalOrders?.orders?.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.deliveredOrder}</td>
                <td className="p-2">{order.orderAcceptedByRider ? 'Yes' : 'No'}</td>
                <td className="p-2">{order.outletProductsCollected ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Full Image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full View"
            className="max-w-full max-h-full rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryPartnerDetails;