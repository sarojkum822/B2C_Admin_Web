import React, { useState, useEffect } from 'react';
import { FaUser, FaUserSlash, FaQuestionCircle } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios'
const CustomerInsights = () => {
  const [data, setData] = useState({
    totalCustomers: 0,
    inactiveCustomers: 0,
    customerInquiries: 0,
    topCustomers: [],
    customerAgeGroups: [],
    newVsReturning: {
      new: 0,
      returning: 0,
    },
    genderDistribution: {
      male: 0,
      female: 0,
      others: 0,
    },
    areaDistribution: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://b2c-backend-1.onrender.com/api/v1/admin/customerInsights');
        const responseData = response?.data || {};
    
        console.log(responseData);
    
        // Extracting and safely accessing nested data
        const aggregation = responseData?.aggregation || {};
        const customers = responseData?.customers || [];
        const ageGroup = aggregation?.ageGroup || {};
        const areaArray = aggregation?.areaArray || [];
    
        setData({
          totalCustomers: aggregation?.totalCustomers || 0,
          inactiveCustomers: aggregation?.inactiveCust || 0,
          customerInquiries: aggregation?.custEnquiry || 0,
          topCustomers: customers.map((customer, index) => ({
            rank: index + 1,
            name: customer?.name || "Unknown",
            orders: customer?.totalOrders || 0,
            spend: customer?.totalExpenditure || 0,
          })),
          customerAgeGroups: Object.entries(ageGroup).map(([age, percentage]) => ({
            age,
            percentage: percentage || 0, // Ensuring percentage is a valid number
          })),
          newVsReturning: {
            new: aggregation?.newCust || 0,
            returning: aggregation?.returningCust || 0,
          },
          genderDistribution: {
            male: aggregation?.male || 0,
            female: aggregation?.female || 0,
            others: aggregation?.others || 0,
          },
          areaDistribution: areaArray.map(([area, percentage]) => ({
            area: area || "Unknown",
            percentage: percentage || 0,
          })),
        });
      } catch (err) {
        console.error("Fetch error: ", err);
        setError("Unable to fetch data. Please try again later."); // User-friendly error message
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#007bff" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        <h2>{error}</h2>
      </div>
    );
  }

  const {
    totalCustomers,
    inactiveCustomers,
    customerInquiries,
    topCustomers,
    customerAgeGroups,
    newVsReturning,
    genderDistribution,
    areaDistribution,
  } = data;

  return (
    <div className="p-6 m-2 bg-gray-100 ">
      <h1 className="text-3xl font-semibold mb-6">Customer Insights</h1>

      {/* Three Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Total Customers */}
        <div className="bg-white shadow-lg p-8 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
          <div>
            <h2 className="text-lg font-medium">Total Customers</h2>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </div>
          <FaUser className="text-4xl text-blue-500" />
        </div>

        {/* Inactive Customers */}
        <div className="bg-white shadow-lg p-8 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
          <div>
            <h2 className="text-lg font-medium">Inactive Customers</h2>
            <p className="text-gray-600">Customers who haven't ordered in 3 months.</p>
          </div>
          <div className="text-red-500 flex flex-col items-center">
            <FaUserSlash className="text-4xl" />
            <p className="text-2xl">{inactiveCustomers}%</p>
          </div>
        </div>

        {/* Customer Inquiries */}
        <div className="bg-white shadow-lg p-8 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
          <div>
            <h2 className="text-lg font-medium">Customer Inquiries</h2>
            <p className="text-sm text-gray-600">Inquiries in the last 30 days.</p>
          </div>
          <div className="flex flex-col items-center">
            <FaQuestionCircle className="text-4xl text-yellow-500" />
            <p className="text-2xl font-bold">{customerInquiries}</p>
          </div>
        </div>
      </div>

      {/* Top Customers and Customer Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        {/* Top Customers */}
        <div className="bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Top Customers</h2>
  <div className="overflow-y-auto max-h-60 custom-scrollbar">
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wide rounded-md">
          <th className="py-3 px-4 text-left">Rank</th>
          <th className="py-3 px-4 text-left">Name</th>
          <th className="py-3 px-4 text-left">Orders</th>
          <th className="py-3 px-4 text-left">Spend</th>
        </tr>
      </thead>
      <tbody>
        {topCustomers.map((customer) => (
          <tr
            key={customer.rank}
            className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <td className="py-3 px-4 text-gray-700 font-medium">
              {customer.rank}
            </td>
            <td className="py-3 px-4 text-gray-800">{customer.name}</td>
            <td className="py-3 px-4 text-gray-700">{customer.orders}</td>
            <td className="py-3 px-4 text-gray-700 font-semibold">
              ₹{customer.spend.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
        </div>

        {/* Customer Location */}
        <div className="bg-white shadow-lg p-8 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Customer Location</h2>
          <div className="overflow-y-auto max-h-48 custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-center">Rank</th>
                  <th className="p-2 text-center">Location</th>
                  <th className="p-2 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {areaDistribution.map((area, index) => (
                  <tr key={index}>
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2 text-center">{area.area}</td>
                    <td className="p-2 text-center">{area.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Age Group, New vs Returning, Gender Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
        {/* Customer Age Group */}
        <div className="bg-white shadow-lg p-8 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Customer Age Group</h2>
          <div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Age Group</th>
                  <th className="p-2">Percentage</th>
                </tr>
              </thead>
              <tbody >
                {customerAgeGroups.map((group, index) => (
                  <tr key={index} >
                    <td className="p-2 text-center">{group.age}</td>
                    <td className="p-2 text-center">{group.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4 ">
          {/* Customer Insights Heading */}
          <h2 className="text-2xl font-semibold text-center">Customer Insights</h2>

          {/* Flexbox for New vs Returning Customers and Gender Distribution */}
          <div className="flex flex-col md:flex-row gap-12">
            {/* New vs Returning Customers */}
            <div className="w-full bg-white shadow-lg p-4 rounded-lg flex-1">
              <h3 className="text-md font-semibold mb-2 text-center border-b-2">New vs Returning Customers</h3>
              <div className="flex justify-between flex-col">
                <div className="text-green-600">
                  <p className="text-2xl font-bold">{newVsReturning.new.toFixed(2)}%</p>
                  <p className='border-b-2 m-2'>New Customers</p>
                </div>
                <div className="text-blue-600">
                  <p className="text-2xl font-bold">{newVsReturning.returning.toFixed(2)}%</p>
                  <p className='border-b-2 m-2'>Returning Customers</p>
                </div>
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white shadow-lg p-4 rounded-lg flex-1">
              <h3 className="text-md font-semibold mb-2 text-center">Gender Distribution</h3>
              <div className="flex justify-between flex-col">
                <div className="text-blue-600">
                  <p className="text-2xl font-bold">{genderDistribution.male.toFixed(2)}%</p>
                  <p className='border-b-2 m-2'>Male</p>
                </div>
                <div className="text-pink-600">
                  <p className="text-2xl font-bold">{genderDistribution.female.toFixed(2)}%</p>
                  <p className='border-b-2 m-2'>Female</p>
                </div>
                <div className="text-gray-600">
                  <p className="text-2xl font-bold">{genderDistribution.others.toFixed(2)}%</p>
                  <p className='border-b-2 m-2'>Others</p>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
};
const customStyles = document.createElement('style');
customStyles.innerHTML = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;
document.head.appendChild(customStyles);
export default CustomerInsights;




