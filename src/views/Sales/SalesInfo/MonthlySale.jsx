import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chart } from "react-google-charts";
import Sale2Png from "src/assets/icons/sell.gif";
import { monthNames } from "src/reusable";
import {
  AiOutlinePrinter,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineEye,
} from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { CDataTable, CCollapse, CCardBody } from "@coreui/react";
const MonthlySale = ({ user }) => {
  const history = useHistory();
  const { sales, loading } = useSelector((state) => state.sales);
  const [chartState, setChartState] = useState([]);
  const [salesInfo, setSalesInfo] = useState([]);
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState({ month: "", year: "" });
  const [sdrop, setSdrop] = useState({
    fIndex: Math.random(),
    sIndex: Math.random(),
  });

  const handleMonthlySale = () => {
    if (sales) {
      if (sales.salesMonthlyTotal) {
        let salex = [];
        let salei = [];
        sales.salesMonthlyTotal.forEach((data) => {
          let searching = "";
          if (search.month !== "") {
            searching += search.month;
          }
          if (search.year !== "") {
            searching += "/" + search.year;
          }
          if (data.date.includes(searching)) {
            salei.push(data);
            salex.push([data.date, data.totalAmount]);
            return;
          }
          if (searching === "") {
            console.log(data.totalAmount);
            salei.push(data);
            salex.push([data.date, data.totalAmount]);
            return;
          }
        });
        setSalesInfo(salei);
        setChartState([["Monthly", "Value"], ...salex]);
      }
    }
  };
  const handleGetYear = () => {
    const year = [{ value: "", label: "All" }];
    if (user) {
      const yearx = new Date(user.createdAt).getFullYear();
      console.log(yearx);
      for (let i = yearx; i <= new Date().getFullYear(); i++) {
        year.push({ value: i, label: i });
      }
    }
    return year;
  };
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
  useEffect(() => {
    handleMonthlySale();
    handleGetYear();
    // eslint-disable-next-line
  }, [sales, search, user]);
  useEffect(() => {
    handleMonthlySale();
    handleGetYear();
    // eslint-disable-next-line
  }, []);

  const Print = () => {};
  return (
    <div className="w-100">
      <h1 className="header-card-information mt-5">
        <img
          alt="sales"
          src={Sale2Png}
          style={{ height: "80px", width: "250px" }}
        />
        <span>Monthly Sale Information</span>
      </h1>
      <div className="card shadow p-2 mt-2">
        <div className="print-left-info">
          {chartState.length > 1 ? (
            <AiOutlinePrinter size="25" className="hover" onClick={Print} />
          ) : null}
        </div>
        <div className="row ml-2 mb-3">
          <div className="col-md-2 percent-container">
            <label className="label-name text-left d-block">
              Filter By Month
            </label>
            <select
              name="sex"
              onChange={(e) => {
                setSearch({ ...search, month: e.target.value });
              }}
            >
              <option value="">All</option>
              {monthNames.map((data) => {
                return <option value={data}>{data}</option>;
              })}
            </select>
          </div>
          <div className="col-md-2 percent-container ml-3">
            <label className="label-name text-left d-block">
              Filter By Year
            </label>
            <select
              name="year"
              onChange={(e) => {
                setSearch({ ...search, year: e.target.value });
              }}
            >
              {handleGetYear().map((data) => {
                return <option value={data.value}>{data.label}</option>;
              })}
            </select>
          </div>
        </div>
        {chartState.length > 1 ? (
          <Chart
            width="100%"
            height="100%"
            chartType="Bar"
            data={chartState}
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
        ) : (
          <h4 className="text-center text-danger">No Data Found</h4>
        )}
        <div className="card-body mt-2">
          <CDataTable
            items={salesInfo}
            fields={productFields}
            columnFilter={false}
            tableFilterValue={null}
            tableFilter={{ placeholder: "date (ex: January/2022)" }}
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
              details: (item, findex) => {
                return (
                  <CCollapse show={details.includes(findex)}>
                    <CCardBody className={"p-2"}>
                      <h4 className="ml-2">{item.date + " List Of Sales"}</h4>
                      <div className="card shadow p-2">
                        <CDataTable
                          items={item.data}
                          fields={brandSubFields}
                          columnFilter={false}
                          tableFilterValue={null}
                          tableFilter={{ placeholder: "date (ex: 12/10/2022)" }}
                          itemsPerPageSelect={true}
                          itemsPerPage={5}
                          hover
                          sorter
                          pagination
                          scopedSlots={{
                            show_details: (item, sindex) => (
                              <td>
                                <div className="d-flex justify-content-center">
                                  {sdrop.fIndex === findex &&
                                  sdrop.sIndex === sindex ? (
                                    <AiOutlineDown
                                      onClick={() => {
                                        setSdrop({
                                          fIndex: Math.random(),
                                          sIndex: Math.random(),
                                        });
                                      }}
                                      className="hover mt-1 ml-4"
                                    />
                                  ) : (
                                    <AiOutlineUp
                                      onClick={() => {
                                        setSdrop({
                                          fIndex: findex,
                                          sIndex: sindex,
                                        });
                                      }}
                                      className="hover mt-1 ml-4"
                                    />
                                  )}
                                </div>
                              </td>
                            ),
                            details: (itemx, sindex) => {
                              return (
                                <CCollapse
                                  show={
                                    sdrop.fIndex === findex &&
                                    sdrop.sIndex === sindex
                                  }
                                >
                                  <CCardBody className={"p-2"}>
                                    <h4 className="ml-2">
                                      {itemx.date + " List Of Sales"}
                                    </h4>
                                    <div className="card shadow p-2">
                                      <CDataTable
                                        items={itemx.data}
                                        fields={transactionField}
                                        columnFilter={false}
                                        tableFilterValue={null}
                                        tableFilter={{
                                          placeholder: "Transaction ID",
                                        }}
                                        itemsPerPageSelect={true}
                                        itemsPerPage={5}
                                        hover
                                        sorter
                                        pagination
                                        scopedSlots={{
                                          action: (itemxx) => (
                                            <td className="text-center">
                                              <AiOutlineEye
                                                onClick={() => {
                                                  history.push(
                                                    `/branch/sales/transaction/${itemxx._id}`
                                                  );
                                                }}
                                                className="hover mt-1 ml-4"
                                              />
                                            </td>
                                          ),
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
      </div>
    </div>
  );
};

export default MonthlySale;
const productFields = [
  { key: "date", label: "Date" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "show_details", label: "", _style: { width: "3%" } },
];
const brandSubFields = [
  { key: "date", label: "Date" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "show_details", label: "", _style: { width: "3%" } },
];
const transactionField = [
  { key: "salesId", label: "Transaction ID" },
  { key: "total", label: "Total Amount" },
  { key: "action", label: "", _style: { width: "3%" } },
];
