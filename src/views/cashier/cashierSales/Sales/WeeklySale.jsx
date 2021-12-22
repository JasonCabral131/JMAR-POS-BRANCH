import React, { useState } from "react";
import { CDataTable } from "@coreui/react";
import { AiOutlineDown, AiOutlineUp, AiOutlinePrinter } from "react-icons/ai";
import { WeeklyFields } from "../salesWidget";
import Sale2Png from "src/assets/icons/sell.gif";
const WeeklySaleInfo = ({ sales, loading, cinfo }) => {
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
        <span>Weekly Sale Information</span>
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
          <AiOutlinePrinter size="25" className="hover" onClick={() => {}} />
        </div>

        <div className="card-body mt-2">
          <CDataTable
            items={sales ? (sales.salesByWeek ? sales.salesByWeek : []) : []}
            fields={WeeklyFields}
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
                    <AiOutlinePrinter
                      size="20"
                      className="hover"
                      onClick={() => {}}
                    />
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
          <div style={{ display: "none" }}></div>
        </div>
      </div>
    </>
  );
};
export default WeeklySaleInfo;
export const fieldsDaily = [
  { key: "salesId", label: "Transaction ID", _style: { width: "45%" } },
  { key: "total", label: "Sales", _style: { width: "45%" } },

  {
    key: "show_details",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];
export const productFields = [
  { key: "product", label: "Product" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
  { key: "amount", label: "Amount" },
];
export const handleShowProduct = (item) => {
  return item.map((data) => {
    return { ...data, product: data.product.product };
  });
};
