import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCopy, FaCheck, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from '../redux/orderDetailsSlice';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.orderDetails);
  const [copiedItems, setCopiedItems] = useState({});

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItems({ ...copiedItems, [key]: true });
      
      // Reset the copy icon after 2 seconds
      setTimeout(() => {
        setCopiedItems(prevState => ({ ...prevState, [key]: false }));
      }, 2000);
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      </div>
    );

  const { order: orderInfo, customer, outlet } = order || {};
  const customerCoordinates = orderInfo?.address?.coordinates;
  
  // Generate Google Maps URL using the coordinates
  const getGoogleMapsUrl = (lat, long) => {
    return `https://www.google.com/maps?q=${lat},${long}`;
  };

  const productDisplayNameMap = {
    E6: "6pc tray",
    E12: "12pc tray",
    E30: "30pc tray",
    // Add other mappings as needed
  };

  const renderProducts = (products, renderAsTableRows = false) => {
    if (!products) {
      return null;
    }

    if (Array.isArray(products)) {
      // Case 1: products is an array
      return products.map((product, index) =>
        renderAsTableRows ? (
          <tr key={product.productId} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="p-3 text-left">{product.name}</td>
            <td className="p-3 text-right">{product.quantity}</td>
          </tr>
        ) : (
          <li key={product.productId} className="flex items-center space-x-3 text-lg text-gray-700">
            <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
            <span className="font-medium">{product.name}</span>
            <span>x {product.quantity}</span>
          </li>
        )
      );
    } else if (typeof products === 'object' && products !== null) {
      // Case 2: products is an object
      const productItems = [];
      for (const productId in products) {
        if (products.hasOwnProperty(productId)) {
          const product = products[productId];
          let displayName = productDisplayNameMap[productId] || productId; // Use mapped name or original ID

          if (typeof product === 'object' && product.hasOwnProperty('quantity')) {
            productItems.push(
              renderAsTableRows ? (
                <tr key={productId} className={productItems.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 text-left">{product.name}</td>
                  <td className="p-3 text-right">{product.quantity}</td>
                </tr>
              ) : (
                <li key={productId} className="flex items-center space-x-3 text-lg text-gray-700">
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="font-medium">{product.name}</span>
                  <span>x {product.quantity}</span>
                </li>
              )
            );
          } else if (typeof product === 'number') {
            productItems.push(
              renderAsTableRows ? (
                <tr key={productId} className={productItems.length % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 text-left">{displayName}</td>
                  <td className="p-3 text-right">{product}</td>
                </tr>
              ) : (
                <li key={productId} className="flex items-center space-x-3 text-lg text-gray-700">
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="font-medium">{displayName}</span>
                  <span>x {product}</span>
                </li>
              )
            );
          }
        }
      }
      return productItems;
    } else {
      return null; // Handle unexpected types
    }
  };

  return (
    <div className="h-screen bg-gray-100 py-2 text-lg overflow-auto">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="border-b border-gray-200 mb-8 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link
                  to="/orders"
                  className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaArrowLeft className="text-lg" />
                  <span>Back to Orders</span>
                </Link>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Order Details
                </h2>
              </div>
              <span
                className={`px-4 py-2 animate-pulse duration-100 rounded-full text-lg font-medium ${
                  orderInfo?.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : orderInfo?.status === "canceled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {orderInfo?.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Location Map Card */}
            <OrderSection title="Customer Location">
              {customerCoordinates && (
                <>
                  <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden border border-gray-300">
                    <iframe
                      title="Customer Location"
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      src={`https://maps.google.com/maps?q=${customerCoordinates.lat},${customerCoordinates.long}&z=15&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Coordinates</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-2">
                          {customerCoordinates.lat}, {customerCoordinates.long}
                        </span>
                        <button
                          onClick={() => handleCopy(`${customerCoordinates.lat}, ${customerCoordinates.long}`, "coordinates")}
                          className="text-gray-400 hover:text-blue-500 focus:outline-none transition-colors duration-200"
                          title="Copy Coordinates"
                        >
                          {copiedItems["coordinates"] ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaCopy />
                          )}
                        </button>
                      </div>
                    </div>
                    <CopyableDetail
                      label="Full Address"
                      value={`${orderInfo?.address?.fullAddress?.flatNo}, ${orderInfo?.address?.fullAddress?.area}, ${orderInfo?.address?.fullAddress?.city}, ${orderInfo?.address?.fullAddress?.state} - ${orderInfo?.address?.fullAddress?.zipCode}`}
                      onCopy={() => handleCopy(`${orderInfo?.address?.fullAddress?.flatNo}, ${orderInfo?.address?.fullAddress?.area}, ${orderInfo?.address?.fullAddress?.city}, ${orderInfo?.address?.fullAddress?.state} - ${orderInfo?.address?.fullAddress?.zipCode}`, "customerAddress")}
                      isCopied={copiedItems["customerAddress"]}
                      copyable
                    />
                    <a
                      href={getGoogleMapsUrl(customerCoordinates.lat, customerCoordinates.long)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-orange-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-2 transition-colors duration-200"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      Open in Google Maps
                    </a>
                  </div>
                </>
              )}
              {!customerCoordinates && (
                <div className="h-32 flex items-center justify-center text-gray-500">
                  No location coordinates available
                </div>
              )}
            </OrderSection>

            <OrderSection title="Order Information">
              <CopyableDetail 
                label="Order ID" 
                value={orderInfo?.id} 
                onCopy={() => handleCopy(orderInfo?.id, "orderId")}
                isCopied={copiedItems["orderId"]}
                copyable 
              />
              <Detail label="Amount" value={`Rs ${orderInfo?.amount?.toFixed(2)}`} className="font-semibold text-gray-900" />
              <Detail label="Delivery Distance" value={orderInfo?.deleveryDistance} />
              <Detail label="Order Date" value={new Date(orderInfo?.createdAt?._seconds * 1000).toLocaleString()} />
              <Detail label="Last Updated" value={new Date(orderInfo?.updatedAt?._seconds * 1000).toLocaleString()} />
              <Detail label="Delivery Partner" value={orderInfo?.deliveryPartnerId ?? "Awaiting acceptance"} className={orderInfo?.deliveryPartnerId ? "" : "text-yellow-600"} />
              <Detail label="Accepted by Partner" value={orderInfo?.orderAcceptedByRider ? "Yes" : "No"} className={orderInfo?.orderAcceptedByRider ? "text-green-600" : "text-red-600"} />
            </OrderSection>

            <OrderSection title="Customer Information">
              <Detail label="Name" value={customer?.name} />
              <CopyableDetail 
                label="Phone" 
                value={customer?.phoneNumber} 
                onCopy={() => handleCopy(customer?.phoneNumber, "customerPhone")}
                isCopied={copiedItems["customerPhone"]}
                copyable 
              />
              <CopyableDetail 
                label="Email" 
                value={customer?.email} 
                onCopy={() => handleCopy(customer?.email, "customerEmail")}
                isCopied={copiedItems["customerEmail"]}
                copyable 
              />
            </OrderSection>

            <OrderSection title="Delivery Address">
              <div className="space-y-3">
                <Detail label="City" value={orderInfo?.address?.fullAddress?.city} />
                <Detail label="State" value={orderInfo?.address?.fullAddress?.state} />
                <Detail label="Area" value={orderInfo?.address?.fullAddress?.area} />
                <Detail label="FlatNo" value={orderInfo?.address?.fullAddress?.flatNo} />
                <Detail label="Pin Code" value={orderInfo?.address?.fullAddress?.zipCode} />
                <CopyableDetail 
                  label="Full Address" 
                  value={`${orderInfo?.address?.fullAddress?.flatNo}, ${orderInfo?.address?.fullAddress?.area}, ${orderInfo?.address?.fullAddress?.city}, ${orderInfo?.address?.fullAddress?.state} - ${orderInfo?.address?.fullAddress?.zipCode}`} 
                  onCopy={() => handleCopy(`${orderInfo?.address?.fullAddress?.flatNo}, ${orderInfo?.address?.fullAddress?.area}, ${orderInfo?.address?.fullAddress?.city}, ${orderInfo?.address?.fullAddress?.state} - ${orderInfo?.address?.fullAddress?.zipCode}`, "customerAddressFull")}
                  isCopied={copiedItems["customerAddressFull"]}
                  copyable 
                />
              </div>
            </OrderSection>

            <OrderSection title="Products">
              <div className="overflow-x-auto rounded-md">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left font-semibold text-gray-700">Product Name</th>
                      <th className="p-3 text-right font-semibold text-gray-700">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderProducts(orderInfo?.products, true)} {/* Pass true to render as table rows */}
                  </tbody>
                </table>
              </div>
            </OrderSection>

            <OrderSection title="Outlet Information">
              <Detail label="Name" value={outlet?.name} />
              <CopyableDetail 
                label="Phone" 
                value={outlet?.phNo} 
                onCopy={() => handleCopy(outlet?.phNo, "outletPhone")}
                isCopied={copiedItems["outletPhone"]}
                copyable 
              />
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="text-lg font-medium text-gray-500 mb-3">Address</h5>
                <Detail label="FlatNo" value={outlet?.address?.fullAddress?.flatNo} />
                <Detail label="Area" value={outlet?.address?.fullAddress?.area} />
                <Detail label="City" value={outlet?.address?.fullAddress?.city} />
                <Detail label="State" value={outlet?.address?.fullAddress?.state} />
                <Detail label="Pin Code" value={outlet?.address?.fullAddress?.zipCode} />
                <CopyableDetail 
                  label="Full Address" 
                  value={`${outlet?.address?.fullAddress?.flatNo}, ${outlet?.address?.fullAddress?.area}, ${outlet?.address?.fullAddress?.city}, ${outlet?.address?.fullAddress?.state} - ${outlet?.address?.fullAddress?.zipCode}`} 
                  onCopy={() => handleCopy(`${outlet?.address?.fullAddress?.flatNo}, ${outlet?.address?.fullAddress?.area}, ${outlet?.address?.fullAddress?.city}, ${outlet?.address?.fullAddress?.state} - ${outlet?.address?.fullAddress?.zipCode}`, "outletAddress")}
                  isCopied={copiedItems["outletAddress"]}
                  copyable 
                />
              </div>
            </OrderSection>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderSection = ({ title, children }) => (
  <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow">
    <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

// Modified Detail component with responsive layout
const Detail = ({ label, value, className = "" }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
    <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">{label}</span>
    <span className={`text-sm ${className || "text-gray-700"}`}>{value || "N/A"}</span>
  </div>
);

// Modified CopyableDetail component with responsive layout
const CopyableDetail = ({ label, value, className = "", copyable = false, onCopy, isCopied }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
    <span className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">{label}</span>
    <div className="flex items-center">
      <span className={`text-sm ${className || "text-gray-700"} mr-2`}>{value || "N/A"}</span>
      {copyable && value && (
        <button 
          onClick={onCopy}
          className="text-gray-400 hover:text-blue-500 focus:outline-none transition-colors duration-200"
          title={`Copy ${label}`}
        >
          {isCopied ? (
            <FaCheck className="text-green-500" />
          ) : (
            <FaCopy />
          )}
        </button>
      )}
    </div>
  </div>
);

export default OrderDetails;