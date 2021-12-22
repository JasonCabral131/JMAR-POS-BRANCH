import React, { useState, useRef, useEffect } from "react";
import { CDataTable, CCollapse, CCardBody } from "@coreui/react";
import { AiOutlineDown, AiOutlineUp, AiOutlinePrinter } from "react-icons/ai";
import { YearlyFields } from "../salesWidget";
import Sale2Png from "src/assets/icons/sell.gif";
import { MonthlyFields } from "../salesWidget";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import YearlySale from "../Printing/Yearly/AllYearly";
import SelectYearly from "../Printing/Yearly/SelectYearly";
const YearlySaleInfo = ({ sales, loading, cinfo }) => {
  const [details, setDetails] = useState([]);
  const [monthlyDetails, setMonthlyDetails] = useState([]);
  const [dailydetails, setDailyDetails] = useState([]);
  const [transactDetials, setTransactDetails] = useState([]);
  const [yData, setYData] = useState(null);
  const [yTrigger, setYTrigger] = useState("");
  const { user } = useSelector((state) => state.auth);
  const yearlyRef = useRef();
  const sYearlyRef = useRef();
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
  const toggleMonthlyDetails = (index) => {
    const position = monthlyDetails.indexOf(index);
    let newDetails = monthlyDetails.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...monthlyDetails, index];
    }
    setMonthlyDetails(newDetails);
  };
  const toggleDailyDetails = (index) => {
    const position = dailydetails.indexOf(index);
    let newDetails = dailydetails.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...dailydetails, index];
    }
    setDailyDetails(newDetails);
  };

  const toggleTransactionDetails = (index) => {
    const position = transactDetials.indexOf(index);
    let newDetails = transactDetials.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...transactDetials, index];
    }
    setTransactDetails(newDetails);
  };
  const handleYearlyPrint = useReactToPrint({
    content: () => yearlyRef.current,
  });
  const handleSelectYearly = useReactToPrint({
    content: () => sYearlyRef.current,
  });

  useEffect(() => {
    if (yData) {
      handleSelectYearly();
    }
    // eslint-disable-next-line
  }, [yData, yTrigger]);
  return (
    <>
      <h1 className="header-card-information mt-5">
        <img
          alt="sales"
          src={Sale2Png}
          style={{ height: "80px", width: "250px" }}
        />
        <span>Yearly Sale Information</span>
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
          <AiOutlinePrinter
            size="25"
            className="hover"
            onClick={handleYearlyPrint}
          />
        </div>

        <div className="card-body mt-2">
          <CDataTable
            items={
              sales ? (sales.salesbyYearly ? sales.salesbyYearly : []) : []
            }
            fields={YearlyFields}
            columnFilter={false}
            tableFilterValue={null}
            tableFilter={{ placeholder: "year (ex: 2022)" }}
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
                      onClick={() => {
                        setYData(item);
                        setYTrigger(Math.random());
                      }}
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
              details: (item, index) => {
                return (
                  <CCollapse show={details.includes(index)}>
                    <CCardBody className={"p-2"}>
                      <h4 className="ml-2">{item.date + " List Of Sales"}</h4>
                      <div className="card mt-2 p-2 ">
                        <CDataTable
                          items={[...item.data]}
                          fields={MonthlyFields}
                          columnFilter={false}
                          tableFilterValue={null}
                          tableFilter={{
                            placeholder: "Date (ex: December/2022)",
                          }}
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
                                  />
                                  {monthlyDetails.includes(index) ? (
                                    <AiOutlineDown
                                      onClick={() => {
                                        toggleMonthlyDetails(index);
                                      }}
                                      className="hover mt-1 ml-4"
                                    />
                                  ) : (
                                    <AiOutlineUp
                                      onClick={() => {
                                        toggleMonthlyDetails(index);
                                      }}
                                      className="hover mt-1 ml-4"
                                    />
                                  )}
                                </div>
                              </td>
                            ),
                            details: (item, index) => {
                              return (
                                <CCollapse
                                  show={monthlyDetails.includes(index)}
                                >
                                  <CCardBody className={"p-2"}>
                                    <h4 className="ml-2">
                                      {item.date + " List Of Sales"}
                                    </h4>
                                    <div className=" card p-2">
                                      <CDataTable
                                        items={[...item.data]}
                                        fields={dailyField}
                                        columnFilter={false}
                                        tableFilter={{
                                          placeholder: "date (ex: 12/10/2022)",
                                        }}
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
                                                  (item.total +
                                                    Number.EPSILON) *
                                                    100
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
                                                  onClick={() => {}}
                                                />
                                                {dailydetails.includes(
                                                  index
                                                ) ? (
                                                  <AiOutlineDown
                                                    onClick={() => {
                                                      toggleDailyDetails(index);
                                                    }}
                                                    className="hover mt-1 ml-4"
                                                  />
                                                ) : (
                                                  <AiOutlineUp
                                                    onClick={() => {
                                                      toggleDailyDetails(index);
                                                    }}
                                                    className="hover mt-1 ml-4"
                                                  />
                                                )}
                                              </div>
                                            </td>
                                          ),
                                          details: (item, index) => {
                                            return (
                                              <CCollapse
                                                show={dailydetails.includes(
                                                  index
                                                )}
                                              >
                                                <CCardBody className={"p-2"}>
                                                  <h4 className="ml-2">
                                                    {item.date +
                                                      " List Of Sales"}
                                                  </h4>
                                                  <div className=" card shadow p-2 mt-2">
                                                    <CDataTable
                                                      items={[...item.data]}
                                                      fields={transactField}
                                                      columnFilter={false}
                                                      tableFilter={{
                                                        placeholder:
                                                          "transaction id",
                                                      }}
                                                      footer={true}
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
                                                                (item.total +
                                                                  Number.EPSILON) *
                                                                  100
                                                              ) / 100
                                                            )}`}
                                                          </td>
                                                        ),
                                                        show_details: (
                                                          item,
                                                          index
                                                        ) => (
                                                          <td>
                                                            <div className="d-flex justify-content-center">
                                                              <AiOutlinePrinter
                                                                size="20"
                                                                className="hover"
                                                                onClick={() => {}}
                                                              />
                                                              {transactDetials.includes(
                                                                index
                                                              ) ? (
                                                                <AiOutlineDown
                                                                  onClick={() => {
                                                                    toggleTransactionDetails(
                                                                      index
                                                                    );
                                                                  }}
                                                                  className="hover mt-1 ml-4"
                                                                />
                                                              ) : (
                                                                <AiOutlineUp
                                                                  onClick={() => {
                                                                    toggleTransactionDetails(
                                                                      index
                                                                    );
                                                                  }}
                                                                  className="hover mt-1 ml-4"
                                                                />
                                                              )}
                                                            </div>
                                                          </td>
                                                        ),
                                                        details: (
                                                          item,
                                                          index
                                                        ) => {
                                                          return (
                                                            <CCollapse
                                                              show={transactDetials.includes(
                                                                index
                                                              )}
                                                            >
                                                              <CCardBody
                                                                className={
                                                                  "p-2"
                                                                }
                                                              >
                                                                <div className=" card shadow p-2">
                                                                  <h4 className="ml-2">
                                                                    <span
                                                                      style={{
                                                                        color:
                                                                          "#adadad",
                                                                        letterSpacing: 3,
                                                                      }}
                                                                    >
                                                                      Product
                                                                      List
                                                                    </span>
                                                                  </h4>
                                                                  <CDataTable
                                                                    items={[
                                                                      ...handleShowProduct(
                                                                        item.product
                                                                      ),
                                                                    ]}
                                                                    fields={
                                                                      productFields
                                                                    }
                                                                    columnFilter={
                                                                      false
                                                                    }
                                                                    tableFilter={{
                                                                      placeholder:
                                                                        "product",
                                                                    }}
                                                                    footer={
                                                                      false
                                                                    }
                                                                    itemsPerPageSelect={
                                                                      true
                                                                    }
                                                                    itemsPerPage={
                                                                      5
                                                                    }
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
                                                </CCardBody>
                                              </CCollapse>
                                            );
                                          },
                                        }}
                                      />
                                    </div>
                                  </CCardBody>
                                </CCollapse>
                              );
                            },
                          }}
                        />
                      </div>
                    </CCardBody>
                  </CCollapse>
                );
              },
            }}
          />
        </div>
        <div style={{ display: "none" }}>
          <YearlySale
            ref={yearlyRef}
            user={user}
            cinfo={cinfo}
            sales={sales ? sales.salesbyYearly : null}
          />
          <SelectYearly
            ref={sYearlyRef}
            sales={yData}
            cinfo={cinfo}
            user={user}
          />
        </div>
      </div>
    </>
  );
};
export default YearlySaleInfo;
export const dailyField = [
  { key: "date", label: "Date", _style: { width: "45%" } },
  { key: "totalAmount", label: "Sales", _style: { width: "45%" } },

  {
    key: "show_details",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];
export const transactField = [
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
