import React from "react";
import orderlogo from "src/assets/icons/order.png";
import { AiOutlineMessage } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { toCapitalized } from "src/reusable";
import { CDataTable } from "@coreui/react";
import { useHistory } from "react-router-dom";
const Cancelled = ({
  loading,
  setLoading,
  cancelledData,
  setCancelledData,
}) => {
  const history = useHistory();
  return (
    <div className="card p-2 shadow">
      <div className="order-heading-container">
        <div className="order-heading-container">
          <img src={orderlogo} alt="order-logo" />
          <p className="gradient__text">Cancelled Order</p>
        </div>
      </div>
      <CDataTable
        items={cancelledData}
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
                        onClick={() => {
                          history.push(
                            `/jarm-chat-system/customer/${item.customer._id}`
                          );
                        }}
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
    </div>
  );
};

export default Cancelled;
const order_field = [
  { key: "index", label: "#" },
  { key: "_id", label: `Order ID` },
  { key: "order", label: `Order` },
  { key: "customerx", label: `Customer` },
  { label: "Payment type", key: "paymentType" },
  { key: "fee", label: `Shipping Fee` },
  { key: "totalAmount", label: `total` },
  { key: "date", label: `Date` },
];
