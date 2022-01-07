import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import { CDataTable, CCollapse } from "@coreui/react";
import { useDispatch } from "react-redux";
import { getSales } from "src/redux/action";
import WeekLySale from "./WeekSale";
import { WeeklySaleWidget } from "./SalesWidget";
import { MonthlySaleWidget } from "./SalesWidget";
import { YearlySaleWidget } from "./SalesWidget";
import { TodaySaleWidget } from "./SalesWidget";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { monthNames, numberFormat, toCapitalized } from "src/reusable";
import moment from "moment";
import { InformationTransact } from "./SalesWidget";
const fields = [
  { key: "salesId", _style: { width: "10%" }, label: "Transaction ID" },

  { key: "total", _style: { width: "10%" } },
  { key: "time", _style: { width: "15%" }, label: "Time" },

  { key: "transaction", _style: { width: "25%" }, label: "Transaction" },
  {
    key: "show_details",
    label: "Details",
    _style: { width: "1%" },
    sorter: false,
    filter: false,
  },
];
const Dashboard = () => {
  const dispatch = useDispatch();
  const [sales, setSales] = useState(null);
  const [details, setDetails] = useState([]);
  const handleFetchData = async () => {
    const res = await dispatch(getSales());
    if (res.result) {
      setSales(res.POS);
    }
  };
  useEffect(() => {
    handleFetchData();

    // eslint-disable-next-line
  }, []);

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  return (
    <>
      <div className="fluid-container">
        <div className="card-body sales_container">
          <TodaySaleWidget sales={sales} />
          <WeeklySaleWidget sales={sales} />
          <MonthlySaleWidget sales={sales} />
          <YearlySaleWidget sales={sales} />
        </div>
        <div className="weaklySale_container card shadow">
          <WeekLySale sales={sales} />
        </div>
        <div className="informationSale  mt-1 ">
          <div className="info card shadow p-2">
            <h1 className="cashier-label ml-2">
              <span>Today's Sales</span>
            </h1>
            <CDataTable
              items={sales ? sales.salesByDay : []}
              fields={fields}
              footer
              itemsPerPageSelect={true}
              itemsPerPage={5}
              hover
              sorter
              pagination
              scopedSlots={{
                show_details: (item, index) => {
                  return (
                    <td className="py-2 text-right">
                      {details.includes(index) ? (
                        <AiOutlineArrowDown
                          onClick={() => {
                            toggleDetails(index);
                          }}
                          className="hover"
                        />
                      ) : (
                        <AiOutlineArrowUp
                          onClick={() => {
                            toggleDetails(index);
                          }}
                          className="hover"
                        />
                      )}
                    </td>
                  );
                },
                time: (item) => (
                  <td>
                    <div className="text-center">
                      <p>{moment(new Date(item.createdAt)).fromNow()} </p>
                    </div>
                  </td>
                ),
                transaction: (item) => (
                  <td>
                    <InformationTransact item={item} />
                  </td>
                ),
                details: (item, index) => {
                  return (
                    <CCollapse show={details.includes(index)}>
                      <div className="container p-1">
                        <div className="card shadow p-2">
                          <table className="table table-borderless">
                            <thead>
                              <tr>
                                <td>Product</td>
                                <td>Price</td>
                                <td>Quantity</td>
                                <td>Amount</td>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(item.product)
                                ? item.product.map((data) => {
                                    return (
                                      <tr key={data._id}>
                                        <td>
                                          <div className="text-left">
                                            <p>{data.product.product}</p>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-left">
                                            <p>
                                              {" "}
                                              ₱. &nbsp;&nbsp;{" "}
                                              {numberFormat(data.product.price)}
                                            </p>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-left">
                                            <p>{data.quantity}</p>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="text-left">
                                            <p>
                                              {" "}
                                              ₱. &nbsp;&nbsp;{" "}
                                              {numberFormat(data.amount)}
                                            </p>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })
                                : null}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CCollapse>
                  );
                },
              }}
            />
          </div>
          <div className="info">
            <h1 className="cashier-label">Cashier Monthly's Sales</h1>
            <h2 className="cashier-month">{`${
              monthNames[new Date().getMonth()]
            } ${new Date().getFullYear()} `}</h2>
            <table className="table ">
              <thead>
                <tr>
                  <td>Name</td>
                  <td className="text-right">Sales</td>
                </tr>
              </thead>
              <tbody>
                {sales
                  ? Array.isArray(sales.CashierSale)
                    ? sales.CashierSale.map((data) => {
                        return (
                          <tr key={data._id}>
                            <td>
                              <div className="d-flex cashier_container_sales">
                                <img
                                  alt="cashier-profile"
                                  src={data.profile.url}
                                />
                                <h1>
                                  {toCapitalized(
                                    data.firstname +
                                      " " +
                                      data.middlename +
                                      " " +
                                      data.lastname
                                  )}
                                </h1>
                              </div>
                            </td>
                            <td className="text-right">
                              {" "}
                              ₱. &nbsp;&nbsp;{" "}
                              {data.salesByMonth.reduce(
                                (accum, item) => accum + item.total,
                                0
                              )}
                            </td>
                          </tr>
                        );
                      })
                    : null
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
