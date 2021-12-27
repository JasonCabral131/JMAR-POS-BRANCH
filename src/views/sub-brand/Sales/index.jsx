import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSubCatSales } from "src/redux/action/subcategory.action";
import { toCapitalized, LoaderSpinner } from "src/reusable";
import { SubCategoryCarouselInfo } from "./SubCategoryInfo";
import dLogo from "src/assets/icons/Daily.gif";
import wLogo from "src/assets/icons/wlogo.gif";
import mLogo from "src/assets/icons/Monthly.gif";
import yLogo from "src/assets/icons/yearly.gif";
import SubDailySale from "./SalesTable/SubDailySale";
import SubWeeklySale from "./SalesTable/SubWeeklySale";
import SubYearlySale from "./SalesTable/SubYearlySale";
import SubMonthlySale from "./SalesTable/SubMonthlySale";
const SubSales = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { subBrandId } = useParams();
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [sData, setSData] = useState({
    daily: true,
    weekly: false,
    monthly: false,
    yearly: false,
  });
  const handleGetData = async () => {
    setLoading(true);
    const res = await dispatch(getSubCatSales({ subBrandId }));
    setLoading(false);
    if (res.result) {
      const { POS, subBrand } = res;
      setSales(POS);
      setProduct(subBrand);
      const element = document.querySelector("ol.breadcrumb > li.active");
      element.innerHTML = toCapitalized(`${subBrand.subcategory} Sales `);
      return;
    }
  };
  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line
  }, [subBrandId]);
  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line
  }, []);
  return loading ? (
    <div className="w-100 p-4 mt-5">
      <LoaderSpinner height={"400px"} />
    </div>
  ) : product ? (
    <div className="w-100">
      <SubCategoryCarouselInfo product={product} />
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
        <SubDailySale
          user={user}
          sales={sales ? sales.salesByDay : []}
          loading={loading}
          product={product}
        />
      ) : null}
      {sData.weekly ? (
        <SubWeeklySale
          user={user}
          sales={sales}
          loading={loading}
          product={product}
        />
      ) : null}
      {sData.monthly ? (
        <SubMonthlySale
          user={user}
          sales={sales}
          loading={loading}
          product={product}
        />
      ) : null}
      {sData.yearly ? (
        <SubYearlySale
          user={user}
          sales={sales}
          loading={loading}
          product={product}
        />
      ) : null}
    </div>
  ) : null;
};

export default SubSales;
