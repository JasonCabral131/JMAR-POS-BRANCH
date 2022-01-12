import React, { useEffect, useState } from "react";
import { CDataTable, CCollapse, CCardBody } from "@coreui/react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { getDepositCustomerHistory } from "src/redux/action";
import { LoaderSpinner, toCapitalized } from "src/reusable";
import { Tab, Tabs } from "react-bootstrap";
import FrontID from "src/assets/icons/BackId.jpg";
import moment from "moment";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
const DepositFields = [
  { key: "Index", label: "Index" },
  { key: "amount", label: `Deposited` },
  { key: "date", label: `Date` },
];
const PurchaseFields = [
  { key: "salesId", label: `Transaction ID` },
  { key: "usingPayment", label: `Payment Method` },
  { key: "subTotal", label: `Sub Total` },
  { key: "tax_paid", label: `Payed Tax` },
  { key: "payment", label: `Payment` },
  { key: "totalAmount", label: `Total Amount` },
  { key: "change", label: `Change` },
  { key: "createdAt", label: `Date` },
  { key: "show_details", label: `Details` },
];
const DepositHistory = (props) => {
  const dispatch = useDispatch();
  const { depositId, customerId } = useParams();
  const [information, setInformation] = useState(null);
  const [listDeposit, setListDeposit] = useState([]);
  const [listPurchase, setListPurchase] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleGetResult = async () => {
    setLoading(true);
    const res = await dispatch(
      getDepositCustomerHistory({ customerId: depositId })
    );
    if (res.result) {
      setListDeposit(res.customer.listDeposit);
      setInformation(res.customer.customerInformation);
      setListPurchase(res.customer.purchaseHistory);
    }
    setLoading(false);
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
    handleGetResult();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    handleGetResult();
    // eslint-disable-next-line
  }, [customerId, depositId]);
  const subTotalAmount = (data) => {
    return data.reduce((accum, item) => accum + parseFloat(item.amount), 0);
  };
  const taxPayedAmount = (data) => {
    return data.reduce((accum, item) => accum + parseFloat(item.amount), 0);
  };
  return (
    <div className="card shadow">
      <div className="card-header">
        <h1 className="header-card-information">
          <span> Deposit History</span>
        </h1>
      </div>
      <div className="card-body">
        {loading ? (
          <LoaderSpinner height="400px" />
        ) : (
          <div className="w-100">
            {information ? (
              <div
                className="personal-container"
                style={{
                  display: "flex",
                  position: "relative",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={information ? information.profile.url : FrontID}
                  alt="profile-pic"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "100%",
                  }}
                />
                <div className="name-container">
                  <h1>
                    <span>{information.name}</span>
                  </h1>
                  <h2>
                    <span>{information.address}</span>
                  </h2>
                </div>
              </div>
            ) : null}
            <Tabs
              defaultActiveKey="depositHistory"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab
                eventKey="depositHistory"
                title={`${
                  information
                    ? toCapitalized(information.name) + " Deposit History"
                    : "Deposit History"
                }`}
              >
                <CDataTable
                  items={listDeposit}
                  fields={DepositFields}
                  columnFilter={false}
                  tableFilterValue={null}
                  tableFilter={{ placeholder: "search information..." }}
                  footer={false}
                  itemsPerPageSelect={false}
                  itemsPerPage={5}
                  hover
                  sorter
                  pagination
                />
              </Tab>
              <Tab eventKey="purchase_history" title="Purchase History">
                <CDataTable
                  items={listPurchase}
                  fields={PurchaseFields}
                  columnFilter={false}
                  tableFilterValue={null}
                  tableFilter={{ placeholder: "search information..." }}
                  footer={false}
                  itemsPerPageSelect={false}
                  itemsPerPage={5}
                  hover
                  sorter
                  pagination
                  scopedSlots={{
                    subTotal: (item) => (
                      <td>
                        {Math.round(
                          (subTotalAmount(item.product) + Number.EPSILON) * 100
                        ) / 100}{" "}
                      </td>
                    ),
                    tax_paid: (item) => (
                      <td>
                        {Math.round(
                          (taxPayedAmount(item.taxs) + Number.EPSILON) * 100
                        ) / 100}
                      </td>
                    ),
                    totalAmount: (item) => (
                      <td>
                        {Math.round(
                          (taxPayedAmount(item.taxs) +
                            subTotalAmount(item.product) +
                            Number.EPSILON) *
                            100
                        ) / 100}
                      </td>
                    ),
                    change: (item) => (
                      <td>
                        {Math.round(
                          (parseFloat(item.payment) -
                            (taxPayedAmount(item.taxs) +
                              subTotalAmount(item.product)) +
                            Number.EPSILON) *
                            100
                        ) / 100}
                      </td>
                    ),
                    createdAt: (item) => (
                      <td>{moment(item.createdAt).fromNow()}</td>
                    ),
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
                    details: (item, index) => {
                      return (
                        <CCollapse show={details.includes(index)}>
                          <CCardBody className={"p-2"}>
                            <h4 className="ml-2">
                              {item.salesId + " Purchase information"}
                            </h4>
                            <div className=" card shadow p-2">
                              <div className="row p-1">
                                <div className="col-md-12 p-1">
                                  <table className="table table-hover table-borderless">
                                    <thead>
                                      <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.product.map((prod) => {
                                        return (
                                          <tr>
                                            <td>{prod.product.product}</td>
                                            <td>{prod.price}</td>
                                            <td>{prod.quantity}</td>
                                            <td>{prod.amount}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="col-md-12 p-1">
                                  <table className="table table-hover table-borderless">
                                    <thead>
                                      <tr>
                                        <th>Tax</th>

                                        <th>Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.taxs.map((taxs) => {
                                        return (
                                          <tr>
                                            <td>
                                              {taxs.tax} - ( {taxs.percentage} %
                                              )
                                            </td>
                                            <td>{taxs.amount}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </CCardBody>
                        </CCollapse>
                      );
                    },
                  }}
                />
              </Tab>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};
export default DepositHistory;
