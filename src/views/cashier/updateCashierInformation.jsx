import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import FrontId from "./../../assets/icons/FrontId.jpg";
import { BsPhoneVibrate } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { FaHome } from "react-icons/fa";
import { CButton } from "@coreui/react";
import { IoPencilOutline } from "react-icons/io5";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import AddressInfo from "src/reusable/Address";
import { calculateAge, EmailValidator, getBase64 } from "src/reusable";
//import PDFViewer from "mgr-pdf-viewer-react";
import { useDispatch } from "react-redux";
import { updateCashierInformation } from "src/redux/action";
const UpdateCashierInformation = ({
  updateModal,
  setUpdateModal,
  cashierInformation,
  setcashierInformation,
  credentials,
  setCredential,
  loadingUpdate,
  setLoadingUpdate,
}) => {
  const profileRef = useRef();
  const frontIdRef = useRef();
  const backIdRef = useRef();
  const dispatch = useDispatch();
  const [validation, setValidation] = useState({ email: true, phone: true });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "phone") {
      setValidation((prev) => {
        const phone =
          /(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})/.test(
            value
          );
        return { ...prev, phone };
      });
    }
    if (name === "email") {
      setValidation((prev) => {
        const email = EmailValidator(value);
        return { ...prev, email };
      });
    }
    setcashierInformation((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleOnChangeImage = async (e) => {
    const { files, name } = e.target;
    for (let file of files) {
      const dataUrl = await getBase64(file);
      setCredential((prev) => {
        console.log({
          ...prev,
          [name]: { ...prev[name], file: file, dataUrl },
        });
        return { ...prev, [name]: { ...prev[name], file: file, dataUrl } };
      });
    }
  };
  const handleUpdate = () => {
    const {
      lastname,
      firstname,
      middlename,
      email,
      phone,
      birthday,
      sex,
      address,
      civilStatus,
      _id,
    } = cashierInformation;

    if (!lastname) {
      Swal.fire({
        icon: "warning",
        text: "LastName required",
        timer: 2000,
      });
      return;
    }
    if (!firstname) {
      Swal.fire({
        icon: "warning",
        text: "LastName required",
        timer: 2000,
      });
      return;
    }
    if (birthday.length < 0 || calculateAge(birthday) < 18) {
      Swal.fire({
        icon: "warning",
        text: "birthday Required or Valid",
        timer: 2000,
      });
      return;
    }
    if (!sex) {
      Swal.fire({
        icon: "warning",
        text: "Sex Required",
        timer: 2000,
      });
      return;
    }
    if (!civilStatus) {
      Swal.fire({
        icon: "warning",
        text: "Status Required",
        timer: 2000,
      });
      return;
    }
    if (!validation.phone) {
      Swal.fire({
        icon: "warning",
        text: "Phone Required or Valid",
        timer: 2000,
      });
      return;
    }
    if (!validation.email) {
      Swal.fire({
        icon: "warning",
        text: "Email Required or Valid",
        timer: 2000,
      });
      return;
    }

    const form = new FormData();
    form.append("lastname", lastname);
    form.append("firstname", firstname);
    form.append("middlename", middlename);
    form.append("email", email);
    form.append("phone", phone);
    form.append("birthday", birthday);
    form.append("sex", sex);
    form.append("address", JSON.stringify(address));
    form.append("civilStatus", civilStatus);
    form.append("_id", _id);

    if (credentials.profile.file) {
      form.append("profile", credentials.profile.file);
    }
    if (credentials.FrontId.file) {
      form.append("frontId", credentials.FrontId.file);
    }
    if (credentials.BackId.file) {
      form.append("backId", credentials.BackId.file);
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Update",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingUpdate(true);
        const res = await dispatch(updateCashierInformation(form));
        if (res.result) {
          setUpdateModal(false);
          setLoadingUpdate(false);
          return;
        }
        setLoadingUpdate(false);
      }
    });
  };
  return (
    <>
      <Modal
        show={updateModal}
        onHide={() => {
          setUpdateModal(false);
        }}
        size="lg"
        backdrop="static"
        dialogClassName="modal-cover-screen"
      >
        <Modal.Body>
          <input
            ref={profileRef}
            multiple={false}
            type="file"
            accept="image/*"
            name="profile"
            className="d-none"
            onChange={handleOnChangeImage}
          />
          <input
            ref={frontIdRef}
            multiple={false}
            type="file"
            name="FrontId"
            accept="image/*"
            className="d-none"
            onChange={handleOnChangeImage}
          />
          <input
            ref={backIdRef}
            multiple={false}
            type="file"
            accept="image/*"
            className="d-none"
            name="BackId"
            onChange={handleOnChangeImage}
          />
          {cashierInformation ? (
            <div className="row p-2">
              <div className="col-md-6 card pb-2">
                <label className="label-name text-center d-block mt-3 border-bottom p-2">
                  Cashier Personal Information
                </label>
                <div className="row">
                  <div className="col-md-4">
                    <div className="profile-container-table">
                      <img
                        alt="profile-information-img"
                        src={
                          credentials.profile.file
                            ? credentials.profile.dataUrl
                            : cashierInformation.profile.url
                            ? cashierInformation.profile.url
                            : FrontId
                        }
                      />
                      <IoPencilOutline
                        size={35}
                        className="upload-new-img"
                        onClick={() => profileRef.current.click()}
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="percent-container">
                          <label className="label-name text-left d-block">
                            Lastname
                          </label>
                          <input
                            placeholder="lastname"
                            name="lastname"
                            value={cashierInformation.lastname}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="percent-container">
                          <label className="label-name text-left d-block">
                            Firstname
                          </label>
                          <input
                            placeholder="firstname"
                            name="firstname"
                            value={cashierInformation.firstname}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="percent-container">
                          <label className="label-name text-left d-block">
                            Middlename
                          </label>
                          <input
                            placeholder="middlename"
                            name="middlename"
                            value={cashierInformation.middlename}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="label-name text-left d-block">
                          Phone
                        </label>
                        <div className="percent-container">
                          <input
                            name="phone"
                            value={cashierInformation.phone}
                            onChange={handleChange}
                            className="icon-need"
                            placeholder="phone required"
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
                            maxLength={11}
                          />
                          <BsPhoneVibrate className="icon" size={25} />
                          {cashierInformation.phone.length > 0 ? (
                            validation.phone ? (
                              <AiOutlineCheckCircle
                                size={25}
                                className="text-success password-icon"
                              />
                            ) : (
                              <AiOutlineCloseCircle
                                size={25}
                                className="text-danger password-icon"
                              />
                            )
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 mt-1 border-top">
                    <div className="row">
                      <div className="col-md-4">
                        <label className="label-name text-left d-block">
                          birthday
                        </label>
                        <div className="percent-container">
                          <input
                            placeholder="phone required"
                            type="date"
                            name="birthday"
                            value={cashierInformation.birthday}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="label-name text-left d-block">
                          Sex
                        </label>
                        <div className="percent-container">
                          <select name="sex">
                            <option value={cashierInformation.sex}>
                              {cashierInformation.sex}
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="label-name text-left d-block">
                          Civil Status
                        </label>
                        <div className="percent-container">
                          <select name="sex">
                            <option value={cashierInformation.civilStatus}>
                              {cashierInformation.civilStatus}
                            </option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Separated">Separated</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Partnered">Partnered</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <label className="label-name text-left d-block">
                          Email Address
                        </label>
                        <div className="percent-container">
                          <input
                            name="email"
                            value={cashierInformation.email}
                            onChange={handleChange}
                            type="email"
                            className="icon-need no-capitalized"
                            placeholder={`Email Address`}
                          />
                          <HiOutlineMail className="icon" size={25} />
                          {cashierInformation.email.length > 0 ? (
                            validation.email ? (
                              <AiOutlineCheckCircle
                                size={25}
                                className="text-success password-icon"
                              />
                            ) : (
                              <AiOutlineCloseCircle
                                size={25}
                                className="text-danger password-icon"
                              />
                            )
                          ) : null}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <label className="label-name text-left d-block">
                          Complete Address
                        </label>
                        <div className="percent-container">
                          <input
                            value={cashierInformation.address.fullAddress}
                            type="email"
                            name="address"
                            className="icon-no-right no-capitalized"
                            placeholder={` Home Address`}
                            disabled={true}
                            style={{ cursor: "not-allowed" }}
                          />
                          <FaHome
                            className="icon icon-hover "
                            size={25}
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowAddressModal(true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 card">
                {/* <label className="label-name text-center d-block mt-3 border-bottom p-2">
                  Resume Information
                </label>
                {cashierInformation ? (
                  <label className="label-name text-center d-block mt-3 p-2 text-danger">
                    sorry we are using 3rd party cloud service and this is a
                    free account, need to Have Plan account in order to access
                    this file!
                  </label>
                ) :

                null} */}
                <div className="row border-top">
                  <div className="col-md-6">
                    <label className="label-name text-center d-block mt-3  p-2">
                      Front Id
                    </label>
                    <div
                      className="w-100"
                      style={{ height: "200px", position: "relative" }}
                    >
                      <img
                        src={
                          credentials.FrontId.file
                            ? credentials.FrontId.dataUrl
                            : cashierInformation.frontId.url
                            ? cashierInformation.frontId.url
                            : FrontId
                        }
                        alt="front-id"
                        style={{ width: "100%", height: "200px" }}
                      />
                      <IoPencilOutline
                        size={35}
                        className="upload-new-img"
                        onClick={() => frontIdRef.current.click()}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="label-name text-center d-block mt-3  p-2">
                      Back Id
                    </label>
                    <div
                      className="w-100"
                      style={{ height: "200px", position: "relative" }}
                    >
                      <img
                        alt="back-id"
                        style={{ width: "100%", height: "200px" }}
                        src={
                          credentials.BackId.file
                            ? credentials.BackId.dataUrl
                            : cashierInformation.backId.url
                            ? cashierInformation.backId.url
                            : FrontId
                        }
                      />
                      <IoPencilOutline
                        size={35}
                        className="upload-new-img"
                        onClick={() => backIdRef.current.click()}
                      />
                    </div>
                  </div>
                </div>
                <Modal.Footer>
                  <CButton
                    color="secondary"
                    variant="outline"
                    shape="square"
                    size="lg"
                    disabled={loadingUpdate}
                    onClick={() => {
                      setValidation({ email: true, phone: true });
                      setUpdateModal(false);
                    }}
                  >
                    Back
                  </CButton>{" "}
                  <CButton
                    color="info"
                    size="lg"
                    className="ml-1"
                    disabled={loadingUpdate}
                    onClick={handleUpdate}
                  >
                    {loadingUpdate ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        wait updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </CButton>
                </Modal.Footer>
              </div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
      <AddressInfo
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
        setInformation={setcashierInformation}
      />
    </>
  );
};
export default UpdateCashierInformation;
