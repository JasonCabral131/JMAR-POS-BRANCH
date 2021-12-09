import React from "react";
import { Modal } from "react-bootstrap";
import { CButton } from "@coreui/react";
import { RiPercentLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { updateTaxInfo } from "src/redux/action";

const UpdateTax = ({
  updateModal,
  setUpdateModal,
  updateLoading,
  updateTax,
  setUpdateTax,
  setUpdateLoading,
}) => {
  const dispatch = useDispatch();
  const handleUpdate = async () => {
    setUpdateLoading(true);
    const { _id, tax, percentage, description } = updateTax;
    if (!tax) {
      Swal.fire({
        icon: "warning",
        text: "Tax Information required",
        timer: 2000,
      });
      setUpdateLoading(false);
      return;
    }
    if (!percentage) {
      Swal.fire({
        icon: "warning",
        text: `${tax} Percentage required`,
        timer: 2000,
      });
      setUpdateLoading(false);
      return;
    }
    if (percentage <= 0) {
      Swal.fire({
        icon: "warning",
        text: `Percentage required`,
        timer: 2000,
      });
      setUpdateLoading(false);
      return;
    }
    if (!description) {
      Swal.fire({
        icon: "warning",
        text: `${tax} description required`,
        timer: 2000,
      });
      setUpdateLoading(false);
      return;
    }
    const taxObject = {
      _id,
      tax,
      percentage,
      description,
    };
    Swal.fire({
      title: "Are you sure want to Update?",
      text: "Data wont be reverted to orginal ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await dispatch(updateTaxInfo(taxObject));
        if (res) {
          setUpdateModal(false);
          setUpdateLoading(false);
          return;
        }
        setUpdateLoading(false);
      }
      setUpdateLoading(false);
    });
  };
  return (
    <Modal
      show={updateModal}
      onHide={() => setUpdateModal(false)}
      backdrop="static"
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          <h1 className="header-card-information">
            <span>Update tax</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-container">
        <div className="row w-100">
          <div className="col-md-6">
            <div className="form-group">
              <label className="label-name">Government Tax </label>
              <input
                value={`${updateTax ? updateTax.tax : ""}`}
                type="text"
                onChange={(e) =>
                  setUpdateTax((prev) => {
                    const { value } = e.target;
                    return { ...prev, tax: value };
                  })
                }
                className="form-control inputvalue "
                placeholder="Input Tax"
              />
              {updateTax ? (
                updateTax.tax === "" ? (
                  <small className="text-danger">Government Tax required</small>
                ) : null
              ) : null}
            </div>
            <div className="form-group percent-container">
              <label className="label-name d-block text-left">
                {" "}
                Tax Percentage
              </label>
              <input
                type="number"
                value={`${updateTax ? updateTax.percentage : ""}`}
                onChange={(e) => {
                  const { value } = e.target;
                  if (parseFloat(value) > 100.0) {
                  } else {
                    setUpdateTax((prev) => {
                      return { ...prev, percentage: value };
                    });
                  }
                }}
                onKeyPress={(e) => {
                  const theEvent = e || window.event;
                  if (e.key === "e" || e.key === "E") {
                    theEvent.preventDefault();
                  }
                }}
                className={`${
                  updateTax
                    ? updateTax.percentage.length < 1
                      ? "needValue"
                      : null
                    : null
                }`}
                min="0.01"
                max="100.00"
                placeholder="Input Tax Percentage"
                onBlur={(e) => {
                  const { value } = e.target;
                  if (value <= 0) {
                    setUpdateTax((prev) => {
                      return { ...prev, percentage: 0.1 };
                    });
                  }
                }}
              />
              <RiPercentLine size="25" className="percentage-mark bg-white" />
              <small className="text-danger info-percent">{`${
                updateTax
                  ? updateTax.percentage.length < 1
                    ? "Tax percentage required"
                    : ""
                  : ""
              }`}</small>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="label-name">Product Description</label>
              <textarea
                value={`${updateTax ? updateTax.description : ""}`}
                onChange={(e) =>
                  setUpdateTax((prev) => {
                    return { ...prev, description: e.target.value };
                  })
                }
                className="form-control text-area"
                col={40}
                style={{ height: "180px" }}
                placeholder="Tax description"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CButton
          color="secondary"
          variant="outline"
          size="lg"
          onClick={() => setUpdateModal(false)}
          disabled={updateLoading}
        >
          Cancel
        </CButton>
        <CButton
          color="info"
          variant="outline"
          size="lg"
          className="ml-1"
          disabled={updateLoading}
          onClick={handleUpdate}
        >
          {updateLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-1"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </>
          ) : (
            "Update"
          )}
        </CButton>
      </Modal.Footer>
    </Modal>
  );
};
export default UpdateTax;
