import React, { useEffect } from "react";
import { CButton, CDataTable } from "@coreui/react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CustomerFields, getstatus, toCapitalized } from "src/reusable";
import { RiDeviceRecoverLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";

import Swal from "sweetalert2";
import { changeCustomerStatus, getArhivedCustomerData } from "src/redux/action";
export const ArchivedCustomerInformation = (props) => {
  const dispatch = useDispatch();
  const { archived, loading } = useSelector((state) => state.customer);

  useEffect(() => {
    dispatch(getArhivedCustomerData());
    return () => {
      dispatch(getArhivedCustomerData());
    };
  }, [dispatch]);
  const handleRecover = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Recover this data",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(
          changeCustomerStatus({ _id: item.branchCustoID, status: "banned" })
        );
      }
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="header-card-information">
          <span>Archived Branch Cashier Customer</span>
        </h1>
      </div>
      <div className="card-body">
        <CDataTable
          items={archived}
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
              </td>
            ),
            action: (item, index) => (
              <td>
                <div className="d-flex justify-content-center">
                  <CButton
                    color="info"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecover(item)}
                  >
                    <RiDeviceRecoverLine size="15" />
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
