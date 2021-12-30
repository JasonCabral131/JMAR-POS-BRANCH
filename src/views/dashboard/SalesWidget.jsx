import React, { useState, useEffect } from "react";
import { GoGraph } from "react-icons/go";
import { GrDocumentCsv } from "react-icons/gr";

import CountUp from "react-countup";
import { CSVLink } from "react-csv";
import { VscGraphLine, VscGraph } from "react-icons/vsc";
import { MdOutlineAutoGraph } from "react-icons/md";
import { dashboardInfo, handleTodaysMonth, toCapitalized } from "src/reusable";
import { ImEye } from "react-icons/im";
import { useHistory } from "react-router-dom";
export const TodaySaleWidget = ({ sales }) => {
  const history = useHistory();
  const [csv, setCsv] = useState([["Today Sale", handleTodaysMonth()]]);
  const handleGetDailySale = () => {
    let daily = 0;
    if (sales) {
      if (sales.salesByDay) {
        daily += parseFloat(
          sales.salesByDay.reduce(
            (accum, item) => accum + parseFloat(item.total),
            0
          )
        );
      }
    }

    return parseFloat(daily);
  };

  useEffect(() => {
    if (sales) {
      setCsv([["Today Sale", handleTodaysMonth()]]);
      if (sales.salesByDay) {
        setCsv([["Today Sale", handleTodaysMonth()]]);
        for (let sale of sales.salesByDay) {
          setCsv((prev) => {
            const space = ["", ""];
            const transaction = ["Transaction ID", sale.salesId];
            const cashier = ["Cashier", dashboardInfo(sale).name];
            const status = ["Status", dashboardInfo(sale).type];
            const item = ["Items", sale.product.length];
            const producthead = ["Products", "Price", "Quantity", "Amount"];
            const product = sale.product.map((data) => {
              return [
                data.product.product,
                data.price,
                data.quantity,
                data.amount,
              ];
            });
            const total = ["", "", "Total", sale.total];

            return [
              ...prev,
              space,
              transaction,
              cashier,
              status,
              item,
              producthead,
              ...product,
              total,
            ];
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [sales]);
  return (
    <div className="sales shadow">
      <h1>
        {" "}
        <span>Today Sales</span>
      </h1>
      <div className="sale_container">
        <div className="salesx">
          ₱. &nbsp;&nbsp;
          <CountUp
            end={handleGetDailySale()}
            duration={1}
            className="sales-info"
          />
        </div>
        <div className="salesx">
          <GoGraph size={35} />
        </div>
      </div>
      <div className="w-100  p-1 d-flex">
        <div className="download-sales">
          <CSVLink
            data={csv}
            filename={`Daily Sale ( ${handleTodaysMonth()} ).csv`}
          >
            <GrDocumentCsv size="13" className="mb-1 icon" />
          </CSVLink>
        </div>
        <div
          className="download-sales"
          onClick={() => {
            history.push("/branch/sales/recent-sales-info");
          }}
        >
          <ImEye size="13" className="mb-1 icon" />
        </div>
      </div>
    </div>
  );
};
export const WeeklySaleWidget = ({ sales }) => {
  const [csv, setCsv] = useState([["Weekly Sale", handleTodaysMonth()]]);
  const handleGetWeeklySale = () => {
    let weakly = 0;
    if (sales) {
      if (sales.salesByWeek) {
        weakly += parseFloat(
          sales.salesByWeek.reduce((accum, item) => accum + item.total, 0)
        );
      }
    }
    return weakly;
  };
  useEffect(() => {
    if (sales) {
      setCsv([["Weekly Sale", handleTodaysMonth()]]);
      if (sales.salesByWeek) {
        setCsv([["Weekly Sale", handleTodaysMonth()]]);
        for (let sale of sales.salesByWeek) {
          setCsv((prev) => {
            const space = ["", ""];
            const dateCreated = [
              "Date",
              new Date(sale.createdAt).toLocaleString(),
            ];
            const transaction = ["Transaction ID", sale.salesId];
            const cashier = ["Cashier", dashboardInfo(sale).name];
            const status = ["Status", dashboardInfo(sale).type];
            const item = ["Items", sale.product.length];
            const producthead = ["Products", "Price", "Quantity", "Amount"];
            const product = sale.product.map((data) => {
              return [
                data.product.product,
                data.price,
                data.quantity,
                data.amount,
              ];
            });
            const total = ["", "", "Total", sale.total];

            return [
              ...prev,
              space,
              dateCreated,
              transaction,
              cashier,
              status,
              item,
              producthead,
              ...product,
              total,
            ];
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [sales]);
  return (
    <div className="sales shadow">
      <h1>
        {" "}
        <span>Weekly Sales </span>
      </h1>
      <div className="sale_container">
        <div className="salesx">
          ₱. &nbsp;&nbsp;
          <CountUp
            end={handleGetWeeklySale()}
            duration={1}
            className="sales-info"
          />
        </div>
        <div className="salesx">
          <VscGraphLine size={35} />
        </div>
      </div>
      <div className="w-100  p-1 d-flex">
        <div className="download-sales">
          <CSVLink
            data={csv}
            filename={`Weekly Sale ( ${handleTodaysMonth()} ).csv`}
          >
            <GrDocumentCsv size="13" className="mb-1 icon" />
          </CSVLink>
        </div>
        {/* <div className="download-sales">
          <AiOutlineFilePdf size="13" className="mb-1 icon" />
        </div> */}
      </div>
    </div>
  );
};
export const MonthlySaleWidget = ({ sales }) => {
  const [csv, setCsv] = useState([["Monthly Sale", handleTodaysMonth()]]);
  const handleGetMonthSale = () => {
    let monthly = 0;
    if (sales) {
      if (sales.salesByMonth) {
        monthly += parseFloat(
          sales.salesByMonth.reduce((accum, item) => accum + item.total, 0)
        );
      }
    }
    return monthly;
  };
  useEffect(() => {
    if (sales) {
      setCsv([["Monthly Sale", handleTodaysMonth()]]);
      if (sales.salesByWeek) {
        setCsv([["Monthly Sale", handleTodaysMonth()]]);
        for (let sale of sales.salesByMonth) {
          setCsv((prev) => {
            const space = ["", ""];
            const dateCreated = [
              "Date",
              new Date(sale.createdAt).toLocaleString(),
            ];
            const transaction = ["Transaction ID", sale.salesId];
            const cashier = ["Cashier", dashboardInfo(sale).name];
            const status = ["Status", dashboardInfo(sale).type];
            const item = ["Items", sale.product.length];
            const producthead = ["Products", "Price", "Quantity", "Amount"];
            const product = sale.product.map((data) => {
              return [
                data.product.product,
                data.price,
                data.quantity,
                data.amount,
              ];
            });
            const total = ["", "", "Total", sale.total];

            return [
              ...prev,
              space,
              dateCreated,
              transaction,
              cashier,
              status,
              item,
              producthead,
              ...product,
              total,
            ];
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [sales]);
  return (
    <div className="sales shadow">
      <h1>
        <span>Monthly Sales </span>
      </h1>
      <div className="sale_container">
        <div className="salesx">
          ₱. &nbsp;&nbsp;
          <CountUp
            end={handleGetMonthSale()}
            duration={1}
            className="sales-info"
          />
        </div>
        <div className="salesx">
          <MdOutlineAutoGraph size={35} />
        </div>
      </div>
      <div className="w-100  p-1 d-flex">
        <div className="download-sales">
          <CSVLink
            data={csv}
            filename={`Monthly Sale ( ${handleTodaysMonth()} ).csv`}
          >
            <GrDocumentCsv size="13" className="mb-1 icon" />
          </CSVLink>
        </div>
        {/* <div className="download-sales">
          <AiOutlineFilePdf size="13" className="mb-1 icon" />
        </div> */}
      </div>
    </div>
  );
};
export const YearlySaleWidget = ({ sales }) => {
  const handleGetYearSale = () => {
    let yearly = 0;
    if (sales) {
      if (sales.salesByYear) {
        yearly += parseFloat(
          sales.salesByYear.reduce((accum, item) => accum + item.total, 0)
        );
      }
    }
    return yearly;
  };
  return (
    <div className="sales shadow">
      <h1>
        <span>Yearly Sales</span>
      </h1>
      <div className="sale_container">
        <div className="salesx">
          ₱. &nbsp;&nbsp;
          <CountUp
            end={handleGetYearSale()}
            duration={1}
            className="sales-info"
          />
        </div>
        <div className="salesx">
          <VscGraph size={35} />
        </div>
      </div>
      <div className="w-100  p-1 d-flex">
        <div className="download-sales">
          <GrDocumentCsv size="13" className="mb-1 icon" />
        </div>
        {/* <div className="download-sales">
          <AiOutlineFilePdf size="13" className="mb-1 icon" />
        </div> */}
      </div>
    </div>
  );
};

export const InformationTransact = ({ item }) => {
  const handleInformation = () => {
    if (item.cashier) {
      return {
        name: toCapitalized(
          item.cashier.lastname +
            ", " +
            item.cashier.firstname +
            " " +
            item.cashier.middlename
        ),
        url: item.cashier.profile.url,
        type: "Cashier",
      };
    }
    if (item.branch) {
      return {
        name: toCapitalized(
          item.branch.branch_owner_lname +
            ", " +
            item.branch.branch_owner_fname +
            " " +
            item.branch.branch_owner_MI
        ),
        url: item.branch.branch_owner_profile.profile,
        type: "owner",
      };
    }
  };
  return (
    <div className="d-flex">
      <img
        src={handleInformation().url}
        alt="profile"
        style={{ width: "25px", height: "25px" }}
      />
      <div className="d-flex  ml-2">
        <p>{handleInformation().name}</p>
        <p
          className={`badge badge-pill p-2 bg-${
            handleInformation().type === "owner" ? "success" : "warning"
          } ml-2`}
        >
          {" "}
          {handleInformation().type}
        </p>
      </div>
    </div>
  );
};
