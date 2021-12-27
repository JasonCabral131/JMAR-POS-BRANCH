import React from "react";
import Sale2Png from "src/assets/icons/sell.gif";
const SubWeeklySale = () => {
  return (
    <>
      <h1 className="header-card-information mt-5">
        <img
          alt="sales"
          src={Sale2Png}
          style={{ height: "80px", width: "250px" }}
        />
        <span>Weekly Sale Information</span>
      </h1>
      <div className="card shadow p-2 mt-2"></div>
    </>
  );
};

export default SubWeeklySale;
