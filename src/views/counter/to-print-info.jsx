import React from "react";
import { useBarcode } from "react-barcodes";
import { toCapitalized } from "src/reusable";
import logo from "./../../assets/icons/Jarm_Logo.svg";
const BarcodeInformation = ({ salesId }) => {
  const { inputRef } = useBarcode({
    value: salesId === "" ? "Create Sales Info" : salesId,
    options: {
      background: "#fff",
    },
  });
  return (
    <div
      style={{
        width: "245px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas ref={inputRef} style={{ width: "245px", height: "70px" }} />
    </div>
  );
};
const ToPrintContainer = React.forwardRef(
  ({ user, salesId, purchase, tax, getTotal, payment, payer }, ref) => {
    const ToFilter = ({ data, index }) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "245px",
          }}
          key={Math.random()}
        >
          <p style={{ width: "81px" }} className="fw-bold">
            {data.product}
          </p>
          <p style={{ width: "81px" }} className="fw-bold">
            ₱ {data.price} x {data.quantity}
          </p>
          <p style={{ width: "81px", fontSize: "17px" }} className="fw-bold">
            ₱ {new Intl.NumberFormat().format(data.total)}
          </p>
        </div>
      );
    };
    return (
      <div
        ref={ref}
        style={{
          width: "240px",
          height: "auto",
          padding: "5px",
        }}
      >
        <p style={{ width: "240px", textAlign: "center" }}>
          <img
            src={logo}
            style={{
              width: "200px !important",
              height: "200px !important",
              display: "block",
              margin: "0 auto",
            }}
            alt="logo-alt-information"
          />
        </p>
        <p
          style={{ width: "240px", textAlign: "center" }}
          className="fw-bolder"
        >
          {user
            ? user.status === "owner"
              ? user.branch_name + " Store"
              : user.branch.branch_name + " Store"
            : null}{" "}
        </p>
        <p
          style={{ width: "240px", textAlign: "center" }}
          className="fw-bolder"
        >
          {user
            ? user.status === "owner"
              ? toCapitalized(user.branch_address.fullAddress)
              : toCapitalized(
                  JSON.parse(user.branch.branch_address).fullAddress
                )
            : null}
        </p>
        <p style={{ width: "240px" }} className="fw-bolder">
          Cashier:{" "}
          <span
            style={{
              borderBottom: "1px solid rgb(0, 0, 0)",
              marginLeft: "8px",
            }}
          >
            {user
              ? user.status === "owner"
                ? user.branch_owner_fname + " " + user.branch_owner_lname
                : toCapitalized(
                    user.lastname +
                      ", " +
                      user.firstname +
                      " " +
                      user.middlename
                  )
              : null}
          </span>
        </p>
        <p style={{ width: "240px" }} className="fw-bolder">
          Transaction Number:{" "}
          <span
            style={{
              borderBottom: "1px solid rgb(0, 0, 0)",
              marginLeft: "8px",
            }}
          >
            {salesId}
          </span>
        </p>
        <table style={{ width: "240px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "245px",
            }}
          >
            <p style={{ width: "81px" }} className="fw-bolder">
              Product
            </p>
            <p style={{ width: "81px" }} className="fw-bolder"></p>
            <p style={{ width: "81px" }} className="fw-bolder">
              Amount
            </p>
          </div>
          {purchase.length > 0
            ? purchase.map((data, index) => {
                return <ToFilter data={data} index={index} key={data._id} />;
              })
            : null}
          <p style={{ width: "240px", fontSize: "17px" }} className="fw-bold">
            <span className="mt-1 ml-1">
              SubTotal :{" "}
              {`₱ ${new Intl.NumberFormat().format(
                purchase.reduce(function (accumulator, currentValue) {
                  return accumulator + currentValue.total;
                }, 0)
              )}`}
            </span>
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "245px",
            }}
          >
            <p style={{ width: "81px" }} className="fw-bolder">
              Tax
            </p>
            <p style={{ width: "81px" }} className="fw-bolder"></p>
            <p style={{ width: "81px" }} className="fw-bolder">
              Amount
            </p>
          </div>
          {purchase.length > 0
            ? tax.length > 0
              ? tax.map((data, key) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "245px",
                      }}
                      key={Math.random()}
                    >
                      <p
                        style={{ width: "81px" }}
                        className="fw-bolder text-left"
                      >
                        {data.tax}
                      </p>
                      <p
                        style={{ width: "81px" }}
                        className="fw-bolder text-center"
                      >
                        ({data.percentage} %)
                      </p>
                      <p
                        style={{ width: "81px", fontSize: "17px" }}
                        className="fw-bolder text-left"
                      >{`₱ ${parseFloat(
                        parseFloat(data.percentage / 100) *
                          purchase.reduce(function (accumulator, currentValue) {
                            return accumulator + currentValue.total;
                          }, 0)
                      ).toFixed(2)} `}</p>
                    </div>
                  );
                })
              : null
            : null}
        </table>
        <p style={{ width: "245px" }} className="fw-bolder">
          <span className="mt-1 ml-3">
            <span className="text-bold">TOTAL</span> :{" ₱"}
            <span className="fw-bold">{`${new Intl.NumberFormat().format(
              getTotal()
            )}`}</span>
          </span>
        </p>
        <p style={{ width: "245px" }} className="fw-bolder">
          <span className="mt-1 ml-3">
            <span className="text-bold">Cash</span> :{" ₱"}
            <span className="fw-bold">
              {payer
                ? parseFloat(payer.deposit) >= getTotal()
                  ? new Intl.NumberFormat().format(getTotal())
                  : new Intl.NumberFormat().format(payment.payment)
                : payment.payment}
            </span>
          </span>
        </p>
        <p style={{ width: "245px" }} className="fw-bolder">
          <span className="mt-1 ml-3">
            Change :{" ₱"}
            <span className="fw-bold">{`${new Intl.NumberFormat().format(
              payment.payment - getTotal()
            )}`}</span>
          </span>
        </p>
        <div
          style={{ width: "245px", textAlign: "center" }}
          className="fw-bolder"
        >
          {new Date().toLocaleString()}
          <p
            className="fw-bolder"
            style={{ width: "245px", textAlign: "center", fontSize: "15px" }}
          >
            THANK YOU FOR YOUR PURCHASE
          </p>
        </div>
        <div style={{ width: "235px", height: "70px" }}>
          <BarcodeInformation salesId={salesId} />
        </div>
      </div>
    );
  }
);
export default ToPrintContainer;
