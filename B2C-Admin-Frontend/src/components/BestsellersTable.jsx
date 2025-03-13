import React, { useState, useEffect } from "react";

const BestsellersTable = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "count", direction: "descending" });
  const [showDropdown, setShowDropdown] = useState({}); // Track dropdown visibility
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("https://b2c-backend-eik4.onrender.com/api/v1/admin/getProductCount");
        const data = await response.json();
        if (data.status === "Success") {
          const formattedData = data.product.map((item) => ({
            product: item.name,
            count: item.count,
          }));
          setBestsellers(formattedData);
        } else {
          throw new Error("Failed to fetch data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const sortedBestsellers = [...bestsellers].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
    } else {
      return a[sortConfig.key] > b[sortConfig.key] ? -1 : 1;
    }
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const toggleDropdown = (column) => {
    setShowDropdown((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleDirectionChange = (direction) => {
    setSortConfig((prev) => ({ ...prev, direction }));
    setShowDropdown({}); // Close all dropdowns
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-white p-6 shadow rounded mb-6">
      <h3 className="text-lg font-semibold mb-4">Bestsellers</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort("product")}>
                Product
                <button onClick={() => toggleDropdown("product")} className="ml-2">
                  ▼
                </button>
                {showDropdown["product"] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange("ascending")} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange("descending")} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
              <th className="p-4 text-left cursor-pointer relative" onClick={() => handleSort("count")}>
                Count
                <button onClick={() => toggleDropdown("count")} className="ml-2">
                  ▼
                </button>
                {showDropdown["count"] && (
                  <div className="absolute bg-white border shadow-md mt-1">
                    <button onClick={() => handleDirectionChange("ascending")} className="block px-4 py-2 text-sm">
                      Ascending
                    </button>
                    <button onClick={() => handleDirectionChange("descending")} className="block px-4 py-2 text-sm">
                      Descending
                    </button>
                  </div>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBestsellers.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100 transition duration-200">
                <td className="p-4 border-b">{item.product}</td>
                <td className="p-4 border-b">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestsellersTable;
