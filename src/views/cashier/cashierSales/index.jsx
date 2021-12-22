import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getCashierSale } from "src/redux/action";
import { LoaderSpinner, toCapitalized } from "src/reusable";
import {
  CashierMonthlySale,
  CashierWeeklySale,
  CashierYearlySale,
  CashieryTodaySale,
} from "./salesWidget";
import "./style.scss";
import DailySaleInfo from "./Sales/DailySales";
import dLogo from "src/assets/icons/Daily.gif";
import wLogo from "src/assets/icons/wlogo.gif";
import mLogo from "src/assets/icons/Monthly.gif";
import yLogo from "src/assets/icons/yearly.gif";
import WeeklySaleInfo from "./Sales/WeeklySale";
import MonthlySaleInfo from "./Sales/MonthlySale";
import YearlySaleInfo from "./Sales/YearlySale";
const CashierSales = (props) => {
  const { cashierId } = useParams();
  const dispatch = useDispatch();
  const [cinfo, setCashierInfo] = useState(null);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sData, setSData] = useState({
    daily: true,
    weekly: false,
    monthly: false,
    yearly: false,
  });
  const handleGetCashier = async () => {
    setLoading(true);
    const res = await dispatch(getCashierSale({ cashier: cashierId }));
    setLoading(false);
    if (res.result) {
      setCashierInfo(res.cashier);
      const element = document.querySelector("ol.breadcrumb > li.active");
      element.innerHTML = toCapitalized(
        `${res.cashier.firstname} ${res.cashier.middlename} ${res.cashier.lastname} Sales Information`
      );
      setSales(res.POS);
    }
  };
  useEffect(() => {
    handleGetCashier();
    // eslint-disable-next-line
  }, [cashierId]);
  useEffect(() => {
    handleGetCashier();
    // eslint-disable-next-line
  }, []);

  return loading ? (
    <div className="w-100 p-4 mt-5">
      <LoaderSpinner height={"400px"} />
    </div>
  ) : cinfo ? (
    <div style={{ position: "relative", width: "100%" }}>
      <div className="row">
        <div className="col-md-2">
          <div className="w-100 p-2 d-flex justify-content-center flex-column align-items-center">
            <img
              alt="profile"
              src={cinfo.profile.url}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "100%",
              }}
            />
            <h6 className="mt-2 text-center" style={{ color: "#b0b0b0" }}>
              {toCapitalized(
                `${cinfo.firstname} ${cinfo.middlename} ${cinfo.lastname}`
              )}
            </h6>
          </div>
        </div>
        <div className="col-md-10">
          <div className="sales_container">
            <CashieryTodaySale sales={sales} />
            <CashierWeeklySale sales={sales} />
            <CashierMonthlySale sales={sales} />
            <CashierYearlySale sales={sales} />
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-3 p-1  d-flex justify-content-center">
          <img
            alt="d logo"
            src={dLogo}
            style={{ width: "95%", height: "150px" }}
            className={` hover-red shadow ${sData.daily ? "a-s-f" : ""}`}
            onClick={() => {
              setSData({
                daily: true,
                weekly: false,
                monthly: false,
                yearly: false,
              });
            }}
          />
        </div>
        <div className="col-md-3 p-1  d-flex justify-content-center">
          <img
            alt="w logo"
            src={wLogo}
            style={{ width: "95%", height: "150px" }}
            className={` hover-red shadow ${sData.weekly ? "a-s-f" : ""}`}
            onClick={() => {
              setSData({
                daily: false,
                weekly: true,
                monthly: false,
                yearly: false,
              });
            }}
          />
        </div>
        <div className="col-md-3 p-1  d-flex justify-content-center">
          <img
            alt="m logo"
            src={mLogo}
            style={{ width: "95%", height: "150px" }}
            className={` hover-red shadow ${sData.monthly ? "a-s-f" : ""}`}
            onClick={() => {
              setSData({
                daily: false,
                weekly: false,
                monthly: true,
                yearly: false,
              });
            }}
          />
        </div>
        <div className="col-md-3 p-1  d-flex justify-content-center">
          <img
            alt="y logo"
            src={yLogo}
            style={{ width: "95%", height: "150px" }}
            className={` hover-red shadow ${sData.yearly ? "a-s-f" : ""}`}
            onClick={() => {
              setSData({
                daily: false,
                weekly: false,
                monthly: false,
                yearly: true,
              });
            }}
          />
        </div>
      </div>
      {sData.daily ? (
        <DailySaleInfo sales={sales} loading={loading} cinfo={cinfo} />
      ) : null}
      {sData.weekly ? (
        <WeeklySaleInfo sales={sales} loading={loading} cinfo={cinfo} />
      ) : null}
      {sData.monthly ? (
        <MonthlySaleInfo sales={sales} loading={loading} cinfo={cinfo} />
      ) : null}
      {sData.yearly ? (
        <YearlySaleInfo sales={sales} loading={loading} cinfo={cinfo} />
      ) : null}
    </div>
  ) : (
    <div className="mt-5">
      <h1 className="text-center text-danger">No Data Available</h1>
    </div>
  );
};
export default CashierSales;
