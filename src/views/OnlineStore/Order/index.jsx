import React from "react";
import "./style.scss";
import {
  MdOutlinePendingActions,
  MdAddTask,
  MdFreeCancellation,
} from "react-icons/md";
import { RiRefundLine } from "react-icons/ri";
import { useState } from "react";
import Pending from "./Pending";
import Completed from "./Completed";
import Cancelled from "./Cancelled/Cancelled";
import Refund from "./Refund";
import orderlogo from "src/assets/icons/order.png";
import { CDataTable } from "@coreui/react";
const initialState = {
  default: true,
  pending: false,
  cancelled: false,
  completed: false,
  refund: false,
};
const Order = (props) => {
  const [show, setShow] = useState(initialState);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-100">
      <div className="row">
        <div className="col-md-3 d-flex justify-content-center align-items-center ">
          <div className="order-card  shadow p-4">
            <MdOutlinePendingActions size={30} />
            <p
              className={`heading-order ${
                show.pending ? "active-heading" : ""
              }`}
              onClick={() => {
                setShow((prev) => {
                  return {
                    default: false,
                    pending: true,
                    cancelled: false,
                    completed: false,
                    refund: false,
                  };
                });
              }}
            >
              Pending
            </p>
            <span>1</span>
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-center align-items-center">
          <div className="order-card shadow p-4">
            <MdAddTask size={30} color="rgb(25, 214, 41)" />
            <p
              className={`heading-order ${
                show.completed ? "active-heading" : ""
              }`}
              onClick={() => {
                setShow((prev) => {
                  return {
                    default: false,
                    pending: false,
                    completed: true,
                    cancelled: false,
                    refund: false,
                  };
                });
              }}
            >
              Completed
            </p>
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-center align-items-center">
          <div className="order-card shadow p-4">
            <MdFreeCancellation size={30} color="red" />
            <p
              className={`heading-order ${
                show.cancelled ? "active-heading" : ""
              }`}
              onClick={() => {
                setShow((prev) => {
                  return {
                    default: false,
                    pending: false,
                    completed: false,
                    cancelled: true,
                    refund: false,
                  };
                });
              }}
            >
              Cancelled
            </p>
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-center align-items-center">
          <div className="order-card shadow p-4">
            <RiRefundLine size={30} color="#006ff1" />
            <p
              className={`heading-order ${show.refund ? "active-heading" : ""}`}
              onClick={() => {
                setShow((prev) => {
                  return {
                    default: false,
                    pending: false,
                    completed: false,
                    cancelled: false,
                    refund: true,
                  };
                });
              }}
            >
              Refund
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 w-100">
        {show.pending ? <Pending {...props} /> : null}
        {show.completed ? <Completed {...props} /> : null}
        {show.cancelled ? <Cancelled {...props} /> : null}
        {show.refund ? <Refund {...props} /> : null}
        <div className="card p-2 shadow mt-2">
          <div className="order-heading-container">
            <img src={orderlogo} alt="order-logo" />
            <p>Orders</p>
          </div>
          <CDataTable
            items={orders}
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
      </div>
    </div>
  );
};
export default Order;

const order_field = [
  { key: "index", label: "#" },
  { key: "order_id", label: `Order ID` },
  { key: "order", label: `Order` },
  { key: "customer", label: `Customer` },
  { key: "total", label: `Order Status` },
  { key: "total", label: `total` },

  { key: "date", label: `Date` },
  { key: "action", label: `Actions` },
];
