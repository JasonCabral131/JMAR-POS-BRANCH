import React, { useState, useEffect } from "react";
import { CButton, CDataTable, CCollapse, CCardBody } from "@coreui/react";
// import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { RiFileAddLine } from "react-icons/ri";
import AddCustomerInformation from "./addCustomer";
import { CustomerFields, getstatus, toCapitalized } from "src/reusable";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCustomerInfo } from "src/redux/action";
// import { IoTrash } from "react-icons/io5";
import { AiOutlineEye, AiOutlineMail } from "react-icons/ai";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import Swal from "sweetalert2";
import ExistingAccount from "./ExistingAccount";
import { Modal } from "react-bootstrap";
import { AiOutlineMessage } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import "./style.scss";
import { BsPhoneVibrate } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
import moment from "moment";
const CustomerInformation = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { customers, loading } = useSelector((state) => state.customer);
  const [addingLoading, setAddingLoading] = useState(false);
  const [existingAccountModal, setExistingAccountModal] = useState(false);
  const [ExistingAccountData, setExistAccountData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState(null);
  const [details, setDetails] = useState([]);
  useEffect(() => {
    dispatch(getCustomerInfo());
    return () => {
      dispatch(getCustomerInfo());
    };
  }, [dispatch]);
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
  // const handleDelete = (item) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You want to Archived",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, proceed it!",
  //     cancelButtonText: "No, cancel!",
  //     reverseButtons: true,
  //     allowOutsideClick: false,
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       dispatch(
  //         changeCustomerStatus({ _id: item.branchCustoID, status: "archived" })
  //       );
  //     }
  //   });
  // };
  const handleIfExistingAccount = () => {
    Swal.fire({
      title: "Existing Account?",
      icon: "question",

      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, Create New!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setExistingAccountModal(true);
        return;
      }
      setShowAddModal(true);
      return;
    });
  };
  const subTotalAmount = (data) => {
    return data.reduce((accum, item) => accum + parseFloat(item.amount), 0);
  };
  const taxPayedAmount = (data) => {
    return data.reduce((accum, item) => accum + parseFloat(item.amount), 0);
  };
  return (
    <div className="card">
      <div className="card-header">
        <div className="row">
          <div className="col-md-6">
            <h1 className="header-card-information">
              <span>Branch Customer</span>
            </h1>
          </div>
          <div className="col-md-6 w-100  d-flex justify-content-end">
            <div className="mt-auto">
              <CButton
                className="ml-1 "
                color="info"
                shape="square"
                size="sm"
                onClick={handleIfExistingAccount}
                disabled={addingLoading}
              >
                {addingLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Wait...
                  </>
                ) : (
                  <>
                    {" "}
                    <RiFileAddLine size="15" />
                  </>
                )}
              </CButton>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <CDataTable
          items={customers}
          fields={CustomerFields}
          columnFilter={false}
          tableFilterValue={null}
          tableFilter={{ placeholder: "search information..." }}
          itemsPerPageSelect={false}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={loading}
          scopedSlots={{
            name: (item) => (
              <td>
                <div className="d-flex justify-content-center">
                  <div className="c-avatar  ">
                    <img
                      src={item.profile.url}
                      className="c-avatar-img"
                      alt="admin@bootstrapmaster.com"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "100%",
                      }}
                    />
                    <span
                      className={`c-avatar-status bg-${getstatus(item.status)}`}
                    ></span>
                  </div>
                </div>
                <div className="brandnametable text-center">
                  <OverlayTrigger
                    key={"bottom"}
                    placement={"top"}
                    overlay={
                      <Tooltip id={`tooltip-bottom`}>
                        View Data Of {toCapitalized(item.name)}
                      </Tooltip>
                    }
                  >
                    <p> {item.name}</p>
                  </OverlayTrigger>
                </div>
                <div className="small text-muted text-center">
                  <span>Status</span> | {toCapitalized(item.status)}
                </div>
              </td>
            ),
            action: (item, index) => (
              <td>
                <div className="d-flex justify-content-center">
                  {/* <CButton
                    color="danger"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <IoTrash size="15" />
                  </CButton> */}
                  <CButton
                    color="info"
                    variant="outline"
                    size="sm"
                    className="ml-1"
                    onClick={() => {
                      setModal(true);
                      setContent(item);
                    }}
                  >
                    <AiOutlineEye size="15" />
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
      <AddCustomerInformation
        addingLoading={addingLoading}
        setAddingLoading={setAddingLoading}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
      />
      <ExistingAccount
        existingAccountModal={existingAccountModal}
        setExistingAccountModal={setExistingAccountModal}
        ExistingAccountData={ExistingAccountData}
        setExistAccountData={setExistAccountData}
      />
      <Modal
        show={modal}
        onHide={() => {
          setModal(false);
        }}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        {content ? (
          <Modal.Body>
            <div className="w-100 d-flex">
              <div className="customer-profile-info-container">
                <img alt={Math.random()} src={content.profile.url} />
              </div>
              <div className="customer-name-container ml-3">
                <h4 className="d-flex">
                  {toCapitalized(`${content.firstname} ${content.lastname}`)}{" "}
                  <AiOutlineMessage
                    size={22}
                    className="ml-2 msg-icon"
                    color={"#ff6600 "}
                    onClick={() => {
                      history.push(`/jarm-chat-system/customer/${content._id}`);
                    }}
                  />
                </h4>
                <h5>
                  <BsPhoneVibrate size={18} color={"#ff6600 "} /> ({" "}
                  {content.phone} )
                </h5>
                <h5>
                  <AiOutlineMail size={18} color={"#ff6600 "} /> ({" "}
                  {content.email} )
                </h5>
                <h5>
                  <MdOutlineLocationOn size={18} color={"#ff6600 "} />
                  <span className="ml-2">
                    {toCapitalized(`${content.address.fullAddress}`)}
                  </span>
                </h5>
              </div>
            </div>
            <CDataTable
              items={content.purchases}
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
                subTotal: (item, index) => (
                  <td>
                    ₱.
                    {item.product.reduce(
                      (accum, item) =>
                        parseFloat(accum) + parseFloat(item.amount),
                      0.0
                    )}
                  </td>
                ),
                tax_paid: (item, index) => (
                  <td>
                    <td>
                      ₱.
                      {Math.round(
                        (item.taxs.reduce(
                          (accum, item) =>
                            parseFloat(accum) + parseFloat(item.amount),
                          0.0
                        ) +
                          Number.EPSILON) *
                          100
                      ) / 100}
                    </td>
                  </td>
                ),
                totalAmount: (item) => (
                  <td>
                    ₱.{" "}
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
                                          {taxs.tax} - ( {taxs.percentage} % )
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
          </Modal.Body>
        ) : null}
        <Modal.Footer>
          <button
            className="button-customer button-cancel"
            onClick={() => {
              setModal(false);
              setDetails([]);
            }}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default CustomerInformation;
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
