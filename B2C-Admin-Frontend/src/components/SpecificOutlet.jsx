import React from "react";
import Bestsellers from "./Bestsellers"
import DeliveryPartners from "./DeliveryPartners"
import OrdersTable from "./OrdersTable"
import OutletPartner from "./OutletPartner"
import OutletSummary from "./OutletSummary"

const SpecificOutlet = () => {
  return (
    <div className="p-4 w-full space-y-6">
      {/* Outlet Summary - Full width */}
      <OutletSummary />

      {/* Two components side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <DeliveryPartners />
  <OutletPartner />
</div>


      {/* Bestsellers and OrdersTable should be stacked below the previous section */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Bestsellers />
        <OrdersTable />
      </div>
    </div>
  );
};

export default SpecificOutlet;