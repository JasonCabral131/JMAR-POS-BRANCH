import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { dashboardInfo } from "src/reusable";
import { AiOutlinePrinter } from "react-icons/ai";
import "./style.scss";
import { IoSearchOutline } from "react-icons/io5";
import moment from "moment";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import PrintTransaction from "./PrintTransaction";
import { useReactToPrint } from "react-to-print";
const RecentSale = () => {
  const [search, setSearch] = useState("");
  const { sales } = useSelector((state) => state.sales);

  return (
    <div className="w-100 " style={{ position: "relative" }}>
      {sales ? (
        sales.salesByDay.length > 0 ? (
          <>
            <div className="w-100 ">
              <div className="col-md-4">
                <div className="percent-container mt-1">
                  <input
                    type="number"
                    min="0"
                    value={search}
                    id="searchProduct-counter"
                    className="icon-no-right no-capitalized"
                    placeholder="Transaction Id"
                    onChange={(e) => setSearch(e.target.value)}
                    onPaste={(e) => {
                      const data = e.clipboardData.getData("Text");
                      if (!isNaN(data)) {
                        if (data < 0) {
                          e.preventDefault();
                        }
                      } else {
                        e.preventDefault();
                      }
                    }}
                  />

                  <IoSearchOutline
                    name="searchProduct"
                    size={25}
                    className="home-signup-iconx hover"
                  />
                </div>
              </div>
            </div>
            <div className="w-100">
              {sales.salesByDay.map((item) => {
                if (search !== "") {
                  if (
                    item.salesId
                      .toLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ) {
                    return <SalesInfo item={item} key={Math.random()} />;
                  } else {
                    return null;
                  }
                } else {
                  return <SalesInfo item={item} key={Math.random()} />;
                }
              })}
            </div>
            {search !== "" ? (
              sales.salesByDay.filter((sale) =>
                sale.salesId
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase())
              ).length < 1 ? (
                <h1 className="text-center text-danger" key={Math.random()}>
                  No Data Found
                </h1>
              ) : null
            ) : null}
          </>
        ) : (
          <h1 className="text-center text-danger" key={Math.random()}>
            No Sale For Today
          </h1>
        )
      ) : (
        <h1 className="text-center text-danger" key={Math.random()}>
          No Sale For Today
        </h1>
      )}
    </div>
  );
};

export default RecentSale;

export const SalesInfo = ({ item }) => {
  const transRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const Print = useReactToPrint({
    content: () => transRef.current,
  });

  return (
    <div className="w-100 row mt-2 p-2 border">
      <div className="text-right">
        {moment(new Date(item.createdAt)).fromNow()}
        <MdOutlineHistoryToggleOff />
      </div>
      <div className="col-md-12 p-1 recent-cashier-info d-flex">
        <img alt="avatar cashier" src={dashboardInfo(item).url} />
        <div className="d-block ml-2">
          <h1 className="d-block name-recent">{dashboardInfo(item).name}</h1>
          <div className="badge badge-pills bg-success p-2">
            {dashboardInfo(item).type}
          </div>
        </div>
      </div>

      <div className="card shadow mt-1 p-2">
        <div className="print-left-info">
          <AiOutlinePrinter size="25" className="hover" onClick={Print} />
        </div>
        <div className="table-responsive">
          <h6>
            {" "}
            <span className="fw-bolder">Transaction ID</span> : {item.salesId}
          </h6>
          <h6>Items : {item.product.length}</h6>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {item.product.map((prod) => {
                return (
                  <tr key={prod._id}>
                    <th>{prod.product.product}</th>
                    <th>{prod.price}</th>
                    <th>{prod.quantity}</th>
                    <th>{prod.amount}</th>
                  </tr>
                );
              })}
              <tr>
                <th colSpan="3" className="text-right ">
                  <span className="mt-1">SubTotal :</span>
                </th>
                <th className="text-left ">{`₱ ${new Intl.NumberFormat().format(
                  item.total
                )}`}</th>
              </tr>
              <tr>
                <th colSpan="2" className="text-left fs-6 text-dark">
                  Tax
                </th>
                <th className="fs-6 text-dark text-center"></th>
                <th className="fs-6 text-dark">Amount</th>
              </tr>
              {item.taxs.map((tax) => {
                return (
                  <tr key={tax._id}>
                    <th colSpan="2" className="text-left fs-6 text-dark">
                      {tax.tax} ( {tax.percentage} %)
                    </th>
                    <th className="fs-6 text-dark text-center"></th>
                    <th className="fs-6 text-dark">{tax.amount}</th>
                  </tr>
                );
              })}
              <tr>
                <th colSpan="3" className="text-right ">
                  <span className="mt-1">Total :</span>
                </th>
                <th className="text-left ">{`₱ ${new Intl.NumberFormat().format(
                  Math.round(
                    (item.total +
                      item.taxs.reduce(
                        (accum, item) =>
                          parseFloat(accum) + parseFloat(item.amount),
                        0.0
                      ) +
                      Number.EPSILON) *
                      100
                  ) / 100
                )}`}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-none">
        <PrintTransaction transaction={item} user={user} ref={transRef} />
      </div>
    </div>
  );
};
