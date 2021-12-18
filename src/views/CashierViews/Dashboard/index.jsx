import React from "react";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { getCashierSales } from "src/redux/action";
import { MonthlySaleWidget } from "src/views/dashboard/SalesWidget";
import { YearlySaleWidget } from "src/views/dashboard/SalesWidget";
import { WeeklySaleWidget } from "src/views/dashboard/SalesWidget";
import { TodaySaleWidget } from "src/views/dashboard/SalesWidget";
import WeekLySale from "src/views/dashboard/WeekSale";

const CashierDashboard = (props) => {
  const dispatch = useDispatch();
  const [sales, setSales] = useState(null);

  const handleFetchData = async () => {
    const res = await dispatch(getCashierSales());
    if (res.result) {
      setSales(res.POS);
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
    </div>
  );
};
export default CashierDashboard;
