import React, { useState } from "react";
import orderlogo from "src/assets/icons/order.png";
import { CButton, CDataTable, CCardBody } from "@coreui/react";
import Steps from "rsuite/Steps";
import { toCapitalized } from "src/reusable";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdDeliveryDining, MdOutlineLocalShipping } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import axiosInstance from "src/helpers/axios";
const Pending = ({
  pendingData,
  setPendingData,
  loading,
  setLoading,
  handleUpdateData,
}) => {
  const [details, setDetails] = useState({ modal: false, data: null });
  const [orderStats, setOrderStats] = useState("");
  const [updating, setUpdating] = useState(false);
  const OrderPlace = ({ item }) => {
    if (item.length < 1) {
      return (
        <span>
          Place Order{" "}
          <MdDeliveryDining size={25} className="ml-2" color={"#ff6600 "} />
        </span>
      );
    } else if (item.length === 1) {
      return (
        <span>
          Packed <FiPackage size={25} className="ml-2" color={"#ff6600 "} />
        </span>
      );
    } else if (item.length === 2) {
      return (
        <span>
          Shipped{" "}
          <MdOutlineLocalShipping
            size={25}
            className="ml-2"
            color={"#ff6600 "}
          />
        </span>
      );
    } else if (item.length === 3) {
      return (
        <span>
          Delivered{" "}
          <MdOutlineLocalShipping
            size={25}
            className="ml-2"
            color={"#ff6600 "}
          />
        </span>
      );
    } else {
      return <span></span>;
    }
  };
  const orderStatus = () => {
    if (details.data) {
      Swal.fire({
        title: "Are you sure?",
        text: "You wont revert this action",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            if (details.data.orderStatus.length < 3) {
              setUpdating(true);
              const orderStat = ["ordered", "packed", "shipped", "delivered"];
              const obj = {
                orderId: details.data._id,
                orderStatus: {
                  type: orderStat[details.data.orderStatus.length],
                },
                paymentStatus:
                  details.data.orderStatus.length === 4
                    ? "Completed"
                    : "pending",
              };
              const res = await axiosInstance.post("/update-order-status", obj);
              setUpdating(false);
              if (res.status === 200) {
                Swal.fire({
                  icon: "success",
                  text: "Successfully Updated Order Status",
                });
                setDetails({ modal: false, data: null });
                return;
              }
              Swal.fire({
                icon: "warning",
                text: res.data.msg,
              });
              setDetails({ modal: false, data: null });
              return;
            } else {
              setUpdating(true);
              const obj = {
                items: details.data.items,
                orderId: details.data._id,
                totalAmount: details.data.totalAmount,
                customerId: details.data.customer._id,
                usingPayment:
                  details.data.paymentType === "Cash on Delivery"
                    ? "COUNTER"
                    : "QRCODE-PAYMENT",
              };
              const res = await axiosInstance.post(
                "/complete-order-status",
                obj
              );
              setUpdating(false);
              if (res.status === 200) {
                Swal.fire({
                  icon: "success",
                  text: "Order Successfully Delivered",
                });
                setDetails({ modal: false, data: null });
                return;
              }
              Swal.fire({
                icon: "warning",
                text: res.data.msg,
              });
              setDetails({ modal: false, data: null });
              return;
            }
          } catch (e) {
            setUpdating(false);
            setDetails({ modal: false, data: null });
            Swal.fire({
              icon: "warning",
              text: "Failed to Updated Order Status",
            });
            return;
          }
        }
      });
    }
  };
  const cancelOrder = (item) => {
    try {
      Swal.fire({
        title: "Are you sure to cancel?",
        text: "You wont revert this action",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setUpdating(true);
          const obj = {
            items: item.items,
            orderId: item._id,
            customerId: item.customer._id,
          };
          const res = await axiosInstance.post("/cancelled-order-details", obj);
          setUpdating(false);
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              text: "Order Successfully Cancelled",
            });
            return;
          }
          Swal.fire({
            icon: "warning",
            text: res.data.msg,
          });
          return;
        }
      });
    } catch (e) {
      setUpdating(false);
    }
  };
  const refundOrder = async (item) => {
    try {
      Swal.fire({
        title: "Are you sure to Refund?",
        text: "You wont revert this action",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setUpdating(true);
          const obj = {
            items: item.items,
            orderId: item._id,
            customerId: item.customer._id,
            totalAmount: item.total,
          };
          const res = await axiosInstance.post("/refund-order-details", obj);
          setUpdating(false);
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              text: "Order Successfully Refunded",
            });
            return;
          }
          Swal.fire({
            icon: "warning",
            text: res.data.msg,
          });
          return;
        }
      });
    } catch (e) {
      setUpdating(false);
    }
  };
  return (
    <div className="card p-2 shadow">
      <div className="order-heading-container">
        <div className="order-heading-container">
          <img src={orderlogo} alt="order-logo" />
          <p className="gradient__text">Pending Order</p>
        </div>
      </div>
      <CDataTable
        items={pendingData}
        fields={order_field}
        columnFilter={false}
        tableFilterValue={null}
        tableFilter={{ placeholder: "search order..." }}
        footer={false}
        itemsPerPageSelect
        itemsPerPage={15}
        sorter
        pagination
        loading={loading}
        scopedSlots={{
          action: (item, index) => (
            <td className="text-center ">
              <div className="w-100 d-flex flex-column">
                <CButton
                  style={{ width: 80 }}
                  color="info"
                  variant="outline"
                  className={"mt-1"}
                  onClick={() => {
                    setDetails((prev) => {
                      return { modal: true, data: item };
                    });
                    setOrderStats("");
                  }}
                  disabled={updating}
                >
                  Update
                </CButton>
                {item.orderStatus.length === 0 ? (
                  item.paymentType !== "Jarm Payment" ? (
                    <CButton
                      color="danger"
                      style={{ width: 80 }}
                      variant="outline"
                      onClick={() => {
                        cancelOrder(item);
                      }}
                      className={" mt-1"}
                      disabled={updating}
                    >
                      Cancel
                    </CButton>
                  ) : null
                ) : null}
                {item.orderStatus.length === 0 ? (
                  item.paymentType === "Jarm Payment" ? (
                    <CButton
                      style={{ width: 80 }}
                      color="warning"
                      variant="outline"
                      onClick={() => {
                        refundOrder(item);
                      }}
                      className={"mt-1"}
                      disabled={updating}
                    >
                      Refund
                    </CButton>
                  ) : null
                ) : null}
              </div>
            </td>
          ),
          customerx: (item, index) => {
            return (
              <td style={{ width: 300 }}>
                <div className="customer-table-con">
                  <img alt={Math.random()} src={item.customer.profile.url} />
                  <div className="ml-2 d-flex flex-column container-order-custo">
                    <label className="label-name d-block text-left">
                      {toCapitalized(
                        `${item.customer.firstname} ${item.customer.lastname}`
                      )}
                      <AiOutlineMessage
                        size={22}
                        className="ml-2 msg-icon"
                        color={"#ff6600 "}
                      />
                    </label>
                    <label className="d-block phone-num-order">
                      # ( {toCapitalized(`${item.customer.phone}`)} )
                    </label>
                    <label className="d-block phone-num-order">
                      <IoLocationOutline color={"#ff6600"} size={20} /> Delivery
                      Address
                    </label>
                    <label className="d-block phone-num-order">
                      {toCapitalized(item.address)}
                    </label>
                  </div>
                </div>
              </td>
            );
          },
          order: (item, index) => {
            return (
              <td className="text-center" style={{ width: 200 }}>
                {item.items?.map((data) => {
                  return (
                    <div className="d-flex w-100">
                      <label>{data.price}</label>
                      <label className=" ml-1">{data.product.product}</label>
                      <label className=" ml-3 text-right" style={{ width: 40 }}>
                        x {data.qty}
                      </label>
                    </div>
                  );
                })}
              </td>
            );
          },
          paymentType: (item) => {
            return (
              <td
                style={{ textAlign: "center", width: 190 }}
                className="fw-bold"
              >
                {item.paymentType}
              </td>
            );
          },
        }}
      />
      <Modal
        show={details.modal}
        size="xl"
        onHide={() => {
          setDetails((prev) => {
            return { modal: false, data: null };
          });
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          {details.data ? (
            <CCardBody className={"p-2"}>
              <div className="d-flex w-100">
                <img
                  alt={Math.random()}
                  src={details.data.customer.profile.url}
                  className="modal-img-custo"
                />
                <div className="w-100 ml-2">
                  <label className="modal-customer-name">
                    {toCapitalized(
                      `${details.data.customer.firstname} ${details.data.customer.lastname}`
                    )}
                    <AiOutlineMessage
                      size={22}
                      className="ml-2 msg-icon"
                      color={"#ff6600 "}
                    />
                  </label>
                  <label className="d-block modal-customer-_id">
                    ID: ( {toCapitalized(`${details.data.customer._id}`)} )
                  </label>
                  <label className="d-block modal-customer-phone">
                    # ( {toCapitalized(`${details.data.customer.phone}`)} )
                  </label>
                  <label className="d-block label-name text-left ">
                    <IoLocationOutline color={"#ff6600"} size={20} /> Delivery
                    Address
                  </label>
                  <label className="d-block modal-customer-phone">
                    {toCapitalized(`${details.data.address}`)}
                  </label>
                </div>
              </div>
              <label className="label-name d-block text-left gradient__text mt-3">
                Order Status
              </label>
              <div className="w-100 p-3">
                <Steps current={details.data.orderStatus.length}>
                  <Steps.Item title="Pending" />
                  <Steps.Item title="Place Order" />
                  <Steps.Item title="Packed" />
                  <Steps.Item title="Shipped" />
                  <Steps.Item title="Delivered" />
                </Steps>
              </div>
              {details.data.orderStatus.length < 4 ? (
                <div className="d-flex flex-column w-100 align-items-end mr-2 ">
                  <label className="label-name d-block text-left gradient__text mt-3">
                    Update Order Status
                  </label>
                  <div
                    className=" w-25 select-order-details"
                    onChange={(e) => {
                      setOrderStats(e.target.value);
                    }}
                    value={orderStats}
                  >
                    <OrderPlace item={details.data.orderStatus} />
                  </div>
                </div>
              ) : null}
            </CCardBody>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {details.data ? (
            <>
              <button
                className="button-customer button-cancel"
                onClick={() => {
                  setDetails({ modal: false, data: null });
                  setOrderStats("");
                }}
                disabled={updating}
              >
                Cancel
              </button>
              {details.data.orderStatus.length < 4 ? (
                <button
                  className="button-customer button-save"
                  onClick={() => {
                    orderStatus();
                  }}
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </>
                  ) : (
                    "update"
                  )}
                </button>
              ) : null}
            </>
          ) : null}
        </Modal.Footer>
      </Modal>
    </div>
  );
  // eslint-disable-next-line
};
export default Pending;

const order_field = [
  { key: "index", label: "#" },
  { key: "_id", label: `Order ID` },
  { key: "order", label: `Order` },
  { key: "customerx", label: `Customer` },
  { label: "Payment type", key: "paymentType" },
  { key: "fee", label: `Shipping Fee` },
  { key: "total", label: `total` },
  { key: "date", label: `Date` },
  { key: "action", label: `Details` },
];
