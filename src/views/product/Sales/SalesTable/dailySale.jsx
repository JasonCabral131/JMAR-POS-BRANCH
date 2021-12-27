import React, { useState, useEffect } from "react";
import { CDataTable } from "@coreui/react";
import Sale2Png from "src/assets/icons/sell.gif";
import { AiOutlinePrinter } from "react-icons/ai";
import { monthNames } from "src/reusable";
import { Chart } from "react-google-charts";

export const ProductDailySale = ({ sales, loading, user }) => {
  const [search, setSearch] = useState({ month: "", year: "" });
  const [salesInfo, setSalesInfo] = useState([]);
  const [chartState, setChartState] = useState([]);
  const Print = () => {};
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
  const handlegetDataInChart = () => {
    let salex = [];
    let salei = [];
    sales.forEach((data) => {
      const spliting = data.date.split("/");
      let searching = "";
      if (search.month !== "") {
        searching += search.month + "/" + spliting[1];
      }
      if (search.year !== "") {
        searching += "/" + search.year;
      }
      if (data.date.toLocaleLowerCase().includes(searching)) {
        salei.push(data);
        salex.push([data.date, data.totalAmount, data.totalQuantity]);
        return;
      }
      if (searching === "") {
        salei.push(data);
        salex.push([data.date, data.totalAmount, data.totalQuantity]);
        return;
      }
    });
    setSalesInfo(salei);
    setChartState([["Daily", "Value", "Quantity"], ...salex]);
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
        <span>Daily Sale Information</span>
      </h1>
      <div className="card shadow p-2 mt-2">
        <div className="print-left-info">
          <AiOutlinePrinter size="25" className="hover" onClick={Print} />
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
              {monthNames.map((data, index) => {
                return <option value={index + 1}>{data}</option>;
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
            chartType="Bar"
            data={chartState}
            legendToggle
            options={{
              // Material design options
              chart: {
                title: "Daily Sale",
              },
              vAxis: {
                title: "Daily Sale",
              },
              series: {
                0: { curveType: "function" },
              },
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
          />
        </div>
      </div>
    </>
  );
};

const productFields = [
  { key: "date", label: "Date" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "totalQuantity", label: "Total Quantity" },
];
