import React from "react";
import { useBarcode } from "react-barcodes";
import { dashboardInfo, toCapitalized } from "src/reusable";
import logo from "src/assets/icons/Jarm_Logo.svg";
import "src/views/counter/counter.scss";
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
const PrintTransaction = React.forwardRef(({ transaction, user }, ref) => {
  const subTotal = () => {
    if (transaction) {
      const subTotal = transaction?.product.reduce(function (
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.amount);
      },
      0);
      const subTotalx =
        Math.round((parseFloat(subTotal) + Number.EPSILON) * 100) / 100;
      return subTotalx;
    }
    return 0;
  };
  const getTotal = () => {
    if (transaction) {
      const taxes = transaction?.taxs.reduce(function (
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.amount);
      },
      0);
      const taxesx =
        Math.round((parseFloat(taxes) + Number.EPSILON) * 100) / 100;
      return subTotal() + taxesx;
    }
    return 0;
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
      <p style={{ width: "240px", textAlign: "center" }} className="fw-bolder">
        {" "}
        {user
          ? user.status === "owner"
            ? user.branch_name + " Store"
            : user.branch.branch_name + " Store"
          : null}{" "}
      </p>
      <p style={{ width: "240px", textAlign: "center" }} className="fw-bolder">
        {user
          ? toCapitalized(
              user.status === "owner"
                ? toCapitalized(user.branch_address.fullAddress)
                : toCapitalized(
                    JSON.parse(user.branch.branch_address).fullAddress
                  )
            )
          : null}
      </p>
      <p style={{ width: "240px" }} className="fw-bolder">
        Cashier:{" "}
        <span
          style={{ borderBottom: "1px solid rgb(0, 0, 0)", marginLeft: "8px" }}
        >
          {dashboardInfo(transaction).name}
        </span>
      </p>
      <p style={{ width: "240px" }} className="fw-bolder">
        Transaction Number:{" "}
        <span
          style={{ borderBottom: "1px solid rgb(0, 0, 0)", marginLeft: "8px" }}
        >
          {transaction?.salesId}
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
        {transaction?.product.length > 0
          ? transaction?.product.map((data, index) => {
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
                    {data.product.product}
                  </p>
                  <p style={{ width: "81px" }} className="fw-bold">
                    {" "}
                    {data.price} x {data.quantity}
                  </p>
                  <p
                    style={{ width: "81px", fontSize: "17px" }}
                    className="fw-bold"
                  >
                    {" "}
                    ₱{" "}
                    {Math.round(
                      (parseFloat(data.amount) + Number.EPSILON) * 100
                    ) / 100}
                  </p>
                </div>
              );
              // <ToFilter data={data} index={index} key={data._id} />);
            })
          : null}
        <p style={{ width: "240px", fontSize: "17px" }} className="fw-bold">
          <span className="mt-1 ml-1">
            SubTotal : {`₱ ${new Intl.NumberFormat().format(subTotal())}`}
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
        {transaction?.product.length > 0
          ? transaction?.taxs.length > 0
            ? transaction?.taxs.map((data, key) => {
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
                    >
                      ₱{". "}
                      {Math.round(
                        (parseFloat(data.amount) + Number.EPSILON) * 100
                      ) / 100}
                    </p>
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
          <span className="fw-bold">{`${new Intl.NumberFormat().format(
            transaction?.payment
          )}`}</span>
        </span>
      </p>
      <p style={{ width: "245px" }} className="fw-bolder">
        <span className="mt-1 ml-3">
          Change :{" ₱"}
          <span className="fw-bold">{`${new Intl.NumberFormat().format(
            transaction?.payment - getTotal()
          )}`}</span>
        </span>
      </p>
      <div
        style={{ width: "245px", textAlign: "center" }}
        className="fw-bolder"
      >
        {new Date(transaction?.createdAt).toLocaleString()}
        <p
          className="fw-bolder"
          style={{ width: "245px", textAlign: "center", fontSize: "15px" }}
        >
          THANK YOU FOR YOUR PURCHASE
        </p>
      </div>
      <div style={{ width: "235px", height: "70px" }}>
        <BarcodeInformation salesId={transaction?.salesId} />
      </div>
    </div>
  );
});

export default PrintTransaction;
