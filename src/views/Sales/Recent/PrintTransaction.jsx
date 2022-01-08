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
    <div className="w-100 d-flex flex-column justify-content-center barcode_container">
      <canvas id="product-barcode-generator" ref={inputRef} />
    </div>
  );
};
const PrintTransaction = React.forwardRef(({ transaction, user }, ref) => {
  const ToFilter = ({ data, index }) => {
    return (
      <tr key={Math.random()} className="mt-2">
        <td className="fs-4 text-center">{data.product.product}</td>
        <td className="fs-4 text-center ">
          ₱ {data.price} x {data.quantity}
        </td>
        <td className="fs-4 text-center">
          ₱ {new Intl.NumberFormat().format(data.amount)}
        </td>
      </tr>
    );
  };
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
    <table ref={ref}>
      <thead>
        <tr>
          <th colSpan="3">
            <img src={logo} id="logoInfoPrint" alt="logo-alt-information" />
            <h6 id="branch-name">
              {" "}
              {user ? user.branch_name + " Store" : null}{" "}
            </h6>
            <h6 id="branch-name">
              {user
                ? toCapitalized(
                    JSON.parse(user.branch_owner_address).fullAddress
                  )
                : null}
            </h6>
            <div className="print-information">
              <h6 className="branch-cashier">
                Cashier: <span>{dashboardInfo(transaction).name}</span>
              </h6>
              <h6 className="branch-cashier">
                Transaction Number: <span>{transaction?.salesId}</span>
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
        {transaction?.product.length > 0
          ? transaction?.product.map((data, index) => {
              return <ToFilter data={data} index={index} key={data._id} />;
            })
          : null}
        <tr>
          <th colSpan="2" className="text-right fs-6 "></th>
          <th className="text-left fs-3">
            <span className="mt-1 ml-3">
              SubTotal : {`₱ ${new Intl.NumberFormat().format(subTotal())}`}
            </span>
          </th>
        </tr>
        <tr className="pl-2">
          <th className="text-left text-dark">Tax</th>
          <th className="text-dark text-center"></th>
          <th className="text-dark text-center">Amount</th>
        </tr>
        {transaction?.product.length > 0
          ? transaction?.taxs.length > 0
            ? transaction?.taxs.map((data, key) => {
                return (
                  <tr key={key} className="pl-2">
                    <td className="text-left fs-5">
                      {data.tax} ({data.percentage} %)
                    </td>
                    <td className="fs-5 text-left"> </td>
                    <td className="fs-5 text-center">{`₱ ${data.amount} `}</td>
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
                transaction?.payment
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
                transaction?.payment - getTotal()
              )}`}</span>
            </span>
          </th>
        </tr>
        <tr>
          <td colSpan="3" className="text-center fs-3 mt-4">
            {new Date(transaction?.createdAt).toLocaleString()}
            <h6 id="branch-name">THANK YOU FOR YOUR PURCHASE</h6>
          </td>
        </tr>
        <tr>
          <td colSpan="3" className="text-center barcode-information-print">
            <BarcodeInformation salesId={transaction?.salesId} />
          </td>
        </tr>
      </tbody>
    </table>
  );
});

export default PrintTransaction;
