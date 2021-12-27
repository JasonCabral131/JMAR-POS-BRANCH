import React from "react";
import Logo from "src/assets/icons/hamburger_logo_expand.png";
import storelogo from "src/assets/icons/store.jpg";
import { toCapitalized } from "src/reusable";
import { Chart } from "react-google-charts";
const PrintingProduct = React.forwardRef(
  ({ sales, product, user, chartState }, ref) => {
    return (
      <div
        className="w-100 p-2"
        ref={ref}
        style={{ position: "relative", height: "100%" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginBottom: 20,
          }}
        >
          <img
            src={Logo}
            alt="jarm -logo"
            style={{ width: 200, height: 100 }}
          />
        </div>
        <h4 className="brand-information-header-x">
          <p> {user.branch_name + " Store"}</p>
          <img
            alt={"store"}
            src={storelogo}
            className="ml-2"
            style={{ width: "40px", height: "40px" }}
          />
        </h4>
        <hr />
        <h4>{toCapitalized(user.branch_address.fullAddress)} </h4>
        <br />
        <hr />
        <h3 className="mt-2 text-left" style={{ color: "#b0b0b0" }}>
          Product:{" "}
          <span style={{ letterSpacing: 2, color: "#5c5c5c" }}>
            {product?.product}{" "}
          </span>
        </h3>
        <br />
        {chartState.length > 1 ? (
          <div
            className="w-100"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Chart
              width="100%"
              height="100%"
              chartType="Bar"
              data={chartState}
              legendToggle
              options={{
                // Material design options
                chart: {
                  title: "Daily Sale",
                },
                vAxis: {
                  title: "Daily Sale",
                },
              }}
            />
          </div>
        ) : (
          <h4 className="text-center text-danger">No Data Found</h4>
        )}
        <div className="mt-2">
          <div className="border p-2 mt-3">
            <table className="table table-borderless mt-1">
              <thead>
                <tr className="border-bottom">
                  <th className="text-center">Date</th>
                  <th className="text-center">Total Amount</th>
                  <th className="text-center">Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {sales?.map((data) => {
                  return (
                    <tr>
                      <th className="text-center">{data.date}</th>
                      <th className="text-center">{data.totalAmount}</th>
                      <th className="text-center">{data.totalQuantity}</th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);
export default PrintingProduct;
