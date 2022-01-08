import React from "react";
import Logo from "src/assets/icons/hamburger_logo_expand.png";
import storelogo from "src/assets/icons/store.jpg";
import { toCapitalized } from "src/reusable";
import { Chart } from "react-google-charts";
const PrintMonthlyData = React.forwardRef(
  ({ chartData, saleInfo, user }, ref) => {
    return (
      <div
        className="w-100 p-2"
        ref={ref}
        style={{ position: "relative", width: "100%", display: "block" }}
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
          <p> {user?.branch_name + " Store"}</p>
          <img
            alt={"store"}
            src={storelogo}
            className="ml-2"
            style={{ width: "40px", height: "40px" }}
          />
        </h4>
        <hr />
        <h4>{user ? toCapitalized(user.branch_address.fullAddress) : null} </h4>
        <div className="col-md-12">
          <div
            className="w-100 p-1 content-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Chart
              width="100%"
              height="100%"
              chartType="LineChart"
              data={chartData}
              legendToggle
              options={{
                // Material design options
                chart: {
                  title: "Daily Sale Product Performance",
                },
                vAxis: {
                  title: "Daily Sale",
                },
                series: {
                  0: { curveType: "function" },
                },
              }}
            />
          </div>
        </div>
        <table className="table mt-1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {saleInfo?.map((data) => (
              <tr>
                <th>{data.date}</th>
                <th>{data.totalAmount}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default PrintMonthlyData;
