
import React from "react";
import SalesSummary from "../components/dashboard/SalesSummary";
import TopProducts from "../components/dashboard/TopProducts";
import OrdersOverview from "../components/orders/OrdersOverview";

export default function Dashboard() {
  return (
    <div className="page">
      {}
      <div className="grid-main">
        <div className="left-main">
          <SalesSummary />
          <TopProducts />
        </div>
        <OrdersOverview />
      </div>
    </div>
  );
}