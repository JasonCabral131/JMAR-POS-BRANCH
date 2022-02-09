import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductSalesInfo } from "src/redux/action/product.action";
import { LoaderSpinner, toCapitalized } from "src/reusable";
//import { ProductCarouselInfo } from "./sales.widget";
import dLogo from "src/assets/icons/Daily.gif";
import wLogo from "src/assets/icons/wlogo.gif";
import mLogo from "src/assets/icons/Monthly.gif";
import yLogo from "src/assets/icons/yearly.gif";
import { ProductDailySale } from "./SalesTable/dailySale";
import { useSelector } from "react-redux";
import ProductWeeklySale from "./SalesTable/weeklySale";
import ProductMonthlySale from "./SalesTable/MonthlySale";
import ProductYearlySale from "./SalesTable/YearlySale";
const ProductSalesInformation = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productId } = useParams();
  const [sales, setSales] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sData, setSData] = useState({
    daily: true,
    weekly: false,
    monthly: false,
    yearly: false,
  });
  const handleGetData = async () => {
    setLoading(true);
    const res = await dispatch(getProductSalesInfo({ productId }));
    setLoading(false);
    if (res.result) {
      const { POS, product } = res;
      setSales(POS);
      setProduct(product);
      const element = document.querySelector("ol.breadcrumb > li.active");
      if (element) {
        element.innerHTML = toCapitalized(`${product.product} Sales `);
      }

      return;
    }
  };
  useEffect(() => {
    handleGetData();
    // eslint-disable-next-line
  }, [productId]);
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
      {/* <ProductCarouselInfo product={product} /> */}
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
        <ProductDailySale
          sales={sales ? sales.salesByDay : []}
          loading={loading}
          user={user}
          product={product}
        />
      ) : null}
      {sData.weekly ? (
        <ProductWeeklySale
          sales={sales ? sales.salesByWeek : []}
          loading={loading}
          user={user}
          product={product}
        />
      ) : null}
      {sData.monthly ? (
        <ProductMonthlySale
          sales={sales ? sales.salesbyMonth : []}
          loading={loading}
          user={user}
          product={product}
        />
      ) : null}
      {sData.yearly ? (
        <ProductYearlySale
          sales={sales ? sales.salesbyYearly : []}
          loading={loading}
          user={user}
          product={product}
        />
      ) : null}
    </div>
  ) : (
    <div className="mt-5">
      <h1 className="text-center text-danger">No Data Available</h1>
    </div>
  );
};
export default ProductSalesInformation;
