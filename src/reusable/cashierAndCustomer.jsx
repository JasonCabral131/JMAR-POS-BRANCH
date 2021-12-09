import React, { useState, useRef } from "react";
import AddressInfo from "src/reusable/Address";
import { Modal, Collapse } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { BsShieldLock, BsPhoneVibrate } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { GoArrowSmallDown, GoArrowSmallUp } from "react-icons/go";
import PDFViewer from "mgr-pdf-viewer-react";

import zipcodes from "zipcodes-ph";
import Carousel, {
  Modal as ReactImagesModal,
  ModalGateway,
} from "react-images";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineFilePdf,
} from "react-icons/ai";
import { CButton } from "@coreui/react";
import {
  calculateAge,
  EmailValidator,
  PasswordStrengt,
  ProfileIdContainer,
  randomString,
  toCapitalized,
} from ".";
import Swal from "sweetalert2";

export const CreateCashierAndCustomer = ({
  addingLoading,
  setAddingLoading,
  showAddModal,
  setShowAddModal,
  handleCreateSubmit,
  info,
  information,
  setInformation,
  images,
  setImages,
  reviewModal,
  setReviewModal,
  resume,
}) => {
  const resumeRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showPDetail, setShowPDetails] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const handleChange = (e) => {
    const { value, name } = e.target;

    if (name === "phone") {
      const regex =
        /(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})/;
      if (regex.test(e.target.value)) {
        setInformation((prev) => {
          return { ...prev, phone: { phone: value, valid: true } };
        });
      } else {
        setInformation((prev) => {
          return { ...prev, phone: { phone: value, valid: false } };
        });
      }
      return;
    }
    if (name === "email") {
      if (EmailValidator(value)) {
        setInformation((prev) => {
          return { ...prev, email: { email: value, valid: true } };
        });
      } else {
        setInformation((prev) => {
          return { ...prev, email: { email: value, valid: false } };
        });
      }
      return;
    }
    setInformation((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = () => {
    if (!information.lastname) {
      Swal.fire({
        icon: "warning",
        text: "LastName required",
        timer: 2000,
      });
      return;
    }
    if (!information.firstname) {
      Swal.fire({
        icon: "warning",
        text: "LastName required",
        timer: 2000,
      });
      return;
    }
    if (!information.phone.valid) {
      Swal.fire({
        icon: "warning",
        text: "Phone Required or Valid",
        timer: 2000,
      });
      return;
    }
    if (
      information.birthday.length < 0 ||
      calculateAge(information.birthday) < 18
    ) {
      Swal.fire({
        icon: "warning",
        text: "birthday Required or Valid",
        timer: 2000,
      });
      return;
    }
    if (!information.sex) {
      Swal.fire({
        icon: "warning",
        text: "Sex Required",
        timer: 2000,
      });
      return;
    }
    if (!information.civilStatus) {
      Swal.fire({
        icon: "warning",
        text: "Status Required",
        timer: 2000,
      });
      return;
    }
    if (!information.email.valid) {
      Swal.fire({
        icon: "warning",
        text: "Email Required or Valid",
        timer: 2000,
      });
      return;
    }
    if (!PasswordStrengt(information.password)) {
      Swal.fire({
        icon: "warning",
        text: "Password Required or Valid",
        timer: 2000,
      });
      return;
    }
    if (!information.address.fullAddress) {
      Swal.fire({
        icon: "warning",
        text: "Home Address Required",
        timer: 2000,
      });
      return;
    }
    if (!images.profile.file) {
      Swal.fire({
        icon: "warning",
        text: "Profile Required",
        timer: 2000,
      });
      return;
    }
    if (!images.FrontId.file) {
      Swal.fire({
        icon: "warning",
        text: "Front ID Required",
        timer: 2000,
      });
      return;
    }
    if (!images.BackId.file) {
      Swal.fire({
        icon: "warning",
        text: "Back ID Required",
        timer: 2000,
      });
      return;
    }
    if (resume) {
      if (!information.resume) {
        Swal.fire({
          icon: "warning",
          text: "Resume Required",
          timer: 2000,
        });
        return;
      }
    }
    setReviewModal(true);
    setShowAddModal(false);
  };
  const handleMaxdate = () => {
    const date = parseInt(new Date().getFullYear()) - 18;
    return `${date + "-12-31"}`.toString();
  };
  const closeLightbox = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  return (
    <>
      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
        }}
        size="lg"
        backdrop="static"
        dialogClassName="modal-cover-screen"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 className="header-card-information">
              <span>Create Branch {info}</span>
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4 border-left-3">
              <label className="label-name text-center d-block">
                Required Information
              </label>
              <ProfileIdContainer
                images={images}
                setImages={setImages}
                update={true}
              />
              <div className="d-flex justify-content-between">
                {resume ? (
                  <CButton
                    className="mt-1"
                    variant={"outline"}
                    color="info"
                    onClick={() => resumeRef.current.click()}
                  >
                    <AiOutlineFilePdf size={20} /> Select Resume
                  </CButton>
                ) : null}

                {information.resume ? (
                  <small className="d-block text-right mt-auto text-bold fs-3">
                    {information.resume.name}
                  </small>
                ) : null}
                <input
                  type="file"
                  multiple={false}
                  accept="application/pdf"
                  ref={resumeRef}
                  className="d-none"
                  name="resume"
                  onChange={(e) => {
                    setInformation((prev) => {
                      const files = e.target.files;
                      for (let file of files) {
                        console.log(file);
                        return { ...prev, resume: file };
                      }
                    });
                  }}
                />
              </div>
              <hr />
            </div>
            <div className="col-md-8 row">
              <label className="label-name text-left   d-block">
                Personal Information
              </label>
              <div className="col-md-4 percent-container">
                <label className="label-name text-left d-block">Lastname</label>
                <input
                  type="text"
                  min="0"
                  value={information.lastname}
                  name="lastname"
                  className=""
                  placeholder={`${info}  Lastname`}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 percent-container">
                <label className="label-name text-left d-block">
                  Firstname
                </label>
                <input
                  type="text"
                  min="0"
                  value={information.firstname}
                  name="firstname"
                  className=""
                  placeholder={`${info} Firstname`}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 percent-container">
                <label className="label-name text-left d-block">
                  Middlename(optional)
                </label>
                <input
                  type="text"
                  min="0"
                  value={information.middlename}
                  name="middlename"
                  className=""
                  placeholder={`${info} Middlename`}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 percent-container mt-1">
                <label className="label-name text-left d-block">Phone</label>
                <input
                  type="text"
                  maxLength={11}
                  name="phone"
                  value={information.phone.phone}
                  className="icon-need"
                  placeholder={`${info} Phone Number`}
                  pattern="[0-9]*"
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
                  onChange={handleChange}
                />
                <BsPhoneVibrate className="iconx" size={25} />
                {information.phone.phone.length > 0 ? (
                  information.phone.valid ? (
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

              <div className="col-md-4 percent-container mt-1">
                <label className="label-name text-left d-block">
                  Birthday(18 Above )
                </label>
                <input
                  type="date"
                  min="0"
                  value={information.birthday}
                  name="birthday"
                  max={handleMaxdate()}
                  className=""
                  placeholder={`${info} Birthday`}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2 percent-container mt-1">
                <label className="label-name text-left d-block">sex</label>
                <select name="sex" onChange={handleChange}>
                  <option value="">Choosing...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="col-md-2 percent-container mt-1">
                <label className="label-name text-left d-block">
                  Civil Status
                </label>
                <select name="civilStatus" onChange={handleChange}>
                  <option value="">Choosing...</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Partnered">Partnered</option>
                </select>
              </div>
              <div className="col-md-6  mt-1">
                <label className="label-name text-left d-block">Email</label>
                <div className="percent-container mt-1">
                  <input
                    type="email"
                    min="0"
                    value={information.email.email}
                    name="email"
                    className="icon-need no-capitalized"
                    placeholder={`${info} Email Address`}
                    onChange={handleChange}
                  />
                  <HiOutlineMail className="icon" size={25} />
                  {information.email.email.length > 0 ? (
                    information.email.valid ? (
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
              <div className="col-md-6">
                <label className="label-name text-left d-block">
                  Password{" "}
                  <small
                    className="text-muted ml-1 text-right"
                    style={{ fontSize: "10px", cursor: "pointer" }}
                    onClick={() => setShowPDetails(!showPDetail)}
                  >
                    show details{" "}
                    {showPDetail ? (
                      <GoArrowSmallUp size={30} />
                    ) : (
                      <GoArrowSmallDown size={30} />
                    )}
                  </small>
                  <Collapse in={showPDetail}>
                    <div
                      id="example-collapse-text"
                      style={{ fontSize: "10px" }}
                    >
                      <p>
                        <span className="text-danger"> * </span> Minimum 8
                        characters
                      </p>
                      <p>
                        <span className="text-danger"> * </span> Maximum 20
                        characters
                      </p>
                      <p>
                        <span className="text-danger"> * </span> At least one
                        uppercase character
                      </p>
                      <p>
                        <span className="text-danger"> * </span> At least one
                        lowercase character
                      </p>
                      <p>
                        <span className="text-danger"> * </span> At least one
                        digit
                      </p>
                    </div>
                  </Collapse>
                </label>
                <div className="percent-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    min="0"
                    value={information.password}
                    name="password"
                    className="icon-need no-capitalized"
                    placeholder={`${info} Password`}
                    onChange={handleChange}
                  />
                  <BsShieldLock
                    className="icon icon-hover"
                    size={25}
                    onClick={() => {
                      setInformation((prev) => {
                        return { ...prev, password: randomString(16) };
                      });
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  {showPassword ? (
                    <FaEye
                      size={25}
                      className="password-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <FaEyeSlash
                      size={25}
                      className="password-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
              </div>

              <div className="col-md-12 percent-container mt-1">
                <label className="label-name text-left d-block">
                  Home Address
                </label>
                <input
                  type={"text"}
                  min="0"
                  name="password"
                  className="icon-no-right no-capitalized"
                  value={
                    information.address.fullAddress
                      ? information.address.fullAddress
                      : ""
                  }
                  placeholder={`${info} Home Address`}
                  disabled={true}
                  style={{ cursor: "not-allowed" }}
                />
                <FaHome
                  className="iconx icon-hover "
                  size={25}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowAddressModal(true)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CButton
            color="secondary"
            variant="outline"
            shape="square"
            size="lg"
            onClick={() => setShowAddModal(false)}
            disabled={addingLoading}
          >
            Cancel
          </CButton>
          <CButton
            color="info"
            variant="outline"
            shape="square"
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
              "Review"
            )}
          </CButton>
        </Modal.Footer>
      </Modal>
      <AddressInfo
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
        setInformation={setInformation}
      />
      <Modal
        show={reviewModal}
        onHide={() => {
          setReviewModal(false);
        }}
        size="lg"
        backdrop="static"
        dialogClassName={"modal-cover-screen"}
      >
        <Modal.Body>
          <h1 className="header-card-information">
            <span>Review {info} Information</span>
          </h1>
          <div className="row p-2">
            <div className={`col-md-12 `}>
              <label className="label-name text-center d-block mt-3 border-bottom p-2">
                {info} Personal Information
              </label>
              <div className="fluid-container">
                <div className="row">
                  <div className="col-md-5 row">
                    <ProfileIdContainer
                      update={false}
                      images={images}
                      setImages={setImages}
                    />
                  </div>
                  <div className="col-md-7 row ">
                    <div className="col-md-6">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Full Name :
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {toCapitalized(
                          information.lastname +
                            " " +
                            information.firstname +
                            " " +
                            information.middlename
                        )}
                      </label>
                    </div>
                    <div className="col-md-3">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Birthday :
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.birthday}
                      </label>
                    </div>
                    <div className="col-md-3">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Age :
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.birthday
                          ? calculateAge(information.birthday)
                          : ""}
                      </label>
                    </div>
                    <div className="col-md-4">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Phone :
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.phone.phone}
                      </label>
                    </div>
                    <div className="col-md-4">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Civil Status :
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.civilStatus ? information.civilStatus : ""}
                      </label>
                    </div>
                    <div className="col-md-4">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Sex :
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.sex ? information.sex : ""}
                      </label>
                    </div>
                    <div className="col-md-12">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Complete Address :
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.address.fullAddress
                          ? toCapitalized(information.address.fullAddress)
                          : ""}
                      </label>
                    </div>
                    <div className="col-md-4">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        City / Mun
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.address.mun
                          ? toCapitalized(information.address.mun.label)
                          : ""}
                      </label>
                    </div>
                    <div className="col-md-4">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Province
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.address.prov
                          ? toCapitalized(information.address.prov.label)
                          : ""}
                      </label>
                    </div>
                    <div className="col-md-4">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Zip Code
                      </label>
                      <label className="d-block label-name text-left text-muted">
                        {information.address.prov
                          ? zipcodes.reverse(
                              toCapitalized(information.address.mun.value.name)
                            )
                          : ""}
                      </label>
                    </div>
                    <div className="col-md-12">
                      <div className="label-name-bar" />
                      <label className="d-block label-name text-left">
                        Email Address
                      </label>
                      <label className="d-block label-name text-left text-muted no-capitalized">
                        {information.email.email}
                      </label>
                    </div>
                    <Modal.Footer>
                      <CButton
                        color="secondary"
                        variant="outline"
                        shape="square"
                        size="lg"
                        onClick={() => {
                          setShowAddModal(true);
                          setReviewModal(false);
                        }}
                        disabled={addingLoading}
                      >
                        Back
                      </CButton>{" "}
                      <CButton
                        color="info"
                        size="lg"
                        className="ml-1"
                        disabled={addingLoading}
                        onClick={() => {
                          handleCreateSubmit(information, images);
                        }}
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
                  </div>
                </div>
                <ModalGateway>
                  {isViewerOpen ? (
                    <ReactImagesModal onClose={closeLightbox}>
                      <Carousel
                        currentIndex={currentImage}
                        views={[
                          { source: information.profile.url },
                          { source: information.frontId.url },
                          { source: information.backId.url },
                        ]}
                      />
                    </ReactImagesModal>
                  ) : null}
                </ModalGateway>
              </div>
            </div>
            {resume ? (
              <div className="col-md-5">
                <label className="label-name text-center d-block mt-3 border-bottom p-2">
                  {info} Resume Information
                </label>
                {information.resume ? (
                  <div className="mt-1 resume-container  ">
                    <PDFViewer
                      document={{
                        file: information.resume,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
