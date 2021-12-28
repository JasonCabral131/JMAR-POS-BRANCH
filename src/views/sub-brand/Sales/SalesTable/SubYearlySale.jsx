import React, { useState, useEffect } from "react";
import Sale2Png from "src/assets/icons/sell.gif";
import { AiOutlinePrinter, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { monthNames } from "src/reusable";
import { Chart } from "react-google-charts";
import { CDataTable, CCollapse, CCardBody } from "@coreui/react";
const SubYearlySale = ({ sales, loading, user, product }) => {
  const [salesInfo, setSalesInfo] = useState([]);
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState({ month: "", year: "" });
  const [chartState, setChartState] = useState([]);
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
  const handleGetYear = () => {
    const year = [{ value: "", label: "All" }];
    if (user) {
      const yearx = new Date(user.createdAt).getFullYear();
      for (let i = new Date().getFullYear(); i <= yearx; i++) {
        year.push({ value: i, label: i });
      }
    }
    return year;
  };
  const Print = () => {};
  const handlegetDataInChart = () => {
    let salex = [];
    let salei = [];
    sales.forEach((data) => {
      let searching = "";

      if (search.year !== "") {
        searching += search.year;
      }

      if (data.date.includes(searching)) {
        salei.push(data);
        salex.push([data.date, data.totalAmount]);
        return;
      }
      if (searching === "") {
        console.log(data.totalAmount);
        salei.push(data);
        salex.push([data.date, data.totalAmount]);
        return;
      }
    });
    setSalesInfo(salei);
    setChartState([["Daily", "Value"], ...salex]);
  };
  useEffect(() => {
    handlegetDataInChart();
    // eslint-disable-next-line
  }, [sales, search]);
  useEffect(() => {
    handlegetDataInChart();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <h1 className="header-card-information mt-5">
        <img
          alt="sales"
          src={Sale2Png}
          style={{ height: "80px", width: "250px" }}
        />
        <span>Weekly Sale Information</span>
      </h1>
      <div className="card shadow p-2 mt-2">
        <div className="print-left-info">
          {chartState.length > 1 ? (
            <AiOutlinePrinter size="25" className="hover" onClick={Print} />
          ) : null}
        </div>
        <div className="row ml-2 mb-3">
          <div className="col-md-2 percent-container">
            <label className="label-name text-left d-block">
              Filter By Month
            </label>
            <select
              name="sex"
              onChange={(e) => {
                setSearch({ ...search, month: e.target.value });
              }}
            >
              <option value="">All</option>
              {monthNames.map((data) => {
                return <option value={data}>{data}</option>;
              })}
            </select>
          </div>
          <div className="col-md-2 percent-container ml-3">
            <label className="label-name text-left d-block">
              Filter By Year
            </label>
            <select
              name="year"
              onChange={(e) => {
                setSearch({ ...search, year: e.target.value });
              }}
            >
              {handleGetYear().map((data) => {
                return <option value={data.value}>{data.label}</option>;
              })}
            </select>
          </div>
        </div>
        {chartState.length > 1 ? (
          <Chart
            width="100%"
            height="100%"
            chartType="LineChart"
            data={chartState}
            legendToggle
            options={{
              // Material design options
              chart: {
                title: "Daily Sale Product Performance",
              },
              vAxis: {
                title: "Daily Sale",
              },
              intervals: { style: "sticks" },
              legend: "none",
            }}
          />
        ) : (
          <h4 className="text-center text-danger">No Data Found</h4>
        )}
        <div className="card-body mt-2">
          <CDataTable
            items={salesInfo}
            fields={productFields}
            columnFilter={false}
            tableFilterValue={null}
            tableFilter={{ placeholder: "date (ex: 12/10/2022)" }}
            itemsPerPageSelect={true}
            itemsPerPage={5}
            hover
            sorter
            pagination
            loading={loading}
            scopedSlots={{
              show_details: (item, index) => (
                <td>
                  <div className="d-flex justify-content-center">
                    {details.includes(index) ? (
                      <AiOutlineDown
                        onClick={() => {
                          toggleDetails(index);
                        }}
                        className="hover mt-1 ml-4"
                      />
                    ) : (
                      <AiOutlineUp
                        onClick={() => {
                          toggleDetails(index);
                        }}
                        className="hover mt-1 ml-4"
                      />
                    )}
                  </div>
                </td>
              ),
              details: (item, index) => {
                return (
                  <CCollapse show={details.includes(index)}>
                    <CCardBody className={"p-2"}>
                      <h4 className="ml-2">{item.date + " List Of Sales"}</h4>
                      <div className=" card shadow p-2">
                        <div className="card-body ">
                          <table className="table table-stripe">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.products.map((prod) => {
                                return (
                                  <tr>
                                    <th>{prod.product}</th>
                                    <th>{prod.quantity}</th>
                                    <th>{prod.amount}</th>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CCardBody>
                  </CCollapse>
                );
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SubYearlySale;
const productFields = [
  { key: "date", label: "Date" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "show_details", label: "", _style: { width: "3%" } },
];
