import { CButton, CDataTable } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Select from "react-select";
import {
  checkAuthenicatingPassword,
  getDepositCustomer,
} from "src/redux/action";
import { imagesObject, toCapitalized } from "src/reusable";
import CreateNewCustomerDDeposit from "./createDeposit";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import Authentication from "src/reusable/Authentication";
import Swal from "sweetalert2";
import AddDepositCustomer from "./AddDeposit";
import { useHistory } from "react-router-dom";
const DepositFields = [
  { key: "Index", label: "Index" },
  { key: "name", label: "Name" },
  { key: "amount", label: `Amount` },
  { key: "date", label: `Date` },
  {
    key: "action",
    label: "Action",
  },
];
const CreateLabelSelect = ({ profile, lastname, firstname }) => {
  return (
    <div className="customer-select-container">
      <img alt="profile-customer-info" src={profile.url} />
      <p className="customer-select-name">
        {toCapitalized(lastname + ", " + firstname)}
      </p>
    </div>
  );
};
const DepositCustomer = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { customers } = useSelector((state) => state.customer);
  const { deposits } = useSelector((state) => state.deposit);
  const [customerSelect, setCustomerSelect] = useState([]);
  const [showAddModal, setAddModal] = useState(false);
  const [authenticationModal, setAuthenticationModal] = useState(false);
  const [addDepositModal, setAddDepositModal] = useState(false);
  const [whatToOpen, setWhatToOpen] = useState("");
  const [customerInfomation, setCustomerInformation] = useState(null);
  const [images, setImages] = useState(imagesObject);
  useEffect(() => {
    let selectcustomer = [];

    for (let custo of customers) {
      const isExist = deposits.filter(
        (data) => data.customerNew._id.toString() === custo._id
      );
      if (isExist.length < 1) {
        selectcustomer.push({
          value: { ...custo },
          label: <CreateLabelSelect {...custo} />,
        });
      }
    }

    setCustomerSelect(selectcustomer);
    // eslint-disable-next-line
  }, [customers, deposits]);
  useEffect(() => {
    dispatch(getDepositCustomer());
    // eslint-disable-next-line
  }, []);
  const onClickAuthenicating = (e) => {
    setWhatToOpen("create-deposit");
    setAuthenticationModal(true);
  };
  const handleSubmitAuth = async (password) => {
    if (password === "") {
      Swal.fire({
        icon: "warning",
        text: "Password required!",
      });
      return;
    }
    const res = await dispatch(checkAuthenicatingPassword({ password }));
    if (res) {
      setAuthenticationModal(false);
      if (whatToOpen === "create-deposit") {
        setAddModal(true);
      } else {
        setAddDepositModal(true);
      }
    }
    return res;
  };
  const handleEdit = async (item) => {
    const { customerNew } = item;
    setImages({
      profile: {
        file: null,
        dataUrl: customerNew.profile.url,
        active: true,
      },
      FrontId: {
        file: null,
        dataUrl: customerNew.frontId.url,
        active: false,
      },
      BackId: {
        file: null,
        dataUrl: customerNew.backId.url,
        active: false,
      },
    });
    setCustomerInformation({ ...customerNew, depositId: item._id });
    setWhatToOpen("add-deposit");
    setAuthenticationModal(true);
  };
  return (
    <div className="card">
      <div className="card-header">
        <div className="row">
          <div className="col-md-4">
            <h1 className="header-card-information">
              <span>Branch Customer Deposit</span>
            </h1>
          </div>
          <div className="col-md-8 text-right">
            <CButton
              className="btn-qrcode save-button"
              name="create-deposit"
              onClick={onClickAuthenicating}
            >
              Deposit New Account
            </CButton>
          </div>
        </div>
      </div>
      <div className="card-body">
        <CDataTable
          items={deposits}
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
          scopedSlots={{
            name: (item) => (
              <td style={{ width: "250px" }}>
                <div className="d-flex justify-content-center">
                  <div className="c-avatar  ">
                    <img
                      src={item.customerNew.profile.url}
                      className="c-avatar-img"
                      alt="admin@bootstrapmaster.com"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "100%",
                      }}
                    />
                  </div>
                </div>
                <div className="brandnametable text-center">
                  <OverlayTrigger
                    key={"bottom"}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        View History Deposit {toCapitalized(item.name)}
                      </Tooltip>
                    }
                  >
                    <p
                      onClick={() => {
                        history.push(
                          `/branch/deposit-customer/${item._id}/${item.customerNew._id}`
                        );
                      }}
                    >
                      {" "}
                      {item.name}
                    </p>
                  </OverlayTrigger>
                </div>
              </td>
            ),
            amount: (item) => (
              <td className="fw-bolder text-center">
                ₱.{" "}
                {new Intl.NumberFormat("en-IN", {
                  maximumSignificantDigits: 3,
                })
                  .format(item.amount)
                  .replace(/\S/gi, "*")}
              </td>
            ),
            date: (item) => (
              <td style={{ width: "280px" }}>
                <div className="d-flex flex-column p-2 w-100">
                  <div>
                    <p className="fw-bolder">
                      Created : <span className="text-muted">{item.date} </span>
                    </p>
                  </div>
                  <div>
                    <p className="fw-bolder">
                      Modified :{" "}
                      <span className="text-muted">
                        {moment(new Date(item.Modifiend)).fromNow()}{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </td>
            ),
            action: (item) => (
              <td>
                <div className="d-flex justify-content-center">
                  <CButton
                    color="info"
                    variant="outline"
                    name="add-deposit"
                    onClick={() => handleEdit(item)}
                  >
                    <RiMoneyDollarCircleLine size="30" />
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
      <CreateNewCustomerDDeposit
        Select={Select}
        customerSelect={customerSelect}
        showAddModal={showAddModal}
        setAddModal={setAddModal}
      />
      <Authentication
        authenticationModal={authenticationModal}
        setAuthenticationModal={setAuthenticationModal}
        handleSubmitAuth={handleSubmitAuth}
      />
      <AddDepositCustomer
        EditModal={addDepositModal}
        setEditModal={setAddDepositModal}
        selected={customerInfomation}
        setSelected={setCustomerInformation}
        images={images}
        setImages={setImages}
      />
    </div>
  );
};
export default DepositCustomer;
