import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineHistoryToggleOff } from "react-icons/md";

import "./Recent/style.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrandSale } from "src/redux/action/brand.action";
import { Chart } from "react-google-charts";
import { LoaderSpinner } from "src/reusable";
import { CButton } from "@coreui/react";
import Loader from "react-loader-spinner";
import { AiOutlineDownload } from "react-icons/ai";
import { triggerBase64Download } from "react-base64-downloader";
import MonthlySale from "./SalesInfo/MonthlySale";
import YearlySale from "./SalesInfo/YearlySale";
const AllSalesInformation = (props) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.sales);
  const { user } = useSelector((state) => state.auth);
  const [brandSales, setBrandSales] = useState([]);
  const [chartWrapper, setChartWrapper] = useState(null);
  const [loadingChartData, setLoadingChartData] = useState(false);
  const handleGetSales = async () => {
    setLoadingChartData(true);
    const res = await dispatch(getAllBrandSale());
    setLoadingChartData(false);
    if (res.result) {
      const { brandSaleList } = res;
      if (Array.isArray(brandSaleList)) {
        const bSale = brandSaleList.map((data) => {
          return [data.brand, data.brandSale];
        });
        setBrandSales([["Brand", "Sale"], ...bSale]);
      }
    }
  };
  useEffect(() => {
    handleGetSales();
    // eslint-disable-next-line
  }, []);
  const print = async () => {
    if (!chartWrapper) {
      console.error("ChartWrapper not ready yet");
    }
    console.log(chartWrapper.getChart());
    const base64 = await chartWrapper.getChart().getImageURI();
    const downloadname = `Brand Sale ( ${new Date().toLocaleString()} )`;
    triggerBase64Download(base64, downloadname);
  };
  return (
    <div className="w-100">
      <Link to={"/branch/sales/recent-sales-info"}>
        Recent Sales <MdOutlineHistoryToggleOff />
      </Link>
      <div className="mt-2 w-100 d-flex flex-column justify-content-center align-items-center p-2">
        {loadingChartData ? (
          <LoaderSpinner height={"400px"} />
        ) : brandSales.length > 1 ? (
          <div
            className="w-100 d-flex flex-column justify-content-center  p-2"
            style={{ position: "relative" }}
          >
            <Chart
              width={"100%"}
              height={"400px"}
              chartType="ColumnChart"
              loader={
                <Loader type="Bars" color="#00BFFF" height={150} width={150} />
              }
              data={brandSales}
              options={{
                title: `Brand Sale`,
                hAxis: { title: "Brand", titleTextStyle: { color: "#333" } },
                vAxis: { minValue: 0 },
                // lineWidth: 25
              }}
              getChartWrapper={(chartWrapper) => {
                setChartWrapper(chartWrapper);
              }}
            />

            {chartWrapper !== null && (
              <CButton
                color="secondary"
                style={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: "20px",
                  right: "15px",
                }}
                variant="outline"
                onClick={() => print()}
              >
                {" "}
                <AiOutlineDownload size={20} />
              </CButton>
            )}
          </div>
        ) : null}
        {!loading ? (
          <div className="w-100 mt-2">
            <MonthlySale user={user} />
            <br />
            <YearlySale user={user} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AllSalesInformation;
