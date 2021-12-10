import React from "react";
import { useBarcode } from "react-barcodes";
const BarcodeInformation = ({ salesId }) => {
  const { inputRef } = useBarcode({
    value: salesId === "" ? "Create Sales Info" : salesId,
    options: {
      background: "#fff",
    },
  });
  return (
    <div className="w-100 d-flex flex-column justify-content-center barcode_container">
      <canvas id="product-barcode-generator" ref={inputRef} />
    </div>
  );
};
const ToPrintContainer = React.forwardRef(
  ({ user, salesId, purchase, tax, getTotal, payment }, ref) => {
    const ToFilter = ({ data, index }) => {
      return (
        <tr key={data._id} className="mt-2">
          <td className="fs-4 text-center">{data.product}</td>
          <td className="fs-4 text-center ">
            ₱ {data.price} x {data.quantity}
          </td>
          <td className="fs-4 text-center">
            ₱ {new Intl.NumberFormat().format(data.total)}
          </td>
        </tr>
      );
    };
    return (
      <table ref={ref}>
        <thead>
          <tr>
            <th colSpan="3">
              <img
                src={
                  "https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1633506044/7-11_tpmbfc.png"
                }
                id="logoInfoPrint"
                alt="logo-alt-information"
              />
              <h6 id="branch-name">
                {" "}
                {user
                  ? user.status === "owner"
                    ? user.branch_name + " Store"
                    : user.Owner.branch_name + " Store"
                  : null}{" "}
              </h6>
              <h6 id="branch-name">
                (
                {user
                  ? user.status === "owner"
                    ? JSON.parse(user.branch_owner_address).fullAddress
                    : user.Owner.branch_name + " Store"
                  : null}
                )
              </h6>

              <div className="print-information">
                <h6 className="branch-cashier">
                  Cashier:{" "}
                  <span>
                    {user
                      ? user.status === "owner"
                        ? user.branch_owner_fname +
                          " " +
                          user.branch_owner_lname
                        : user.Owner.branch_name + " Store"
                      : null}
                  </span>
                </h6>
                <h6 className="branch-cashier">
                  Transaction Number: <span>{salesId}</span>
                </h6>
              </div>
            </th>
          </tr>
          <tr>
            <th>Product</th>
            <th></th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {purchase.length > 0
            ? purchase.map((data, index) => {
                return <ToFilter data={data} index={index} key={data._id} />;
              })
            : null}
          <tr>
            <th colSpan="2" className="text-right fs-6 "></th>
            <th className="text-left fs-3">
              <span className="mt-1 ml-3">
                SubTotal :{" "}
                {`₱ ${new Intl.NumberFormat().format(
                  purchase.reduce(function (accumulator, currentValue) {
                    return accumulator + currentValue.total;
                  }, 0)
                )}`}
              </span>
            </th>
          </tr>
          <tr className="pl-2">
            <th className="text-left text-dark">Tax</th>
            <th className="text-dark text-center"></th>
            <th className="text-dark text-center">Amount</th>
          </tr>
          {purchase.length > 0
            ? tax.length > 0
              ? tax.map((data, key) => {
                  return (
                    <tr key={key} className="pl-2">
                      <td className="text-left fs-5">{data.tax}</td>
                      <td className="fs-5 text-left"> {data.percentage} %</td>
                      <td className="fs-5 text-center">{`₱ ${parseFloat(
                        parseFloat(data.percentage / 100) *
                          purchase.reduce(function (accumulator, currentValue) {
                            return accumulator + currentValue.total;
                          }, 0)
                      ).toFixed(2)} `}</td>
                    </tr>
                  );
                })
              : null
            : null}
          <tr>
            <th colSpan="2" className="text-right fs-6 "></th>
            <th className="text-left fs-3">
              <span className="mt-1 ml-3">
                <span className="text-bold">TOTAL</span> :{" ₱"}
                <span className="text-muted">{`${new Intl.NumberFormat().format(
                  getTotal()
                )}`}</span>
              </span>
            </th>
          </tr>
          <tr>
            <th colSpan="2" className="text-right fs-6 "></th>
            <th className="text-left fs-3">
              <span className="mt-1 ml-3">
                <span className="text-bold">Cash</span> :{" ₱"}
                <span className="text-muted">{`${new Intl.NumberFormat().format(
                  payment.payment
                )}`}</span>
              </span>
            </th>
          </tr>
          <tr>
            <th colSpan="2" className="text-right fs-6 "></th>
            <th className="text-left fs-3">
              <span className="mt-1 ml-3">
                Change :{" ₱"}
                <span>{`${new Intl.NumberFormat().format(
                  payment.payment - getTotal()
                )}`}</span>
              </span>
            </th>
          </tr>
          <tr>
            <td colSpan="3" className="text-center fs-3 mt-4">
              {new Date().toLocaleString()}
              <h6 id="branch-name">THANK YOU FOR YOUR PURCHASE</h6>
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="text-center barcode-information-print">
              <BarcodeInformation salesId={salesId} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
);
export default ToPrintContainer;
