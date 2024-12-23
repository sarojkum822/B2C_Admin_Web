// import React, { useState } from 'react';

// const BestsellersTable = () => {
//   const [sortConfig, setSortConfig] = useState({ key: 'sold', direction: 'ascending' });
//   const [showDropdown, setShowDropdown] = useState({}); // Track dropdown visibility

//   const bestsellers = [
//     {
//       product: "12 pcs Egg Tray",
//       price: "Rs 84.00",
//       sold: "409",
//       profit: "Rs 34,356.00",
//     },
//     {
//       product: "30 pcs Organic Eggs",
//       price: "Rs 120.00",
//       sold: "320",
//       profit: "Rs 38,400.00",
//     },
    
//   ];

//   // Sorting function
//   const sortedBestsellers = [...bestsellers].sort((a, b) => {
//     if (sortConfig.direction === 'ascending') {
//       return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
//     } else {
//       return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
//     }
//   });

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const toggleDropdown = (column) => {
//     setShowDropdown((prev) => ({ ...prev, [column]: !prev[column] }));
//   };

//   const handleDirectionChange = (direction) => {
//     setSortConfig((prev) => ({ ...prev, direction }));
//     setShowDropdown({}); // Close all dropdowns
//   };

//   return (
//     <div className="bg-white shadow rounded-lg p-6 mb-6 overflow-auto h-[300px] scrollbar-thin scrollbar-thumb-gray-400">
//       <h3 className="text-lg font-semibold mb-4">Bestsellers</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('product')}>
//                 Product
//                 <button onClick={() => toggleDropdown('product')} className="ml-2">
//                   ▼
//                 </button>
//                 {showDropdown['product'] && (
//                   <div className="absolute bg-white border shadow-md mt-1">
//                     <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
//                       Ascending
//                     </button>
//                     <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
//                       Descending
//                     </button>
//                   </div>
//                 )}
//               </th>
//               <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('price')}>
//                 Price
//                 <button onClick={() => toggleDropdown('price')} className="ml-2">
//                   ▼
//                 </button>
//                 {showDropdown['price'] && (
//                   <div className="absolute bg-white border shadow-md mt-1">
//                     <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
//                       Ascending
//                     </button>
//                     <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
//                       Descending
//                     </button>
//                   </div>
//                 )}
//               </th>
//               <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('sold')}>
//                 Sold
//                 <button onClick={() => toggleDropdown('sold')} className="ml-2">
//                   ▼
//                 </button>
//                 {showDropdown['sold'] && (
//                   <div className="absolute bg-white border shadow-md mt-1">
//                     <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
//                       Ascending
//                     </button>
//                     <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
//                       Descending
//                     </button>
//                   </div>
//                 )}
//               </th>
//               <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort('profit')}>
//                 Profit
//                 <button onClick={() => toggleDropdown('profit')} className="ml-2">
//                   ▼
//                 </button>
//                 {showDropdown['profit'] && (
//                   <div className="absolute bg-white border shadow-md mt-1">
//                     <button onClick={() => handleDirectionChange('ascending')} className="block px-4 py-2 text-sm">
//                       Ascending
//                     </button>
//                     <button onClick={() => handleDirectionChange('descending')} className="block px-4 py-2 text-sm">
//                       Descending
//                     </button>
//                   </div>
//                 )}
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedBestsellers.map((item, index) => (
//               <tr key={index} className="hover:bg-gray-100 transition duration-200">
//                 <td className="p-4 border-b">{item.product}</td>
//                 <td className="p-4 border-b">{item.price}</td>
//                 <td className="p-4 border-b">{item.sold}</td>
//                 <td className="p-4 border-b">{item.profit}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BestsellersTable;