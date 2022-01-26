import React, { useState } from "react";

import { CDataTable } from "@coreui/react";
const Pending = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="card p-2 shadow">
      <div className="order-heading-container">
        <p>Pending Orders</p>
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
export default Pending;

const order_field = [
  { key: "index", label: "#" },
  { key: "order_id", label: `Order ID` },
  { key: "order", label: `Order` },
  { key: "customer", label: `Customer` },
  { key: "total", label: `total` },
  { key: "date", label: `Date` },
  { key: "action", label: `Actions` },
];
