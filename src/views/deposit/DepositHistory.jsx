import React, { useEffect, useState } from "react";
import { CDataTable } from "@coreui/react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { getDepositCustomerHistory } from "src/redux/action";
import { LoaderSpinner, toCapitalized } from "src/reusable";
import { Tab, Tabs } from "react-bootstrap";
import FrontID from "src/assets/icons/BackId.jpg";
const DepositFields = [
  { key: "Index", label: "Index" },
  { key: "amount", label: `Deposited` },
  { key: "date", label: `Date` },
];
const DepositHistory = (props) => {
  const dispatch = useDispatch();
  const { depositId, customerId } = useParams();
  const [information, setInformation] = useState(null);
  const [listDeposit, setListDeposit] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleGetResult = async () => {
    setLoading(true);
    const res = await dispatch(
      getDepositCustomerHistory({ customerId: depositId })
    );
    if (res.result) {
      setListDeposit(res.customer.listDeposit);
      setInformation(res.customer.customerInformation);
    }
    setLoading(false);
  };
  useEffect(() => {
    handleGetResult();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    handleGetResult();
    // eslint-disable-next-line
  }, [customerId, depositId]);
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
              <Tab eventKey="purchase_history" title="Purchase History"></Tab>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};
export default DepositHistory;
