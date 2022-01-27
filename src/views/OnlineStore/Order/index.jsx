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
const initialState = {
  pending: true,
  cancelled: false,
  completed: false,
  refund: false,
};
const Order = (props) => {
  const [show, setShow] = useState(initialState);
  const [pendingData, setPendingData] = useState(0);
  const [completedData, setCompletedData] = useState(0);
  const [cancelledData, setCancelledData] = useState(0);
  const [refundedData, setRefundedData] = useState(0);
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
        {show.pending ? (
          <Pending
            {...props}
            pendingData={pendingData}
            setPendingData={setPendingData}
          />
        ) : null}
        {show.completed ? (
          <Completed
            {...props}
            completedData={completedData}
            setCompletedData={setCompletedData}
          />
        ) : null}
        {show.cancelled ? (
          <Cancelled
            {...props}
            cancelledData={cancelledData}
            setCancelledData={setCancelledData}
          />
        ) : null}
        {show.refund ? (
          <Refund
            {...props}
            refundedData={refundedData}
            setRefundedData={setRefundedData}
          />
        ) : null}
      </div>
    </div>
  );
};
export default Order;
