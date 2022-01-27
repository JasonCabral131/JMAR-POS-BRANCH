import React from "react";
import orderlogo from "src/assets/icons/order.png";
import { CDataTable } from "@coreui/react";

const Completed = ({ loading, setLoading }) => {
  return (
    <div className="card p-2 shadow">
      <div className="order-heading-container">
        <img src={orderlogo} alt="order-logo" />
        <p className="gradient__text">Completed Order</p>
      </div>
      <CDataTable
        items={[]}
        fields={order_field}
        columnFilter={false}
        tableFilterValue={null}
        tableFilter={{ placeholder: "search order..." }}
        footer={false}
        itemsPerPageSelect
        itemsPerPage={5}
        hover
        sorter
        pagination
        loading={loading}
      />
    </div>
  );
};
export default Completed;
const order_field = [
  { key: "index", label: "#" },
  { key: "order_id", label: `Order ID` },
  { key: "order", label: `Order` },
  { key: "customer", label: `Customer` },
  { key: "total", label: `total` },
  { key: "date", label: `Date` },
  { key: "action", label: `Actions` },
];
