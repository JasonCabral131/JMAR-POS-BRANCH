import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBrandSalesInfo } from "src/redux/action/brand.action";
import { LoaderSpinner, toCapitalized } from "src/reusable";
import BrandCarousel from "./BrandCarousel";
import dLogo from "src/assets/icons/Daily.gif";
import wLogo from "src/assets/icons/wlogo.gif";
import mLogo from "src/assets/icons/Monthly.gif";
import yLogo from "src/assets/icons/yearly.gif";
import BrandDailySale from "./SalesTable/BrandDailySale";
import BrandWeeklySale from "./SalesTable/BrandWeeklySale";
import BrandMontlySale from "./SalesTable/BrandMontlySale";
import BrandYearlySale from "./SalesTable/BrandYearlySale";
const BrandSalesinfo = (props) => {
  const dispatch = useDispatch();
  const { brandId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState(null);
  const [sData, setSData] = useState({
    daily: true,
    weekly: false,
    monthly: false,
    yearly: false,
  });
  const handleGetData = async () => {
    setLoading(true);
    const res = await dispatch(getBrandSalesInfo({ brandId }));
    setLoading(false);
    if (res.result) {
      const { POS } = res;
      setBrand(res.brand);
      setSales(POS);
      const element = document.querySelector("ol.breadcrumb > li.active");
      element.innerHTML = toCapitalized(`${res.brand.brand} Sales `);
    }
  };
  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line
  }, [brandId]);
  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line
  }, []);
  return loading ? (
    <div className="w-100 p-4 mt-5">
      <LoaderSpinner height={"400px"} />
    </div>
  ) : brand ? (
    <div className="w-100">
      <BrandCarousel brand={brand} />
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
        <BrandDailySale
          user={user}
          sales={sales ? sales.salesByDay : []}
          loading={loading}
          brand={brand}
        />
      ) : null}
      {sData.weekly ? (
        <BrandWeeklySale
          user={user}
          sales={sales ? sales.salesByWeek : []}
          loading={loading}
          brand={brand}
        />
      ) : null}
      {sData.monthly ? (
        <BrandMontlySale
          user={user}
          sales={sales ? sales.salesbyMonth : []}
          loading={loading}
          brand={brand}
        />
      ) : null}
      {sData.yearly ? (
        <BrandYearlySale
          user={user}
          sales={sales ? sales.salesbyYearly : []}
          loading={loading}
          brand={brand}
        />
      ) : null}
    </div>
  ) : (
    <div className="mt-5">
      <h1 className="text-center text-danger">No Data Available</h1>
    </div>
  );
};

export default BrandSalesinfo;
