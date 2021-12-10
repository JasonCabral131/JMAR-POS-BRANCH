import React, { useState } from "react";
import { AiOutlineQrcode } from "react-icons/ai";
import "./Member.scss";
import { Modal } from "react-bootstrap";
import HeaderLogo from "./../../assets/slider-dec.png";
import QrReader from "react-qr-reader";
import Scann from "./.././../../../../assets/ringtunes/messenger.mp3";
import errorSound from "./.././../../../../assets/ringtunes/windows-error-ringtone.mp3";
import { EmailValidator, LoaderSpinner, toCapitalized } from "src/reusable";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { useDispatch } from "react-redux";
import {
  getRegisteredCustomerInformationPurchase,
  getRegisteredCustomerInformationToQrcode,
} from "src/redux/action";
const MemberCustomer = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [ifScanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalQrcode, setModalQrcode] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchInformation, setSearchInformation] = useState(null);
  const handleScan = async (data) => {
    if (data) {
      if (!ifScanned) {
        const audio = new Audio(Scann);
        audio.play();

        setScanned(true);
        if (typeof data === "string") {
          const checkFormat = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
          if (checkFormat.test(data)) {
            setLoading(true);
            const res = await dispatch(
              getRegisteredCustomerInformationPurchase({ customerId: data })
            );
            if (res.result) {
              setScannedData(res.purchase);
              setLoading(false);
              setScanned(false);
              return;
            }

            setLoading(false);
            setScanned(false);
            return;
          }
          Swal.fire({
            icon: "warning",
            text: "Type of data are not valid",
          });
          setScanned(false);
          return;
        } else {
          Swal.fire({
            icon: "warning",
            text: "Type of data are not valid",
          });
          setScanned(false);
        }
        console.log(data);
      }
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  const handleRegister = (e) => {
    const { name } = e.target;
    if (name === "register-customer") {
      history.push("/JARM/customer/register");
    }
    if (name === "forgot-password") {
      history.push("/JARM/customer/forgot-password");
    }
  };
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (!EmailValidator(searchEmail)) {
        const audio = new Audio(errorSound);
        audio.play();
        Swal.fire({
          icon: "error",
          text: "Not Valid Email",
        });
      } else {
        setLoading(true);
        const res = await dispatch(
          getRegisteredCustomerInformationToQrcode({
            email: searchEmail.toLocaleLowerCase(),
          })
        );
        if (res.result) {
          setLoading(false);
          setSearchInformation(res.customer);
          setModalQrcode(true);
          setSearchEmail("");
          return;
        }
        const audio = new Audio(errorSound);
        audio.play();
        setLoading(false);
      }
    }
  };
  const downloadQrcode = () => {
    html2canvas(document.querySelector("#react-qrcode-logo-div")).then(
      (canvas) => {
        const link = document.createElement("a");
        link.download = `${
          searchInformation
            ? toCapitalized(
                searchInformation.lastname + " " + searchInformation.firstname
              )
            : "no-data-found"
        }.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    );
    setModalQrcode(false);
  };
  return (
    <div className="customer-membership-container">
      <div className="customer_register_header">
        <div className="section__margin customer__register_container">
          <h1 className="gradient_text_green">
            Be Part Of JARM Customer to make purchase anywhere
          </h1>
          <p>This can track your purchase via Qrcode</p>
          <div className="d-flex flex-row justify-content-start">
            <button
              name="register-customer"
              className="btn-qrcode btn-download-qrcode"
              onClick={handleRegister}
            >
              register now
            </button>
            <button
              name="forgot-password"
              className="btn-qrcode forgot-password-btn"
              onClick={handleRegister}
            >
              forgetPassword
            </button>
          </div>
        </div>
        <div className="customer_header-image">
          <img src={HeaderLogo} alt="header-logo" />
        </div>
      </div>
      <div className="customer-scanned_purchase_container section__margin gradient__bg section__padding">
        <div className="label-name-bar" />
        <h1 className="gradient__text">
          Scan Your QRCODE{" "}
          <AiOutlineQrcode className="gradient__text qrcode_" size={50} />
        </h1>
        <div className="col-md-6">
          <div className="gpt3__header-content__input">
            <p>
              Paste or type your email address to download your qrcode and press
              enter
            </p>
            <input
              type="text"
              placeholder="email address"
              onChange={(e) => setSearchEmail(e.target.value)}
              value={searchEmail}
              onKeyPress={handleKeyDown}
              className={
                EmailValidator(searchEmail) ? "text-success" : "text-danger"
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {loading ? (
              <div className="mt-2">
                <LoaderSpinner />
              </div>
            ) : scannedData ? (
              <div>{JSON.stringify(scannedData)}</div>
            ) : (
              <label className="label-name gradient__text text-center d-block mt-5">
                Scanned Your QRCODE To Show all your Data history purchase
              </label>
            )}
          </div>
          <div className="col-md-4">
            <div className="qrcode_scanner_container">
              <QrReader
                delay={1000}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%", height: "100%" }}
                showViewFinder={false}
              />
              <div
                className={`${
                  ifScanned ? "is-scanned-true" : "is-scanned-false"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        centered
        show={modalQrcode}
        size="md"
        backdrop="static"
        dialogClassName="border-none"
      >
        <Modal.Body className="gradient__bg shadow border-none d-flex flex-column justify-content-center align-items-center">
          <div className="qrcode-container" id="react-qrcode-logo-div">
            <QRCode
              value={
                searchInformation ? searchInformation._id : "no-data-found"
              }
              size={350}
            />
            <label className="label-name mt-2  text-center">
              {searchInformation
                ? toCapitalized(
                    searchInformation.lastname +
                      " " +
                      searchInformation.firstname
                  )
                : "No Data Found"}
            </label>
          </div>
          <div className="d-flex w-100">
            <button
              className="btn-qrcode btn-download-cancel"
              onClick={() => {
                setModalQrcode(false);
              }}
            >
              Close
            </button>
            <button
              className="btn-qrcode btn-download-qrcode"
              onClick={downloadQrcode}
            >
              Download QRCODE
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default MemberCustomer;
