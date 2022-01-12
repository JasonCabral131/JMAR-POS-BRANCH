import React, { useState, useEffect } from "react";
import Sale2Png from "src/assets/icons/sell.gif";

import { Chart } from "react-google-charts";
import { CDataTable } from "@coreui/react";
import { useSelector } from "react-redux";
const YearlySale = ({ user }) => {
  const [search, setSearch] = useState({ month: "", year: "" });
  const { sales, loading } = useSelector((state) => state.sales);
  const [chartState, setChartState] = useState([]);
  const [salesInfo, setSalesInfo] = useState([]);
  const handleGetYear = () => {
    const year = [{ value: "", label: "All" }];
    if (user) {
      const yearx = new Date(user.createdAt).getFullYear();
      for (let i = yearx; i <= new Date().getFullYear(); i++) {
        year.push({ value: i, label: i });
      }
    }
    return year;
  };
  const handlegetDataInChart = () => {
    let salex = [];
    let salei = [];
    if (sales) {
      if (sales.salesYearlyTotal) {
        sales.salesYearlyTotal.forEach((data) => {
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
        setChartState([["Yearly", "Value"], ...salex]);
      }
    }
  };
  useEffect(() => {
    handlegetDataInChart();
    // eslint-disable-next-line
  }, [sales, search]);
  useEffect(() => {
    handlegetDataInChart();
    // eslint-disable-next-line
  }, []);
  // const Print = () => {};
  return (
    <div className="w-100">
      <h1 className="header-card-information mt-5">
        <img
          alt="sales"
          src={Sale2Png}
          style={{ height: "80px", width: "250px" }}
        />
        <span>Yearly Sale Information</span>
      </h1>
      <div className="card shadow p-2 mt-2">
        <div className="print-left-info">
          {/* {chartState.length > 1 ? (
            <AiOutlinePrinter size="25" className="hover" onClick={Print} />
          ) : null} */}
        </div>
        <div className="row ml-2 mb-3">
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
            width={"100%"}
            height={"400px"}
            chartType="ColumnChart"
            data={chartState}
            legendToggle
            options={{
              // Material design options
              chart: {
                title: "Annual Sale  Performance",
              },
              vAxis: {
                title: "Annual",
              },
              is3D: true,
            }}
          />
        ) : (
          <h4 className="text-center text-danger">No Data Found</h4>
        )}
        <div className="card-body mt-2">
          <CDataTable
            items={salesInfo
              .slice(0)
              .reverse()
              .map((data) => data)}
            fields={productFields}
            columnFilter={false}
            tableFilterValue={null}
            tableFilter={{ placeholder: "date (ex: 2021" }}
            itemsPerPageSelect={true}
            itemsPerPage={5}
            hover
            sorter
            pagination
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default YearlySale;
const productFields = [
  { key: "date", label: "Year" },
  { key: "totalAmount", label: "Total Amount" },
];
