import React, { useEffect, useState } from "react";
import { FaUser, FaUserSlash, FaQuestionCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerInsights } from "../redux/customerInsightsSlice";

const CustomerInsights = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.customerInsights
  );
  
  // Pagination state for top customers
  const [topCustomersPage, setTopCustomersPage] = useState(1);
  const [customersPerPage] = useState(5);
  
  // Pagination state for location
  const [locationPage, setLocationPage] = useState(1);
  const [locationsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchCustomerInsights());
  }, [dispatch]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-50">
  //       <div className="animate-spin duration-250 rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center mt-10 max-w-lg mx-auto shadow-md">
        <h2 className="text-xl font-semibold">{error}</h2>
        <p className="mt-2">Please try again later</p>
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

  // Pagination logic for top customers
  const indexOfLastCustomer = topCustomersPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = topCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalCustomerPages = Math.ceil(topCustomers.length / customersPerPage);

  // Pagination logic for locations
  const indexOfLastLocation = locationPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = areaDistribution.slice(indexOfFirstLocation, indexOfLastLocation);
  const totalLocationPages = Math.ceil(areaDistribution.length / locationsPerPage);

  // Pagination controls
  const Pagination = ({ currentPage, totalPages, setPage, type }) => (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <button 
        onClick={() => setPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
        aria-label={`Previous page of ${type}`}
      >
        <FaChevronLeft />
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
        aria-label={`Next page of ${type}`}
      >
        <FaChevronRight />
      </button>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Customer Insights</h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-800 font-semibold text-md uppercase tracking-wider">Total Customers</h2>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCustomers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <FaUser className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          {/* Inactive Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-800 font-semibold text-md uppercase tracking-wider">Inactive Customers</h2>
                <p className="text-sm text-gray-600 mt-1">No orders in 3 months</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{inactiveCustomers.toFixed(1)}%</p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <FaUserSlash className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          {/* Customer Inquiries */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-gray-800 font-semibold text-md uppercase tracking-wider">Recent Inquiries</h2>
                <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{customerInquiries.toLocaleString()}</p>
              </div>
              <div className="bg-amber-100 p-4 rounded-full">
                <FaQuestionCircle className="text-2xl text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Customers */}
          <div className="bg-white pb-2 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Top Customers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Rank</th>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Orders</th>
                    <th className="py-3 px-6">Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCustomers.map((customer) => (
                    <tr key={customer.rank} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{customer.rank}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{customer.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{customer.orders}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        ₹{customer.spend.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalCustomerPages > 1 && (
              <Pagination 
                currentPage={topCustomersPage} 
                totalPages={totalCustomerPages} 
                setPage={setTopCustomersPage} 
                type="customers"
              />
            )}
          </div>

          {/* Customer Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Customer Location</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Rank</th>
                    <th className="py-3 px-6">Location</th>
                    <th className="py-3 px-6">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentLocations.map((area, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{indexOfFirstLocation + index + 1}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{area.area}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{area.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalLocationPages > 1 && (
              <Pagination 
                currentPage={locationPage} 
                totalPages={totalLocationPages} 
                setPage={setLocationPage} 
                type="locations"
              />
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Age Group */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Age Distribution</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Age Group</th>
                  <th className="py-3 px-6 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerAgeGroups.map((group, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-gray-900">{group.age}</td>
                    <td className="py-3 px-6 text-sm text-gray-900 text-right">
                      <div className="flex items-center justify-end">
                        <div className="mr-2 w-24 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-blue-600" 
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        {Math.round(group.percentage)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Segments (New vs Returning & Gender) */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* New vs Returning Customers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">New vs Returning</h2>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="mb-6 flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">New</span>
                      <span className="text-sm font-medium text-gray-700">{newVsReturning.new.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${newVsReturning.new}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Returning</span>
                      <span className="text-sm font-medium text-gray-700">{newVsReturning.returning.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${newVsReturning.returning}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gender Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Gender Distribution</h2>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="mb-4 flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Male</span>
                      <span className="text-sm font-medium text-gray-700">{genderDistribution.male.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${genderDistribution.male}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Female</span>
                      <span className="text-sm font-medium text-gray-700">{genderDistribution.female.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: `${genderDistribution.female}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Others</span>
                      <span className="text-sm font-medium text-gray-700">{genderDistribution.others.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${genderDistribution.others}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;