import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { CButton } from "@coreui/react";

import { AiOutlineBarcode } from "react-icons/ai";
import { useBarcode } from "react-barcodes";
import Swal from "sweetalert2";
const Barcode = ({ barcode, setBarcode }) => {
  const inputVal = useRef();
  const [show, setShow] = useState(false);
  const { inputRef } = useBarcode({
    value: barcode === "" ? "Create Barcode" : barcode,
    options: {
      background: "#fff",
    },
  });
  const save = () => {
    if (barcode < 14) {
      Swal.fire({
        icon: "error",
        title: "opps..",
        text: "Barcode Number Must be 14 or 15 character length",
        timer: 2500,
      });
      return;
    }
    const canvas = document.getElementById("product-barcode-generator");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${barcode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    return;
  };
  return (
    <div className="w-100">
      <div className="w-100 d-flex flex-column justify-content-center barcode_container">
        <canvas
          ref={inputRef}
          id="product-barcode-generator"
          style={{ height: "200px" }}
        />
      </div>
      <div className="mt-5 barcode-input-container">
        <input
          ref={inputVal}
          type="number"
          className="form-control inputvalue"
          placeholder="Input Product Barcode"
          onKeyPress={(e) => {
            const theEvent = e || window.event;
            const { value } = e.target;
            if (e.key === "." || e.key === "E" || e.key === "e") {
              theEvent.preventDefault();
            }
            if (value.length > 14) {
              theEvent.preventDefault();
            }
          }}
          onChange={(e) => {
            const { value } = e.target;
            if (value.length >= 14 && value.length <= 15) {
              setBarcode(value);
              setShow(false);
            } else {
              setBarcode("");

              setShow(true);
            }
          }}
        />
        <AiOutlineBarcode
          size="30"
          className="text-dark icon-barcode"
          onClick={(e) => {
            const barcodeGen = Math.floor(Math.random() * 999999999999999);
            inputVal.current.value = barcodeGen;
            setShow(false);
            setBarcode(barcodeGen);
          }}
        />
      </div>
      {show ? (
        <small className="text-danger mt-1">
          Must Be 14 or 15 value length
        </small>
      ) : null}
      <div className="d-flex justify-content-end">
        <CButton
          color="primary"
          size="lg"
          className="pl-2 pr-3 mt-4"
          onClick={save}
        >
          <AiOutlineBarcode size="20" className="text-white" /> Save
        </CButton>
      </div>
    </div>
  );
};
const CreateBarcode = ({ barcodeModal, setBarcodeModal }) => {
  const [barcode, setBarcode] = useState("");
  return (
    <Modal
      show={barcodeModal}
      onHide={() => {
        setBarcode("");
        setBarcodeModal(false);
      }}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 className="header-card-information">
            <span>Generate Product Barcode</span>
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="d-block label-name">Product Barcode </label>
        <div className="d-flex justify-content-center">
          <Barcode barcode={barcode} setBarcode={setBarcode} />
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default CreateBarcode;
