import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { depositCustomer, sendingVerficationCode } from "src/redux/action";

import { imagesObject } from "src/reusable";
import Swal from "sweetalert2";

import encryptor from "simple-encryptor";
import { apiConfig } from "src/helpers/apiConfig";
import CustomerInformation from "./CustomerInformation";

const confirmationObject = {
  comfirmation1: "",
  comfirmation2: "",
  comfirmation3: "",
  comfirmation4: "",
  comfirmation5: "",
  comfirmation6: "",
};
const CreateNewCustomerDDeposit = ({
  showAddModal,
  setAddModal,
  customerSelect,
  setCustomerSelect,
  Select,
}) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState(imagesObject);
  const encrypt = encryptor(apiConfig.encrytorKey);
  const [deposit, setDeposit] = useState("");
  const [showConfirmationModal, setConfirmationModal] = useState(false);
  const [comfirmationValue, setComfirmationValue] =
    useState(confirmationObject);
  const [sendingConfirmation, setSendingConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const handleChange = ({ value }) => {
    console.log(value);
    setImages({
      profile: {
        file: null,
        dataUrl: value.profile.url,
        active: true,
      },
      FrontId: {
        file: null,
        dataUrl: value.frontId.url,
        active: false,
      },
      BackId: {
        file: null,
        dataUrl: value.backId.url,
        active: false,
      },
    });
    setSelected(value);
  };

  const handleDeposit = (e) => {
    const { value } = e.target;

    if (value > 5000) {
      setDeposit(5000);
      return;
    }
    isNaN(value) ? setDeposit(0) : setDeposit(value);
  };
  const handleSubmit = () => {
    if (deposit === "") {
      Swal.fire({
        icon: "warning",
        text: "Deposit required",
      });
      return;
    }
    if (parseInt(deposit) < 300) {
      Swal.fire({
        icon: "warning",
        text: "Open Acount Must atleast 300 deposit",
      });
      return;
    }
    Swal.fire({
      icon: "question",
      title: "Are You Sure?",
      text: "Check The Information and the deposit ",
      showCancelButton: true,
      confirmButtonText: "Yes, Proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSendingConfirmation(true);
        setComfirmationValue(confirmationObject);
        const res = await dispatch(
          sendingVerficationCode({ email: selected.email, deposit: deposit })
        );
        if (res.result) {
          setConfirmationCode(encrypt.decrypt(res.encrytedConfirmationCode));
          setAddModal(false);
          setConfirmationModal(true);
          setSendingConfirmation(false);
          return;
        }
        setSendingConfirmation(false);
      }
    });
  };
  const handleSendDeposit = () => {
    let confirmCode = "";

    Object.keys(comfirmationValue).map((key, index) => {
      if (comfirmationValue[key] !== "") {
        confirmCode += comfirmationValue[key];
      }
      return key;
    });
    Swal.fire({
      icon: "question",
      title: "Check The Confirmation Code",
      text: "You wont revert this action",
      showCancelButton: true,
      confirmButtonText: "Yes, Proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (confirmCode.toString() !== confirmationCode.toString()) {
          Swal.fire({
            icon: "error",
            text: "Confirmation Code Does not match",
          });
          setConfirmationModal(false);
          setSelected(null);

          setDeposit("");
          return;
        }
        setSendingConfirmation(true);

        await dispatch(
          depositCustomer({
            branchCustomerId: selected.branchCustoID,
            amount: deposit,
          })
        );

        setSendingConfirmation(false);
        setConfirmationModal(false);
        setSelected(null);
        setDeposit("");
        return;
      }
    });
  };
  return (
    <>
      <Modal
        show={showAddModal}
        size="xl"
        dialogClassName={`${selected ? "modal-cover-screen" : ""} `}
      >
        <Modal.Body>
          {selected ? (
            <div className="fluid-container row">
              <h1 className="header-card-information">
                <span>Open Account Customer</span>
              </h1>
              <div className="col-md-12">
                <CustomerInformation
                  Select={Select}
                  selected={selected}
                  images={images}
                  setImages={setImages}
                />
              </div>
              <div className="w-100 d-flex justify-content-end align-items-end border-top">
                <div className="col-md-7 d-flex flex-column justify-content-center align-items-center mt-1">
                  <label className="label-name">
                    Enter Amount ( <span className="text-success">5,000</span>{" "}
                    maximum ) and ( <span className="text-success">300</span>{" "}
                    minimum )
                  </label>
                  <input
                    type="text"
                    value={
                      isNaN(deposit)
                        ? 0
                        : new Intl.NumberFormat("en-IN", {
                            maximumSignificantDigits: 3,
                          }).format(deposit)
                    }
                    name="amount"
                    maxLength={5}
                    className="inputvalue filter-input text-center"
                    min="1"
                    placeholder="(10,000 maximum) and (500 minimum)"
                    onChange={handleDeposit}
                    onKeyPress={(event) => {
                      const { value } = event.target;
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                      if (parseFloat(value) > 5000) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const data = e.clipboardData.getData("Text");
                      if (!/[0-9]/.test(data)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="fluid-container">
              {" "}
              <div className="col-md-4">
                <label className="label-name text-left d-block">
                  Select Customer{" "}
                </label>
                <Select
                  options={customerSelect}
                  isSearchable={false}
                  onChange={handleChange}
                  placeholder={"Select Branch Customer"}
                />
              </div>
              <label className="label-name text-center text-danger d-block p-5">
                Select Customer To Show information and to add Amount
              </label>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex">
          <CButton
            className="btn-qrcode cancel-button"
            onClick={() => {
              setSelected(null);
              setAddModal(false);
            }}
            disabled={sendingConfirmation}
          >
            Cancel
          </CButton>
          {selected ? (
            <CButton
              className="btn-qrcode save-button"
              onClick={handleSubmit}
              disabled={sendingConfirmation}
            >
              {sendingConfirmation ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                "Confirm"
              )}
            </CButton>
          ) : null}
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmationModal} size="md" centered>
        <Modal.Body>
          <label className="label-name no-capitalized">
            Confirmation Code Has been sent to{" "}
            <span className="text-success">
              {selected ? selected.email : ""}
            </span>
          </label>
          <div className="confirmation-container">
            <input
              name="comfirmation1"
              type="text"
              maxLength="1"
              value={comfirmationValue.comfirmation1}
              className={`${
                comfirmationValue.comfirmation1
                  ? "has-value"
                  : "border border-danger"
              }`}
              onChange={(e) => {
                const { name, value } = e.target;
                setComfirmationValue((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
              onKeyPress={(event) => {
                const { name, value } = event.target;
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                  return;
                } else {
                  setComfirmationValue((prev) => {
                    prev[name] = "";
                    return { ...prev, [name]: value };
                  });
                }
              }}
              onPaste={(e) => {
                const data = e.clipboardData.getData("Text");
                if (!/[0-9]/.test(data)) {
                  e.preventDefault();
                }
              }}
            />
            <input
              name="comfirmation2"
              type="text"
              maxLength="1"
              value={comfirmationValue.comfirmation2}
              className={`${
                comfirmationValue.comfirmation2
                  ? "has-value"
                  : "border border-danger"
              }`}
              onChange={(e) => {
                const { name, value } = e.target;
                setComfirmationValue((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(e) => {
                const data = e.clipboardData.getData("Text");
                if (!/[0-9]/.test(data)) {
                  e.preventDefault();
                }
              }}
            />
            <input
              name="comfirmation3"
              type="text"
              maxLength="1"
              value={comfirmationValue.comfirmation3}
              className={`${
                comfirmationValue.comfirmation3
                  ? "has-value"
                  : "border border-danger"
              }`}
              onChange={(e) => {
                const { name, value } = e.target;
                setComfirmationValue((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(e) => {
                const data = e.clipboardData.getData("Text");
                if (!/[0-9]/.test(data)) {
                  e.preventDefault();
                }
              }}
            />
            <input
              name="comfirmation4"
              type="text"
              maxLength="1"
              value={comfirmationValue.comfirmation4}
              className={`${
                comfirmationValue.comfirmation4
                  ? "has-value"
                  : "border border-danger"
              }`}
              onChange={(e) => {
                const { name, value } = e.target;
                setComfirmationValue((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(e) => {
                const data = e.clipboardData.getData("Text");
                if (!/[0-9]/.test(data)) {
                  e.preventDefault();
                }
              }}
            />
            <input
              name="comfirmation5"
              type="text"
              maxLength="1"
              value={comfirmationValue.comfirmation5}
              className={`${
                comfirmationValue.comfirmation5
                  ? "has-value"
                  : "border border-danger"
              }`}
              onChange={(e) => {
                const { name, value } = e.target;
                setComfirmationValue((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(e) => {
                const data = e.clipboardData.getData("Text");
                if (!/[0-9]/.test(data)) {
                  e.preventDefault();
                }
              }}
            />
            <input
              name="comfirmation6"
              type="text"
              maxLength="1"
              value={comfirmationValue.comfirmation6}
              className={`${
                comfirmationValue.comfirmation6
                  ? "has-value"
                  : "border border-danger"
              }`}
              onChange={(e) => {
                const { name, value } = e.target;
                setComfirmationValue((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onPaste={(e) => {
                const data = e.clipboardData.getData("Text");
                if (!/[0-9]/.test(data)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CButton
            size="lg"
            color={"secondary"}
            onClick={() => {
              setSelected(null);
              setAddModal(false);
              setConfirmationModal(false);
            }}
            disabled={sendingConfirmation}
          >
            Cancel
          </CButton>
          <CButton
            color="success"
            size="lg"
            variant="outline"
            onClick={handleSendDeposit}
          >
            {sendingConfirmation ? (
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
    </>
  );
};
export default CreateNewCustomerDDeposit;
