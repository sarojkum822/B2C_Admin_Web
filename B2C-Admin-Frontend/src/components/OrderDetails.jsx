import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://b2c-backend-1.onrender.com/api/v1/order/orderdetails/${id}`);
        
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

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const { order: orderInfo, customer, outlet } = order || {};
  console.log(order);
  
  return (
    <div className="bg-white p-6 shadow rounded mb-6  mx-auto ml-1">
      <div className="flex gap-10 ">
       <Link to='/orders' className="text-xl font-semibold mb-4 text-gray-800 underline hover:text-orange-500">Go back</Link>
       <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Information */}
        <OrderSection title="Order Info">
          <Detail label="Order ID" value={orderInfo?.id} />
          <Detail
            label="Status"
            value={orderInfo?.status}
            highlight={orderInfo?.status === "Delivered" ? "text-green-600" : "text-red-600"}
          />
          <Detail label="Amount" value={`Rs ${orderInfo?.amount}`} />
          <Detail label="Delivery Distance" value={orderInfo?.deleveryDistance} />
          <Detail
            label="Order Date"
            value={new Date(orderInfo?.createdAt?._seconds * 1000).toLocaleString()}
          />
          <Detail
            label="Last Updated"
            value={new Date(orderInfo?.updatedAt?._seconds * 1000).toLocaleString()}
          />
          <Detail label="Delivery Partner" value={orderInfo?.deliveryPartnerId==null?"delivery partner need to accept":orderInfo?.deliveryPartnerId}/>
          <Detail label="accepted by delivery partner" value={orderInfo?.orderAcceptedByRider==false? "no":"yes"}/>
        </OrderSection>

        {/* Customer Information */}
        <OrderSection title="Customer Info">
          {/* <Detail label="Customer ID" value={customer?.id} /> */}
          <Detail label="Name" value={customer?.name} />
          <Detail label="Phone" value={customer?.phone} />
          <Detail label="Email" value={customer?.email} />
        </OrderSection>

        {/* Address Information */}
        <OrderSection title="Delivery Address">
          {Object.entries(orderInfo?.address?.fullAddress || {}).map(([key, value]) => (
            <Detail key={key} label={key} value={value} />
          ))}
        </OrderSection>

        {/* Products Information */}
        <OrderSection title="Products">
          <ul className="list-disc list-inside text-gray-600">
            {Object.entries(orderInfo?.products || {}).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold text-gray-800">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </OrderSection>

        {/* Outlet Information */}
        <OrderSection title="Outlet Info">
          {/* <Detail label="Outlet ID" value={outlet?.id} /> */}
          <Detail label="Name" value={outlet?.name} />
          <Detail label="Phone" value={outlet?.phNo} />
          {/* <Detail lable="Outlet address"  value = {order?.address}/> */}
          {Object.entries(orderInfo?.address?.fullAddress || {}).map(([key, value]) => (
            <Detail key={key} label={key} value={value} />
          ))}
        </OrderSection>
      </div>
    </div>
  );
};

const OrderSection = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
    {children}
  </div>
);

const Detail = ({ label, value, highlight }) => (
  <p className={`text-gray-600 ${highlight || ""}`}>
    <span className="font-semibold text-gray-800">{label}:</span> {value || "N/A"}
  </p>
);

export default OrderDetails;
