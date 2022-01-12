import React from "react";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { getCashierSales } from "src/redux/action";
import { MonthlySaleWidget } from "src/views/dashboard/SalesWidget";
import { YearlySaleWidget } from "src/views/dashboard/SalesWidget";
import { WeeklySaleWidget } from "src/views/dashboard/SalesWidget";
import { TodaySaleWidget } from "src/views/dashboard/SalesWidget";
import WeekLySale from "src/views/dashboard/WeekSale";
import { Chart } from "react-google-charts";
const CashierDashboard = (props) => {
  const dispatch = useDispatch();
  const [sales, setSales] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const handleFetchData = async () => {
    const res = await dispatch(getCashierSales());
    if (res.result) {
      setSales(res.POS);
      let monthlySale = [["Monthly Sale", "Sales"]];
      res?.POS?.salesMonthlyTotal
        ?.slice(0)
        .reverse()
        .forEach((data) => {
          monthlySale.push([data.date, data.totalAmount]);
        });
      setMonthly(monthlySale);
    }
  };
  useEffect(() => {
    handleFetchData();

    // eslint-disable-next-line
  }, []);
  return (
    <div className="fluid-container">
      <div className="card-body sales_container">
        <TodaySaleWidget sales={sales} />
        <WeeklySaleWidget sales={sales} />
        <MonthlySaleWidget sales={sales} />
        <YearlySaleWidget sales={sales} />
      </div>
      <div className="weaklySale_container card shadow">
        <WeekLySale sales={sales} />
      </div>
      {monthly.length > 1 ? (
        <div className="weaklySale_container card shadow mt-2 ">
          <Chart
            width="100%"
            height="400px"
            chartType="AreaChart"
            data={monthly}
            legendToggle
            options={{
              // Material design options
              chart: {
                title: "Monthly Sale  Performance",
              },
              vAxis: {
                title: "Monthly Sale  Performance",
              },
              series: {
                0: { curveType: "function" },
              },
            }}
          />
        </div>
      ) : (
        <h4 className="text-center text-danger">No Data Found</h4>
      )}
    </div>
  );
};
export default CashierDashboard;
