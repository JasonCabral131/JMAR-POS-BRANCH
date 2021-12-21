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
import WeeklySaleInfo from "./Sales/WeeklySale";
import MonthlySaleInfo from "./Sales/MonthlySale";
import YearlySaleInfo from "./Sales/YearlySale";
const CashierSales = (props) => {
  const { cashierId } = useParams();
  const dispatch = useDispatch();
  const [cinfo, setCashierInfo] = useState(null);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(false);

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
  ) : (
    <div style={{ position: "relative", width: "100%" }}>
      {cinfo ? (
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
      ) : null}
      <DailySaleInfo sales={sales} loading={loading} cinfo={cinfo} />
      <WeeklySaleInfo sales={sales} loading={loading} />
      <MonthlySaleInfo sales={sales} loading={loading} />
      <YearlySaleInfo sales={sales} loading={loading} />
    </div>
  );
};
export default CashierSales;
