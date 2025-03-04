import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';


const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `https://b2c-backend-1.onrender.com/api/v1/order/orderdetails/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      </div>
    );

  const { order: orderInfo, customer, outlet } = order || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* <Link
                to="/orders"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-sm">←</span>
                <span>Back to Orders</span>
              </Link> */}

              <Link
                to="/orders"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2"
              >
                <FaArrowLeft className="text-sm" />
                <span>Back to Orders</span>
              </Link>

              <h3 className="text-xl font-semibold text-gray-800">
                Order Details
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                orderInfo?.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {orderInfo?.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <OrderSection title="Order Information">
            <Detail label="Order ID : " value={orderInfo?.id} />
            <Detail
              label="Amount : "
              value={`Rs ${orderInfo?.amount?.toFixed(2)}`} 
              className="font-medium text-gray-900"
            />
            <Detail
              label="Delivery Distance : "
              value={orderInfo?.deleveryDistance}
            />
            <Detail
              label="Order Date : "
              value={new Date(
                orderInfo?.createdAt?._seconds * 1000
              ).toLocaleString()}
            />
            <Detail
              label="Last Updated : "
              value={new Date(
                orderInfo?.updatedAt?._seconds * 1000
              ).toLocaleString()}
            />
            <Detail
              label="Delivery Partner : "
              value={orderInfo?.deliveryPartnerId ?? "Awaiting acceptance"}
              className={orderInfo?.deliveryPartnerId ? "" : "text-amber-600"}
            />
            <Detail
              label="Accepted by Partner : "
              value={orderInfo?.orderAcceptedByRider ? "Yes" : "No"}
              className={
                orderInfo?.orderAcceptedByRider
                  ? "text-green-600"
                  : "text-red-600"
              }
            />
          </OrderSection>

          <OrderSection title="Customer Information : ">
            <Detail label="Name : " value={customer?.name} />
            <Detail label="Phone : " value={customer?.phone} />
            <Detail label="Email : " value={customer?.email} />
          </OrderSection>

          <OrderSection title="Delivery Address">
  <div className="space-y-2">
    {Object.entries(orderInfo?.address?.fullAddress || {})
      .filter(([key]) => key !== "country") // Remove "country"
      .map(([key, value]) => {
        const formattedKey =
          key === "zipCode"
            ? "Pin Code"
            : key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter

        return <Detail key={key} label={`${formattedKey} :`} value={value} />;
      })}
  </div>
</OrderSection>


          <OrderSection title="Products : ">
            <ul className="space-y-3">
              {Object.values(orderInfo?.products || {}).map((product) => (
                <li
                  key={product.productId}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span className="font-medium">{product.name}</span>
                  <span>x {product.quantity}</span>
                </li>
              ))}
            </ul>
          </OrderSection>

          <OrderSection title="Outlet Information : ">
            <Detail label="Name : " value={outlet?.name} />
            <Detail label="Phone : " value={outlet?.phNo} />
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h5 className="text-sm font-medium text-gray-500 mb-2">
                Address : 
              </h5>
              {Object.entries(orderInfo?.address?.fullAddress || {}).map(
                ([key, value]) => (
                  <Detail key={key} label={`${key} :`} value={value} />
                )
              )}
            </div>
          </OrderSection>
        </div>
      </div>
    </div>
  );
};

const OrderSection = ({ title, children }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const Detail = ({ label, value, className = "" }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className={`text-sm ${className || "text-gray-700"}`}>
      {value || "N/A"}
    </span>
  </div>
);

export default OrderDetails;
