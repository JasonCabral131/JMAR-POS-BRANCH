import React, { useState, useEffect } from "react";
import { CButton, CDataTable } from "@coreui/react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { RiDeviceRecoverLine, RiFileAddLine } from "react-icons/ri";
import AddCustomerInformation from "./addCustomer";
import { CustomerFields, getstatus, toCapitalized } from "src/reusable";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeCustomerStatus, getCustomerInfo } from "src/redux/action";
import { IoTrash } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai";
import Swal from "sweetalert2";
import ExistingAccount from "./ExistingAccount";
const CustomerInformation = (props) => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.customer);
  const [addingLoading, setAddingLoading] = useState(false);
  const [existingAccountModal, setExistingAccountModal] = useState(false);
  const [ExistingAccountData, setExistAccountData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    dispatch(getCustomerInfo());
    return () => {
      dispatch(getCustomerInfo());
    };
  }, [dispatch]);

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Archived",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(
          changeCustomerStatus({ _id: item.branchCustoID, status: "archived" })
        );
      }
    });
  };
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
                color="danger"
                variant="outline"
                shape="square"
                size="sm"
              >
                <Link
                  to="/branch/branch-customer-information/arhived-branch-customer-information"
                  className="a-link-none"
                >
                  <RiDeviceRecoverLine size="15" />
                </Link>
              </CButton>
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
                  <CButton
                    color="danger"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <IoTrash size="15" />
                  </CButton>
                  <CButton
                    color="info"
                    variant="outline"
                    size="sm"
                    className="ml-1"
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
    </div>
  );
};
export default CustomerInformation;
