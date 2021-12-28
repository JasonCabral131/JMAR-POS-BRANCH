import React, { useState } from "react";
import Sale2Png from "src/assets/icons/sell.gif";
import { AiOutlinePrinter } from "react-icons/ai";
import { monthNames } from "src/reusable";

const BrandYearlySale = ({ sales, loading, user, brand }) => {
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState({ month: "", year: "" });
  const [chartState, setChartState] = useState([]);
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
  return (
    <>
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
      </div>
    </>
  );
};

export default BrandYearlySale;
