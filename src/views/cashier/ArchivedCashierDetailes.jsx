import React, { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CDataTable, CButton } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";

import { CashierFields, toCapitalized } from "src/reusable";
import {
  archivedCashierData,
  getArchivedBranchCashierData,
} from "src/redux/action";
import Swal from "sweetalert2";
import { RiDeviceRecoverLine } from "react-icons/ri";
const ArchivedBranchCashier = (props) => {
  const dispatch = useDispatch();
  const { loading, archived } = useSelector((state) => state.cashier);
  useEffect(() => {
    dispatch(getArchivedBranchCashierData());
    return () => {
      dispatch(getArchivedBranchCashierData());
    };
  }, [dispatch]);

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
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Recover",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(archivedCashierData({ _id: item._id, roles: "banned" }));
      }
    });
  };
  return (
    <div className="card p-1">
      <div className="card-header">
        <h1 className="header-card-information">
          <span>Archived Branch Cashier</span>
        </h1>
      </div>
      <div className="card-body">
        <CDataTable
          items={archived}
          fields={CashierFields}
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
                    shape="square"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <RiDeviceRecoverLine size="20" />
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
    </div>
  );
};
export default ArchivedBranchCashier;
