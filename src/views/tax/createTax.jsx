import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { CButton } from "@coreui/react";
import { RiPercentLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { createTaxInfo } from "src/redux/action";
import { useDispatch } from "react-redux";
const CreateTax = ({
  addingLoading,
  setAddingLoading,
  addModal,
  setAddModal,
}) => {
  const dispatch = useDispatch();
  const [tax, setTax] = useState("");
  const [percentage, setpercent] = useState("");
  const [decription, setDescription] = useState("");
  const handleSubmit = async () => {
    setAddingLoading(true);
    if (!tax) {
      Swal.fire({
        icon: "warning",
        text: "Tax Information required",
        timer: 2000,
      });
      setAddingLoading(false);
      return;
    }
    if (!percentage) {
      Swal.fire({
        icon: "warning",
        text: `${tax} Percentage required`,
        timer: 2000,
      });
      setAddingLoading(false);
      return;
    }
    if (percentage <= 0) {
      Swal.fire({
        icon: "warning",
        text: `Percentage required`,
        timer: 2000,
      });
      setAddingLoading(false);
      return;
    }
    if (!decription) {
      Swal.fire({
        icon: "warning",
        text: `${tax} description required`,
        timer: 2000,
      });
      setAddingLoading(false);
      return;
    }
    const taxObject = {
      tax,
      percentage,
      description: decription,
    };
    const res = await dispatch(createTaxInfo(taxObject));
    if (res) {
      setTax("");
      setpercent("");
      setDescription("");
      setAddModal(false);
      setAddingLoading(false);
    }
    setAddingLoading(false);
  };

  return (
    <Modal
      show={addModal}
      onHide={() => setAddModal(false)}
      backdrop="static"
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          <h1 className="header-card-information">
            <span>Government Tax</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-container">
        <div className="row w-100">
          <div className="col-md-6">
            <div className="form-group">
              <label className="label-name">Government Tax </label>
              <input
                type="text"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="form-control inputvalue "
                placeholder="Input Tax"
              />
              {tax === "" ? (
                <small className="text-danger">Government Tax required</small>
              ) : null}
            </div>
            <div className="form-group percent-container">
              <label className="label-name d-block text-left">
                {" "}
                Tax Percentage
              </label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => {
                  const { value } = e.target;
                  if (parseFloat(value) > 100.0) {
                  } else {
                    setpercent(value);
                  }
                }}
                onKeyPress={(e) => {
                  const theEvent = e || window.event;
                  if (e.key === "e" || e.key === "E") {
                    theEvent.preventDefault();
                  }
                }}
                className={`${percentage.length < 1 ? "needValue" : null}`}
                min="0.01"
                max="100.00"
                placeholder="Input Tax Percentage"
                onBlur={(e) => {
                  setpercent(0.1);
                }}
              />
              <RiPercentLine size="25" className="percentage-mark" />
              <small className="text-danger info-percent">{`${
                percentage.length < 1 ? "Tax percentage required" : ""
              }`}</small>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="label-name">Product Description</label>
              <textarea
                value={decription}
                onChange={(e) => setDescription(e.target.value)}
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
          onClick={() => setAddModal(false)}
          disabled={addingLoading}
        >
          Cancel
        </CButton>
        <CButton
          color="info"
          variant="outline"
          size="lg"
          className="ml-1"
          disabled={addingLoading}
          onClick={handleSubmit}
        >
          {addingLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm mr-1"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </>
          ) : (
            "Save"
          )}
        </CButton>
      </Modal.Footer>
    </Modal>
  );
};
export default CreateTax;
