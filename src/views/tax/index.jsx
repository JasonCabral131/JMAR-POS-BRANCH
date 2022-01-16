import React, { useState, useEffect } from "react";

import {
  RiFileAddLine,
  RiDeviceRecoverLine,
  RiGovernmentLine,
} from "react-icons/ri";
import { CButton, CDataTable } from "@coreui/react";
import { Link, useHistory } from "react-router-dom";
import CreateTax from "./createTax";
import { TaxFields } from "src/reusable";
import { useDispatch, useSelector } from "react-redux";
import { archivedTaxInfo, getTaxInfo } from "src/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IoTrash, IoPencilOutline } from "react-icons/io5";
import Loader from "react-loader-spinner";
import UpdateTax from "./updateTax";
import Swal from "sweetalert2";
const GovernmentTaxInfo = (props) => {
  const history = useHistory();
  const [addingLoading, setAddingLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { tax, request } = useSelector((state) => state.tax);
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [deleteTax, setDeletingTax] = useState(null);
  const [updateTax, setUpdateTax] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTaxInfo());
    // eslint-disable-next-line
  }, []);

  const handleEdit = (item) => {
    setUpdateModal(true);
    setUpdateTax(item);
  };
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure want to Archived ?",
      text: `${item.tax}  ${
        item.tax.toLowerCase().includes("tax") ? "" : "Tax"
      } remitted data will not show`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Archived it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingLoading(true);
        setDeletingTax(item);
        const wait = await dispatch(
          archivedTaxInfo({ _id: item._id, active: false })
        );
        if (wait) {
          setDeletingLoading(false);
          setDeletingTax(null);
          return;
        }
        setDeletingLoading(false);
        setDeletingTax(null);
        return;
      }
    });
  };
  return (
    <div className="card p-1">
      <div className="card-header  ">
        <div className="row">
          <div className="col-md-3">
            <h1 className="header-card-information p-1">
              <span>
                <RiGovernmentLine size={40} className="p-1" /> Government Tax
              </span>
            </h1>
          </div>
          <div className="col-md-9 w-100  d-flex justify-content-end">
            <div className="mt-auto">
              <CButton
                className="ml-1 "
                color="danger"
                variant="outline"
                shape="square"
                size="sm"
              >
                <Link
                  to="/branch/inventory-item/government-tax/government-tax-archived"
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
                onClick={() => setAddModal(true)}
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
          items={[...tax]}
          fields={TaxFields}
          columnFilter={false}
          tableFilter={{ placeholder: "search tax" }}
          footer={false}
          itemsPerPageSelect={true}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={request}
          scopedSlots={{
            tax: (item) => (
              <td className="brandnametable">
                <OverlayTrigger
                  key={"bottom"}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      View Remitted tax {`=> ` + item.tax.toUpperCase()}
                    </Tooltip>
                  }
                >
                  <p
                    onClick={() =>
                      history.push(
                        `/branch/inventory-item/government-tax/tax-collected-data/${item._id}`
                      )
                    }
                  >
                    {" "}
                    {item.tax}
                  </p>
                </OverlayTrigger>
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
                    disabled={deleteLoading}
                  >
                    {deleteTax ? (
                      item._id === deleteTax._id ? (
                        deleteLoading ? (
                          <Loader
                            type="ThreeDots"
                            color="#00BFFF"
                            height={20}
                            width={20}
                          />
                        ) : (
                          <IoTrash size="15" />
                        )
                      ) : (
                        <IoTrash size="15" />
                      )
                    ) : (
                      <IoTrash size="15" />
                    )}
                  </CButton>

                  <CButton
                    color="info"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="ml-1"
                    onClick={() => {
                      handleEdit(item);
                    }}
                  >
                    <IoPencilOutline size="15" />
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
      <CreateTax
        addingLoading={addingLoading}
        setAddingLoading={setAddingLoading}
        addModal={addModal}
        setAddModal={setAddModal}
      />
      <UpdateTax
        updateTax={updateTax}
        setUpdateTax={setUpdateTax}
        updateModal={updateModal}
        setUpdateModal={setUpdateModal}
        updateLoading={updateLoading}
        setUpdateLoading={setUpdateLoading}
      />
    </div>
  );
};
export default GovernmentTaxInfo;
