import React from "react";

import { Chart } from "react-google-charts";

const WeekLySale = ({ sales }) => {
  const handleWeekLyData = () => {
    let Weeklydata = [
      ["Week", "Value"],
      ["Sunday", 0],
      ["Monday", 0],
      ["Tuesday", 0],
      ["Wednesday", 0],
      ["Thursday", 0],
      ["Friday", 0],
      ["Saturday", 0],
    ];
    if (sales) {
      if (sales.salesByWeek) {
        const SundaySale = sales.salesByWeek
          .filter((data) => data.day === "Sunday")
          .reduce((accum, item) => accum + item.total, 0);
        const MondaySale = sales.salesByWeek
          .filter((data) => data.day === "Monday")
          .reduce((accum, item) => accum + item.total, 0);
        const TuesdaySale = sales.salesByWeek
          .filter((data) => data.day === "Tuesday")
          .reduce((accum, item) => accum + item.total, 0);
        const WednesdaySale = sales.salesByWeek
          .filter((data) => data.day === "Wednesday")
          .reduce((accum, item) => accum + item.total, 0);
        const ThursdaySale = sales.salesByWeek
          .filter((data) => data.day === "Thursday")
          .reduce((accum, item) => accum + item.total, 0);
        const FridaySale = sales.salesByWeek
          .filter((data) => data.day === "Friday")
          .reduce((accum, item) => accum + item.total, 0);
        const Saturday = sales.salesByWeek
          .filter((data) => data.day === "Saturday")
          .reduce((accum, item) => accum + item.total, 0);
        Weeklydata[1][1] = SundaySale;
        Weeklydata[2][1] = MondaySale;
        Weeklydata[3][1] = TuesdaySale;
        Weeklydata[4][1] = WednesdaySale;
        Weeklydata[5][1] = ThursdaySale;
        Weeklydata[6][1] = FridaySale;
        Weeklydata[7][1] = Saturday;
      }
    }

    return Weeklydata;
  };
  return (
    <Chart
      width="100%"
      height="100%"
      chartType="Bar"
      data={handleWeekLyData()}
      legendToggle
      options={{
        // Material design options
        chart: {
          title: "Weekly Sale",
        },
        vAxis: {
          title: "Weekly Sale",
        },
        series: {
          0: { curveType: "function" },
        },
      }}
    />
  );
};
export default WeekLySale;
