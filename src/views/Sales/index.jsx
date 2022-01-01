import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineHistoryToggleOff } from "react-icons/md";

import "./Recent/style.scss";
const AllSalesInformation = (props) => {
  // const { sales } = useSelector((state) => state.sales);
  return (
    <div className="w-100">
      <Link to={"/branch/sales/recent-sales-info"}>
        Recent Sales <MdOutlineHistoryToggleOff />
      </Link>
    </div>
  );
};

export default AllSalesInformation;
