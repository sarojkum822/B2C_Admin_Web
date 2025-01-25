// import React, { useState } from 'react';
// import { FaUser, FaUserSlash, FaQuestionCircle, FaChevronDown, FaArrowRight } from 'react-icons/fa';
// import Leftsidebar from './Leftsidebar' 

// const CustomerInsights = () => {
//   // States for dropdowns
//   // const [topCustomerFilter, setTopCustomerFilter] = useState('This week');
//   // const [genderFilter, setGenderFilter] = useState('This week');
//   const [newReturningFilter, setNewReturningFilter] = useState('This week');

//   const topCustomersData = [
//     { rank: 1, name: 'Shiv', orders: 45, spend: 'Rs 4,500' },
//     { rank: 2, name: 'Abubakkar', orders: 37, spend: 'Rs 3,700' },
//     { rank: 3, name: 'Shivu', orders: 29, spend: 'Rs 2,900' },
//     { rank: 4, name: 'Abubakkar', orders: 22, spend: 'Rs 2,200' },
//     { rank: 5, name: 'Shivraj', orders: 18, spend: 'Rs 1,800' },
//     { rank: 6, name: 'Abubakkar', orders: 15, spend: 'Rs 1,500' },
//     { rank: 7, name: 'Shivaraj', orders: 12, spend: 'Rs 1,200' },
//     { rank: 8, name: 'Abubakkar', orders: 9, spend: 'Rs 900' },
//     { rank: 9, name: 'Shivaraj', orders: 12, spend: 'Rs 1,200' },
//     { rank: 10, name: 'Abubakkar', orders: 9, spend: 'Rs 900' },
//   ];

//   const customerLocationsData = [
//     { rank: 1, location: 'Basavanagudi', orders: 120 },
//     { rank: 2, location: 'Whitefield', orders: 95 },
//     { rank: 3, location: 'MG Road', orders: 82 },
//     { rank: 4, location: 'Indira Nagar', orders: 74 },
//     { rank: 5, location: 'Kengeri', orders: 64 },
//     { rank: 6, location: 'Koramangala', orders: 59 },
//     { rank: 7, location: 'Jayanagar', orders: 53 },
//     { rank: 8, location: 'Rajajinagar', orders: 47 },
//     { rank: 9, location: 'HSR layout', orders: 69 },
//     { rank: 10, location: 'Vijayanagara', orders: 43 },
//   ];


//   const customerAgeGroupData = [
//     { age: '18-25', percentage: '20%' },
//     { age: '26-35', percentage: '35%' },
//     { age: '36-45', percentage: '25%' },
//     { age: '46-60', percentage: '15%' },
//     { age: '60+', percentage: '5%' },
//   ];

//   return (
//     <div>
//       {/* <Leftsidebar /> */}
//       <div className="p-6">

//       {/* Page Heading */}
//       <h1 className="text-3xl font-semibold mb-6">Customer-related Insights</h1>

//       {/* Three Info Boxes */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//         {/* Total Customers Box */}
//         <div className="bg-white shadow-lg p-8 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
//           <div>
//             <h2 className="text-lg font-medium">Total Customers</h2>
//             <p className="text-2xl font-bold">28,232</p>
//           </div>
//           <div className="flex flex-col items-center">
//             <FaUser className="text-4xl text-blue-500 mb-1" />
//             <p className="text-l font-bold text-green-500">+1.9%</p>
//             <p className="text-sm text-green-500">this month</p>
//           </div>
//         </div>

//         {/* Inactive Customers Box */}
//         <div className="bg-white shadow-lg p-8 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
//           <div>
//             <h2 className="text-lg font-medium">Inactive Customers</h2>
//             <p className="text-gray-600">Customers who haven't ordered in the past 3 months.</p>
//           </div>
//           <div className="flex flex-col items-center">
//             <FaUserSlash className="text-4xl text-red-500 mb-1" />
//             <p className="text-2l font-bold text-red-500">26.2%</p>
//           </div>
//         </div>

//         {/* Customer Inquiries Box */}
//         <div className="bg-white shadow-lg p-8 rounded-lg flex justify-between items-center transition-transform duration-300 hover:shadow-lg hover:translate-y-[-5px]">
//           <div>
//             <h2 className="text-lg font-medium">Customer Inquiries</h2>
//             <p className="text-sm text-gray-600">Customers who contacted support in the last 30 days.</p>
//           </div>
//           <div className="flex flex-col items-center">
//             <FaQuestionCircle className="text-4xl text-yellow-500 mb-1" />
//             <p className="text-2xl font-bold">232</p>
//           </div>
//         </div>
//       </div>

//       {/* Top Customers and Customer Location Sections */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
//         {/* Top Customers Box */}
//         <div className="bg-white shadow-lg p-8 rounded-lg">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-medium">Top Customers</h2>
//             <select className="border rounded p-2">
//               <option value="This week">This week</option>
//               <option value="Last week">Last week</option>
//               <option value="This month">This month</option>
//               <option value="Last month">Last month</option>
//               <option value="This year">This year</option>
//               <option value="Last year">Last year</option>
//               <option value="Overall">Overall</option>
//             </select>
//           </div>

//           {/* Top Customers Table */}
//           <div className="overflow-y-auto max-h-48 custom-scrollbar">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="text-left bg-gray-100">
//                   <th className="p-2">Rank</th>
//                   <th className="p-2">Name</th>
//                   <th className="p-2">Total Orders</th>
//                   <th className="p-2">Total Spend</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {topCustomersData.map((customer, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="p-2">{customer.rank}</td>
//                     <td className="p-2">{customer.name}</td>
//                     <td className="p-2">{customer.orders}</td>
//                     <td className="p-2">{customer.spend}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Customer Location Box */}
//         <div className="bg-white shadow-lg p-8 rounded-lg">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-medium">Customer Location</h2>
//           </div>

//           {/* Customer Location Table */}
//           <div className="overflow-y-auto max-h-48 custom-scrollbar">
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="text-left bg-gray-100">
//                   <th className="p-2">Rank</th>
//                   <th className="p-2">Location</th>
//                   <th className="p-2">Orders</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customerLocationsData.map((location, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="p-2">{location.rank}</td>
//                     <td className="p-2">{location.location}</td>
//                     <td className="p-2">{location.orders}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Additional Insight Sections */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
//         {/* Customer Age Group Box */}
//         <div className="bg-white shadow-lg p-8 rounded-lg col-span-2 md:col-span-1">
//           <h2 className="text-lg font-medium mb-4">Customer Age Group</h2>
//           {/* Removed Scrollbar */}
//           <div>
//             <table className="w-full table-auto">
//               <thead>
//                 <tr className="text-left bg-gray-100">
//                   <th className="p-2">Age</th>
//                   <th className="p-2">Percentage</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customerAgeGroupData.map((group, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="p-2">{group.age}</td>
//                     <td className="p-2">{group.percentage}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Combined New vs Returning and Gender Insights */}
//         <div className="bg-white shadow-md p-4 rounded-lg col-span-2">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-medium">Customer Insights</h2>
//             <select className="border rounded p-2">
//               <option value="This week">This week</option>
//               <option value="Last week">Last week</option>
//               <option value="This month">This month</option>
//               <option value="Last month">Last month</option>
//               <option value="This year">This year</option>
//               <option value="Last year">Last year</option>
//               <option value="Overall">Overall</option>
//             </select>
//           </div>

//           {/* New vs Returning and Gender Information */}
//           <div className="flex flex-col md:flex-row justify-between gap-6">
//             {/* New vs Returning */}
//             <div className="w-full md:w-1/2 bg-white shadow-lg p-4 rounded-lg">
//               <h3 className="text-md font-semibold mb-2">New vs Returning Customers</h3>
//               <div className="flex justify-between items-center">
//                 <div className="text-green-600">
//                   <p className="text-2xl font-bold">64.8%</p>
//                   <p className="text-sm">New Customers</p>
//                 </div>
//                 <div className="text-blue-600">
//                   <p className="text-2xl font-bold">35.2%</p>
//                   <p className="text-sm">Returning Customers</p>
//                 </div>
//               </div>
//             </div>

//             {/* Gender Insights */}
//             <div className="w-full md:w-1/2 bg-white shadow-lg p-4 rounded-lg">
//               <h3 className="text-md font-semibold mb-2">Customer Gender</h3>
//               <div className="flex justify-between items-center">
//                 <div className="text-purple-600">
//                   <p className="text-2xl font-bold">52%</p>
//                   <p className="text-sm">Female</p>
//                 </div>
//                 <div className="text-indigo-600">
//                   <p className="text-2xl font-bold">48%</p>
//                   <p className="text-sm">Male</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// const customStyles = document.createElement('style');
// customStyles.innerHTML = `
//   .custom-scrollbar::-webkit-scrollbar {
//     width: 8px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background-color: rgba(0, 0, 0, 0.4);
//     border-radius: 4px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//     background-color: rgba(0, 0, 0, 0.6);
//   }
// `;
// document.head.appendChild(customStyles);

// export default CustomerInsights;

import React, { useState, useEffect } from 'react';
import { FaUser, FaUserSlash, FaQuestionCircle } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';

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
        const response = await fetch('https://b2c-49u4.onrender.com/api/v1/admin/customerInsights');
        const responseData = await response.json();

        setData({
          totalCustomers: responseData.aggergation.totalCustomers,
          inactiveCustomers: responseData.aggergation.inactiveCust,
          customerInquiries: responseData.aggergation.custEnquiry,
          topCustomers: responseData.customers.map((customer, index) => ({
            rank: index + 1,
            name: customer.name,
            orders: customer.totalOrders,
            spend: customer.totalExpenditure,
          })) || [],
          customerAgeGroups: Object.entries(responseData.aggergation.ageGroup).map(([age, percentage]) => ({
            age,
            percentage,
          })) || [],
          newVsReturning: {
            new: responseData.aggergation.newCust,
            returning: responseData.aggergation.returningCust,
          },
          genderDistribution: {
            male: responseData.aggergation.male,
            female: responseData.aggergation.female,
            others: responseData.aggergation.others,
          },
          areaDistribution: responseData.aggergation.areaArray.map(([area, percentage]) => ({ area, percentage })) || [],
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
          <h2 className="text-lg font-medium mb-4">Top Customers</h2>
          <div className="overflow-y-auto max-h-48 custom-scrollbar">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-center">Rank</th>
                  <th className="p-2 text-center">Name</th>
                  <th className="p-2 text-center">Orders</th>
                  <th className="p-2 text-center">Spend</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer) => (
                  <tr key={customer.rank}>
                    <td className="p-2 text-center">{customer.rank}</td>
                    <td className="p-2 text-center">{customer.name}</td>
                    <td className="p-2 text-center">{customer.orders}</td>
                    <td className="p-2 text-center">{customer.spend}</td>
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
              <tbody>
                {customerAgeGroups.map((group, index) => (
                  <tr key={index}>
                    <td className="p-2 text-center">{group.age}</td>
                    <td className="p-2 text-center">{group.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Customer Insights Heading */}
          <h2 className="text-2xl font-semibold text-center">Customer Insights</h2>

          {/* Flexbox for New vs Returning Customers and Gender Distribution */}
          <div className="flex flex-col md:flex-row gap-12">
            {/* New vs Returning Customers */}
            <div className="w-full bg-white shadow-lg p-4 rounded-lg flex-1">
              <h3 className="text-md font-semibold mb-2">New vs Returning Customers</h3>
              <div className="flex justify-between items-center">
                <div className="text-green-600">
                  <p className="text-2xl font-bold">{newVsReturning.new}%</p>
                  <p>New Customers</p>
                </div>
                <div className="text-blue-600">
                  <p className="text-2xl font-bold">{newVsReturning.returning}%</p>
                  <p>Returning Customers</p>
                </div>
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white shadow-lg p-4 rounded-lg flex-1">
              <h3 className="text-md font-semibold mb-2">Gender Distribution</h3>
              <div className="flex justify-between items-center">
                <div className="text-blue-600">
                  <p className="text-2xl font-bold">{genderDistribution.male}%</p>
                  <p>Male</p>
                </div>
                <div className="text-pink-600">
                  <p className="text-2xl font-bold">{genderDistribution.female}%</p>
                  <p>Female</p>
                </div>
                <div className="text-gray-600">
                  <p className="text-2xl font-bold">{genderDistribution.others}%</p>
                  <p>Others</p>
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




