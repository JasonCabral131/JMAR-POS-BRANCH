import React, { useState, useRef } from "react";
import { CDataTable, CCollapse, CCardBody } from "@coreui/react";
import { AiOutlineDown, AiOutlineUp, AiOutlinePrinter } from "react-icons/ai";
import { dailyFields } from "../salesWidget";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import AllDataDaily from "../Printing/Daily/AllData";

const DailySaleInfo = ({ sales, loading, cinfo }) => {
  const [details, setDetails] = useState([]);
  const [dP, setDP] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const allDataRef = useRef();
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
  const toggleDownProduct = (index) => {
    const position = dP.indexOf(index);
    let newDetails = dP.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDP(newDetails);
  };
  const handlePrintAllDailySaleData = useReactToPrint({
    content: () => allDataRef.current,
  });

  return (
    <div className="card shadow p-3" style={{ position: "relative" }}>
      <div className="card-header">
        <h1 className="header-card-information">
          <span>Daily Sale Information</span>
        </h1>
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
          {sales ? (
            sales.salesByDay ? (
              sales.salesByDay.length > 0 ? (
                <AiOutlinePrinter
                  size="25"
                  className="hover"
                  onClick={handlePrintAllDailySaleData}
                />
              ) : null
            ) : null
          ) : null}
        </div>
      </div>
      <div className="card-body">
        <CDataTable
          items={sales ? (sales.salesByDay ? sales.salesByDay : []) : []}
          fields={dailyFields}
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
            totalAmount: (item) => (
              <td className="fw-bolder">
                {`₱ ${new Intl.NumberFormat().format(
                  Math.round((item.totalAmount + Number.EPSILON) * 100) / 100
                )}`}
              </td>
            ),
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
            details: (item, index) => {
              return (
                <CCollapse show={details.includes(index)}>
                  <CCardBody className={"p-2"}>
                    <div className=" card shadow p-2">
                      <h4 className="ml-2">{item.date + " List Of Data"}</h4>

                      <div className="card-body ">
                        <CDataTable
                          items={[...item.data]}
                          fields={fieldsDaily}
                          columnFilter={false}
                          tableFilter={{ placeholder: "search information.." }}
                          footer={false}
                          itemsPerPageSelect={true}
                          itemsPerPage={5}
                          hover
                          sorter
                          pagination
                          scopedSlots={{
                            total: (item) => (
                              <td className="fw-bolder">
                                {`₱ ${new Intl.NumberFormat().format(
                                  Math.round(
                                    (item.total + Number.EPSILON) * 100
                                  ) / 100
                                )}`}
                              </td>
                            ),
                            show_details: (item, index) => (
                              <td>
                                <div className="d-flex justify-content-center">
                                  <AiOutlinePrinter
                                    size="20"
                                    className="hover"
                                  />
                                  {dP.includes(index) ? (
                                    <AiOutlineDown
                                      onClick={() => {
                                        toggleDownProduct(index);
                                      }}
                                      className="hover mt-1 ml-4"
                                    />
                                  ) : (
                                    <AiOutlineUp
                                      onClick={() => {
                                        toggleDownProduct(index);
                                      }}
                                      className="hover mt-1 ml-4"
                                    />
                                  )}
                                </div>
                              </td>
                            ),
                            details: (item, index) => {
                              return (
                                <CCollapse show={dP.includes(index)}>
                                  <CCardBody className={"p-2"}>
                                    <div className=" card shadow p-2">
                                      <h4 className="ml-2">
                                        <span
                                          style={{
                                            color: "#adadad",
                                            letterSpacing: 3,
                                          }}
                                        >
                                          Product List
                                        </span>
                                      </h4>
                                      <CDataTable
                                        items={[
                                          ...handleShowProduct(item.product),
                                        ]}
                                        fields={productFields}
                                        columnFilter={false}
                                        tableFilter={{
                                          placeholder: "search product..",
                                        }}
                                        footer={false}
                                        itemsPerPageSelect={true}
                                        itemsPerPage={5}
                                        hover
                                        sorter
                                        pagination
                                      />
                                    </div>
                                  </CCardBody>
                                </CCollapse>
                              );
                            },
                          }}
                        />
                      </div>
                    </div>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
        />
      </div>
      <div style={{ display: "none" }}>
        <AllDataDaily
          ref={allDataRef}
          user={user}
          cinfo={cinfo}
          sales={sales}
        />
      </div>
    </div>
  );
};
export default DailySaleInfo;

const fieldsDaily = [
  { key: "salesId", label: "Transaction ID", _style: { width: "45%" } },
  { key: "total", label: "Total Amount", _style: { width: "45%" } },

  {
    key: "show_details",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];
const productFields = [
  { key: "product", label: "Product" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
  { key: "amount", label: "Amount" },
];
const handleShowProduct = (item) => {
  return item.map((data) => {
    return { ...data, product: data.product.product };
  });
};
