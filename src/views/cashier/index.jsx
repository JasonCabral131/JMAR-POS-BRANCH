import React, { useState } from "react";
import { CButton, CDataTable } from "@coreui/react";
import { Link } from "react-router-dom";
import { RiDeviceRecoverLine, RiFileAddLine } from "react-icons/ri";
import AddBranchCashier from "./addBranchCashier";
import { CashierFields, imagesObject, toCapitalized } from "src/reusable";
import { useDispatch, useSelector } from "react-redux";
import { archivedCashierData } from "src/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IoTrash, IoPencilOutline } from "react-icons/io5";
import UpdateCashierInformation from "./updateCashierInformation";
import Swal from "sweetalert2";
const CashierInformation = (props) => {
  const { cashier, loading } = useSelector((state) => state.cashier);
  const dispatch = useDispatch();
  const [addingLoading, setAddingLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [credentials, setCredential] = useState(imagesObject);
  const [cashierInformation, setcashierInformation] = useState(null);

  const handleEdit = (item) => {
    setCredential(imagesObject);
    setUpdateModal(true);
    setcashierInformation(item);
    console.log(item);
  };
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Archived",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(archivedCashierData({ _id: item._id, roles: "archived" }));
      }
    });
  };
  const getstatus = (stat) => {
    if (stat === "active") {
      return "success";
    }
    if (stat === "pending") {
      return "warning";
    }
    if (stat === "banned") {
      return "danger";
    }
  };
  return (
    <div className="card shadow card-container">
      <div className="card-header  ">
        <div className="row">
          <div className="col-md-6">
            <h1 className="header-card-information">
              <span>Branch Cashier</span>
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
                  to="/branch/branch-cashier-information/arhived-branch-cashier-information"
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
                onClick={() => setShowAddModal(true)}
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
          items={cashier}
          fields={CashierFields}
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
                    <Link
                      to={`/branch/branch-cashier-information/${item._id}`}
                      className="a-link-none"
                    >
                      {item.name}
                    </Link>
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
                    shape="square"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <IoTrash size="15" />
                  </CButton>

                  <CButton
                    color="info"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="ml-1"
                    onClick={() => handleEdit(item)}
                  >
                    <IoPencilOutline size="15" />
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
      <AddBranchCashier
        addingLoading={addingLoading}
        setAddingLoading={setAddingLoading}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
      />
      <UpdateCashierInformation
        updateModal={updateModal}
        setUpdateModal={setUpdateModal}
        credentials={credentials}
        setCredential={setCredential}
        cashierInformation={cashierInformation}
        setcashierInformation={setcashierInformation}
        loadingUpdate={loadingUpdate}
        setLoadingUpdate={setLoadingUpdate}
      />
    </div>
  );
};

export default CashierInformation;
