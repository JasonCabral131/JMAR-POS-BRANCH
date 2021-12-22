import React, { useState } from "react";
import { CDataTable } from "@coreui/react";
import { AiOutlineDown, AiOutlineUp, AiOutlinePrinter } from "react-icons/ai";
import { MonthlyFields } from "../salesWidget";
import Sale2Png from "src/assets/icons/sell.gif";
const MonthlySaleInfo = ({ sales, loading }) => {
  const [details, setDetails] = useState([]);
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };
  return (
    <>
      <h1 className="header-card-information mt-5">
        <img
          alt="sales"
          src={Sale2Png}
          style={{ height: "80px", width: "250px" }}
        />
        <span>Monthly Sale Information</span>
      </h1>
      <div className="card  mt-4 p-3" style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            position: "absolute",
            right: 10,
            top: 20,
          }}
        >
          <AiOutlinePrinter size="25" className="hover" />
        </div>

        <div className="card-body mt-2">
          <CDataTable
            items={sales ? (sales.salesbyMonth ? sales.salesbyMonth : []) : []}
            fields={MonthlyFields}
            columnFilter={false}
            tableFilterValue={null}
            tableFilter={{ placeholder: "search information..." }}
            itemsPerPageSelect={true}
            itemsPerPage={5}
            hover
            sorter
            pagination
            loading={loading}
            scopedSlots={{
              show_details: (item, index) => (
                <td>
                  <div className="d-flex justify-content-center">
                    <AiOutlinePrinter size="20" className="hover" />
                    {details.includes(index) ? (
                      <AiOutlineDown
                        onClick={() => {
                          toggleDetails(index);
                        }}
                        className="hover mt-1 ml-4"
                      />
                    ) : (
                      <AiOutlineUp
                        onClick={() => {
                          toggleDetails(index);
                        }}
                        className="hover mt-1 ml-4"
                      />
                    )}
                  </div>
                </td>
              ),
            }}
          />
        </div>
      </div>
    </>
  );
};
export default MonthlySaleInfo;
