import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

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

  useEffect(() => {
    if (order) {
      console.log("Fetched Order Data:", order);
    }
  }, [order]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-xl text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </p>
      </div>
    );

  const { order: orderInfo, customer, outlet } = order || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] p-8">
        <div className="border-b border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/orders"
                className="text-lg text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center gap-2"
              >
                <FaArrowLeft className="text-lg" />
                <span>Back to Orders</span>
              </Link>
              <h3 className="text-2xl font-semibold text-gray-800">
                Order Details
              </h3>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-lg font-medium ${
                orderInfo?.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {orderInfo?.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <OrderSection title="Order Information">
            <Detail label="Order ID : " value={orderInfo?.id} />
            <Detail
              label="Amount : "
              value={`Rs ${orderInfo?.amount?.toFixed(2)}`}
              className="font-semibold text-gray-900 text-lg"
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
            <Detail label="Phone : " value={customer?.phoneNumber} />
            <Detail label="Email : " value={customer?.email} />
          </OrderSection>

          <OrderSection title="Delivery Address">
            <div className="space-y-3">
              {Object.entries(orderInfo?.address?.fullAddress || {})
                .filter(([key]) => key !== "country")
                .map(([key, value]) => {
                  const formattedKey =
                    key === "zipCode"
                      ? "Pin Code"
                      : key.charAt(0).toUpperCase() + key.slice(1);

                  return (
                    <Detail
                      key={key}
                      label={`${formattedKey} :`}
                      value={value}
                    />
                  );
                })}
            </div>
          </OrderSection>

          <OrderSection title="Products : ">
            <ul className="space-y-4">
              {Object.values(orderInfo?.products || {}).map((product) => (
                <li
                  key={product.productId}
                  className="flex items-center space-x-3 text-lg text-gray-700"
                >
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  <span className="font-medium">{product.name}</span>
                  <span>x {product.quantity}</span>
                </li>
              ))}
            </ul>
          </OrderSection>

          <OrderSection title="Outlet Information : ">
            <Detail label="Name : " value={outlet?.name} />
            <Detail label="Phone : " value={outlet?.phNo} />
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h5 className="text-lg font-medium text-gray-500 mb-3">
                Address :
              </h5>
              {Object.entries(orderInfo?.address?.fullAddress || {})
                .filter(([key]) => key !== "country")
                .map(([key, value]) => {
                  const formattedKey =
                    key === "zipCode"
                      ? "Pincode"
                      : key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <Detail
                      key={key}
                      label={<strong>{`${formattedKey} :`}</strong>}
                      value={value}
                    />
                  );
                })}
            </div>
          </OrderSection>
        </div>
      </div>
    </div>
  );
};

const OrderSection = ({ title, children }) => (
  <div className="bg-gray-50 rounded-lg p-8 mb-8">
    <h4 className=" font-bold text-gray-800 mb-6">{title}</h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const Detail = ({ label, value, className = "" }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
    <span className="text-lg font-medium text-gray-500">{label}</span>
    <span className={`text-lg ${className || "text-gray-700"}`}>
      {value || "N/A"}
    </span>
  </div>
);

export default OrderDetails;