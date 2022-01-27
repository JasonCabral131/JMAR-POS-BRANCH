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
import axiosInstance from "src/helpers/axios";
import "src/views/pages/Home/components/Member/RegisterMember/index.scss";
import { useEffect } from "react";
const initialState = {
  pending: true,
  cancelled: false,
  completed: false,
  refund: false,
};
const Order = (props) => {
  const [show, setShow] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [cancelledData, setCancelledData] = useState([]);
  const [refundedData, setRefundedData] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [messageModal, setMessageModal] = useState(false);
  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/get-order-data-datails");
      setLoading(false);
      if (res.status === 200) {
        setPendingData(res.data.pending);
        setCompletedData(res.data.completed);
        setCancelledData(res.data.cancelled);
        setRefundedData(res.data.refunded);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
    const fetching = setInterval(async () => {
      try {
        const res = await axiosInstance.get("/get-order-data-datails");

        if (res.status === 200) {
          setPendingData(res.data.pending);
          setCompletedData(res.data.completed);
          setCancelledData(res.data.cancelled);
          setRefundedData(res.data.refunded);
        }
      } catch (e) {}
    }, 2000);
    return () => {
      clearInterval(fetching);
    };
    // eslint-disable-next-line
  }, []);

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
            {pendingData.length > 0 ? <span>{pendingData.length}</span> : null}
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
              Delivered
            </p>
            {completedData.length > 0 ? (
              <span>{completedData.length}</span>
            ) : null}
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
            {cancelledData.length > 0 ? (
              <span>{cancelledData.length}</span>
            ) : null}
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
            {refundedData.length > 0 ? (
              <span>{refundedData.length}</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-3 w-100">
        {show.pending ? (
          <Pending
            {...props}
            pendingData={pendingData}
            setPendingData={setPendingData}
            loading={loading}
            setLoading={setLoading}
            customer={customer}
            setCustomer={setCustomer}
            messageModal={messageModal}
            setMessageModal={setMessageModal}
          />
        ) : null}
        {show.completed ? (
          <Completed
            {...props}
            completedData={completedData}
            setCompletedData={setCompletedData}
            loading={loading}
            setLoading={setLoading}
            customer={customer}
            setCustomer={setCustomer}
            messageModal={messageModal}
            setMessageModal={setMessageModal}
          />
        ) : null}
        {show.cancelled ? (
          <Cancelled
            {...props}
            cancelledData={cancelledData}
            setCancelledData={setCancelledData}
            loading={loading}
            setLoading={setLoading}
            customer={customer}
            setCustomer={setCustomer}
            messageModal={messageModal}
            setMessageModal={setMessageModal}
          />
        ) : null}
        {show.refund ? (
          <Refund
            {...props}
            refundedData={refundedData}
            setRefundedData={setRefundedData}
            loading={loading}
            setLoading={setLoading}
            customer={customer}
            setCustomer={setCustomer}
            messageModal={messageModal}
            setMessageModal={setMessageModal}
          />
        ) : null}
      </div>
    </div>
  );
  // eslint-disable-next-line
};
export default Order;
