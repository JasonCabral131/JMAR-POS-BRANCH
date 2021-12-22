import React, { useState, useEffect } from "react";
import { GoGraph } from "react-icons/go";
import { GrDocumentCsv } from "react-icons/gr";

import CountUp from "react-countup";
import { CSVLink } from "react-csv";
import { VscGraphLine, VscGraph } from "react-icons/vsc";
import { MdOutlineAutoGraph } from "react-icons/md";
import {
  dashboardInfo,
  getWeekOfMonth,
  handleTodaysMonth,
  monthNames,
} from "src/reusable";
export const CashieryTodaySale = ({ sales }) => {
  const [csv, setCsv] = useState([["Today Sale", handleTodaysMonth()]]);
  const [total, setTotal] = useState(0);
  const handleGetDailySale = () => {
    if (sales) {
      if (sales.salesByDay) {
        const today = new Date().toLocaleDateString();
        const saleToday = sales.salesByDay.filter(
          (data) => data.date.toString() === today.toString()
        );
        if (saleToday.length < 1) {
          setTotal(0);
          return;
        } else {
          for (let sale of saleToday[0].data) {
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
          setTotal(saleToday[0].totalAmount);
        }
      }
    }
  };
  useEffect(() => {
    handleGetDailySale();
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
          <CountUp end={total} duration={1} className="sales-info" />
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
            {csv.length > 1 ? (
              <GrDocumentCsv size="13" className="mb-1 icon" />
            ) : null}
          </CSVLink>
        </div>
        {/* <div className="download-sales">
        <AiOutlineFilePdf size="13" className="mb-1 icon" />
      </div> */}
      </div>
    </div>
  );
};

export const CashierWeeklySale = ({ sales }) => {
  const [csv, setCsv] = useState([["Daily Sale", handleTodaysMonth()]]);
  const [total, setTotal] = useState(0);
  const handleGetDailySale = () => {
    if (sales) {
      if (sales.salesByWeek) {
        const WeekSale = sales.salesByWeek.filter(
          (data) => data.date === getWeekOfMonth(new Date())
        );

        if (WeekSale.length > 0) {
          for (let sale of WeekSale[0].datax) {
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
          setTotal(WeekSale[0].totalAmount);
          return;
        }
      }
    }
  };
  useEffect(() => {
    handleGetDailySale();
    // eslint-disable-next-line
  }, [sales]);
  return (
    <div className="sales shadow">
      <h1>
        {" "}
        <span>WEEKLY SALES</span>
      </h1>
      <div className="sale_container">
        <div className="salesx">
          ₱. &nbsp;&nbsp;
          <CountUp end={total} duration={1} className="sales-info" />
        </div>
        <div className="salesx">
          <MdOutlineAutoGraph size={35} />
        </div>
      </div>
      <div className="w-100  p-1 d-flex">
        <div className="download-sales">
          <CSVLink
            data={csv}
            filename={`Weekly Sale ( ${handleTodaysMonth()} ).csv`}
          >
            {csv.length > 1 ? (
              <GrDocumentCsv size="13" className="mb-1 icon" />
            ) : null}
          </CSVLink>
        </div>
        {/* <div className="download-sales">
        <AiOutlineFilePdf size="13" className="mb-1 icon" />
      </div> */}
      </div>
    </div>
  );
};
export const CashierMonthlySale = ({ sales }) => {
  const [csv, setCsv] = useState([["Daily Sale", handleTodaysMonth()]]);
  const [total, setTotal] = useState(0);
  const handleGetDailySale = () => {
    if (sales) {
      if (sales.salesbyMonth) {
        const month = sales.salesbyMonth.filter(
          (data) =>
            data.date ===
            `${monthNames[new Date().getMonth()]}/${new Date().getFullYear()}`
        );
        if (month.length > 0) {
          setTotal(month[0].totalAmount);
          for (let sale of month[0].datax) {
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
          return;
        }
      }
    }
  };
  useEffect(() => {
    handleGetDailySale();
    // eslint-disable-next-line
  }, [sales]);
  return (
    <div className="sales shadow">
      <h1>
        {" "}
        <span>Monthly SALES</span>
      </h1>
      <div className="sale_container">
        <div className="salesx">
          ₱. &nbsp;&nbsp;
          <CountUp end={total} duration={1} className="sales-info" />
        </div>
        <div className="salesx">
          <VscGraphLine size={35} />
        </div>
      </div>
      <div className="w-100  p-1 d-flex">
        <div className="download-sales">
          <CSVLink
            data={csv}
            filename={`Monthly Sale ( ${handleTodaysMonth()} ).csv`}
          >
            {csv.length > 1 ? (
              <GrDocumentCsv size="13" className="mb-1 icon" />
            ) : null}
          </CSVLink>
        </div>
        {/* <div className="download-sales">
        <AiOutlineFilePdf size="13" className="mb-1 icon" />
      </div> */}
      </div>
    </div>
  );
};
export const CashierYearlySale = ({ sales }) => {
  const [csv, setCsv] = useState([["Daily Sale", handleTodaysMonth()]]);
  const [total, setTotal] = useState(0);
  const handleGetDailySale = () => {
    if (sales) {
      if (sales.salesbyYearly) {
        const yearly = sales.salesbyYearly.filter(
          (data) => data.date === `${new Date().getFullYear()}`
        );
        if (yearly.length > 0) {
          for (let sale of yearly[0].datax) {
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
          setTotal(yearly[0].totalAmount);
          return;
        }
      }
    }
  };
  useEffect(() => {
    handleGetDailySale();
    // eslint-disable-next-line
  }, [sales]);
  return (
    <div className="sales shadow">
      <h1>
        {" "}
        <span>Yearly SALES</span>
      </h1>
      <div className="sale_container">
        <div className="salesx">
          ₱. &nbsp;&nbsp;
          <CountUp end={total} duration={1} className="sales-info" />
        </div>
        <div className="salesx">
          <VscGraph size={35} />
        </div>
      </div>
      <div className="w-100  p-1 d-flex">
        <div className="download-sales">
          <CSVLink
            data={csv}
            filename={`Yearly Sale ( ${handleTodaysMonth()} ).csv`}
          >
            {csv.length > 1 ? (
              <GrDocumentCsv size="13" className="mb-1 icon" />
            ) : null}
          </CSVLink>
        </div>
        {/* <div className="download-sales">
        <AiOutlineFilePdf size="13" className="mb-1 icon" />
      </div> */}
      </div>
    </div>
  );
};
export const dailyFields = [
  { key: "date", label: "Date", _style: { width: "45%" } },
  { key: "totalAmount", label: "Sales", _style: { width: "45%" } },
  {
    key: "show_details",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];
export const WeeklyFields = [
  { key: "date", label: "Weekly", _style: { width: "45%" } },
  { key: "totalAmount", label: "Total Amount", _style: { width: "45%" } },
  {
    key: "show_details",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];
export const MonthlyFields = [
  { key: "date", label: "Monthly Sale", _style: { width: "45%" } },
  { key: "totalAmount", label: "Total Amount", _style: { width: "45%" } },
  {
    key: "show_details",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];
export const YearlyFields = [
  { key: "date", label: "Yearly Sale", _style: { width: "45%" } },
  { key: "totalAmount", label: "Total Amount", _style: { width: "45%" } },
  {
    key: "show_details",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];
