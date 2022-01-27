import React, { useState } from "react";
import "./register.scss";
import zipcodes from "zipcodes-ph";
import {
  calculateAge,
  EmailValidator,
  imagesObject,
  informationObject,
  PasswordStrengt,
  ProfileIdContainer,
  randomString,
  toCapitalized,
} from "src/reusable";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { GoArrowSmallDown, GoArrowSmallUp } from "react-icons/go";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import { Collapse, Modal } from "react-bootstrap";
import AddressInfo from "src/reusable/Address";
import Swal from "sweetalert2";
import { BsShieldLock, BsPhoneVibrate } from "react-icons/bs";
import "src/views/pages/Home/components/Member/RegisterMember/index.scss";
import SignUpHeading from "src/assets/icons/signup.png";
import { useDispatch } from "react-redux";
import { signUpBranch } from "src/redux/action";
const storeAdd = {
  address: {
    reg: null,
    prov: null,
    mun: null,
    brgy: null,
    fullAddress: null,
    st: "",
  },
};
const Register = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState(imagesObject);
  const [information, setInformation] = useState(informationObject);
  const [showPDetail, setShowPDetails] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [storeAddress, setStoreAddress] = useState(storeAdd);
  const [storeAddModal, setStoreAddModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [check, setCheck] = useState(false);
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
  const handleMaxdate = () => {
    const date = parseInt(new Date().getFullYear()) - 18;
    return `${date + "-12-31"}`.toString();
  };
  const handleClear = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All Information will be cleared",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setInformation(informationObject);
        setImages(imagesObject);
        setStoreAddress(storeAdd);
      }
    });
  };
  const handleReview = () => {
    if (!information.lastname) {
      Swal.fire({
        icon: "warning",
        text: "lastname required",
        timer: 2000,
      });
      return;
    }
    if (!information.firstname) {
      Swal.fire({
        icon: "warning",
        text: "firstname required",
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
    if (!information.sex) {
      Swal.fire({
        icon: "warning",
        text: "Sex Required",
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
    if (!information.store_name) {
      Swal.fire({
        icon: "warning",
        text: "Store Name Required",
        timer: 2000,
      });
      return;
    }
    if (!storeAddress.address.fullAddress) {
      Swal.fire({
        icon: "warning",
        text: "Store Address Required",
        timer: 2000,
      });
      return;
    }
    setReviewModal(true);
    return;
  };
  const handleSubmit = () => {
    const {
      lastname,
      firstname,
      middlename,
      email,
      phone,
      birthday,
      sex,
      address,
      password,
      store_name,
    } = information;
    const form = new FormData();
    form.append("branch_address", JSON.stringify(storeAddress.address));
    form.append("branch_name", store_name);
    form.append("fname", firstname);
    form.append("lname", lastname);
    form.append("middlename", middlename);
    form.append("address", JSON.stringify(address));
    form.append("birthday", birthday);
    form.append("phone", phone.phone);
    form.append("sex", sex);
    form.append("email", email.email.toLowerCase());
    form.append("password", password);
    form.append("profile", images.profile.file);
    form.append("backId", images.BackId.file);
    form.append("frontId", images.FrontId.file);
    Swal.fire({
      title: "Are you sure?",
      text: "Check The Review information",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setRegistering(true);
        try {
          const res = await dispatch(signUpBranch(form));
          setRegistering(false);
          if (res.result) {
            setReviewModal(false);
            setInformation(informationObject);
            setImages(imagesObject);
            setCheck(false);
            setStoreAddress(storeAdd);
          }
        } catch (e) {
          setRegistering(false);
        }
      }
    });
  };
  return (
    <div className="c-app c-default-layout flex-row  justify-content-center  gradient__bg ">
      <div className="registrar__container ">
        <label className="label-name text-left gradient__text  d-block">
          Create Your Store Now
        </label>
        <div className="row mb-3">
          <div className="col-md-5">
            <img
              src={SignUpHeading}
              alt="signup"
              style={{ width: "100%", height: "300px" }}
            />
            <div className="label-name-bar mt-3" />
            <label className="label-name text-left d-block text-white ">
              Required Information
            </label>
            <ProfileIdContainer
              images={images}
              setImages={setImages}
              update={true}
            />
          </div>
          <div className="col-md-7 side-signup-customer">
            <div className="row">
              <div className="col-md-4 percent-container mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Store Owner Firstname
                </label>
                <div className="percent-container">
                  <input
                    value={information.firstname}
                    type="text"
                    min="0"
                    name="firstname"
                    className=""
                    placeholder={`firstname`}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-4 percent-container mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Store Owner M.I (Optional)
                </label>
                <div className="percent-container">
                  <input
                    value={information.middlename}
                    type="text"
                    maxLength={1}
                    name="middlename"
                    className=""
                    style={{ textAlign: "center" }}
                    placeholder={`middle initial`}
                    onChange={handleChange}
                    onKeyPress={(event) => {
                      if (/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const data = e.clipboardData.getData("Text");
                      if (/[0-9]/.test(data)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4 percent-container mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Store Owner Lastname
                </label>
                <div className="percent-container">
                  <input
                    value={information.lastname}
                    type="text"
                    min="0"
                    name="lastname"
                    className=""
                    placeholder={`lastname`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-4 mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Phone
                </label>
                <div className="percent-container">
                  <input
                    type="text"
                    maxLength={11}
                    name="phone"
                    value={information.phone.phone}
                    className="icon-need no-capitalized"
                    placeholder={` Phone Number`}
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
                  <BsPhoneVibrate className="home-signup-iconx" size={25} />
                  {information.phone.phone.length > 0 ? (
                    information.phone.valid ? (
                      <AiOutlineCheckCircle
                        size={25}
                        className="text-success home-signup-icony"
                      />
                    ) : (
                      <AiOutlineCloseCircle
                        size={25}
                        className="text-danger home-signup-icony"
                      />
                    )
                  ) : null}
                </div>
              </div>
              <div className="col-md-4 mt-2">
                <div className=" percent-container mt-1">
                  <div className="label-name-bar" />
                  <label className="label-name text-left d-block text-white">
                    sex
                  </label>
                  <select name="sex" onChange={handleChange}>
                    {!information.sex ? (
                      <option value="" selected={true}>
                        Choosing...
                      </option>
                    ) : null}

                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4  mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Birthday(18 Above )
                </label>
                <div className="percent-container">
                  <input
                    type="date"
                    min="0"
                    value={information.birthday}
                    name="birthday"
                    onKeyPress={(event) => {
                      event.preventDefault();
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                    }}
                    max={handleMaxdate()}
                    className="no-capitalized"
                    placeholder={` Birthday`}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-12 mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Home Address
                </label>
                <div className="percent-container">
                  <input
                    type={"text"}
                    min="0"
                    name="password"
                    className="icon-no-right no-capitalized bg-white"
                    value={
                      information.address.fullAddress
                        ? information.address.fullAddress
                        : ""
                    }
                    placeholder={`Home Address`}
                    disabled={true}
                    style={{ cursor: "not-allowed" }}
                  />
                  <FaHome
                    className="home-signup-iconx icon-hover "
                    size={25}
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAddressModal(true)}
                  />
                </div>
              </div>
              <label className="label-name text-left gradient__text  d-block mt-4">
                Store Information
              </label>
              <div className="col-md-4  mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Store Name
                </label>
                <div className="percent-container">
                  <input
                    type="text"
                    min="0"
                    value={information.store_name}
                    name="store_name"
                    max={handleMaxdate()}
                    className="no-capitalized"
                    placeholder={`Store Name (ex: Jarm's)`}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-8 mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Store Address
                </label>
                <div className="percent-container">
                  <input
                    type={"text"}
                    min="0"
                    name="password"
                    className="icon-no-right no-capitalized bg-white"
                    value={
                      storeAddress.address.fullAddress
                        ? storeAddress.address.fullAddress
                        : ""
                    }
                    placeholder={`Store Address`}
                    disabled={true}
                    style={{ cursor: "not-allowed" }}
                  />
                  <FaHome
                    className="home-signup-iconx icon-hover "
                    size={25}
                    style={{ cursor: "pointer" }}
                    onClick={() => setStoreAddModal(true)}
                  />
                </div>
              </div>
              <label className="label-name text-left gradient__text  d-block mt-4">
                Security Login Credential
              </label>
              <div className="col-md-6  mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Email Address
                </label>
                <div className="percent-container">
                  <input
                    type="email"
                    min="0"
                    value={information.email.email}
                    name="email"
                    className="icon-need no-capitalized"
                    placeholder={` Email Address`}
                    onChange={handleChange}
                  />
                  <HiOutlineMail className="home-signup-iconx" size={25} />
                  {information.email.email.length > 0 ? (
                    information.email.valid ? (
                      <AiOutlineCheckCircle
                        size={25}
                        className="text-success home-signup-icony"
                      />
                    ) : (
                      <AiOutlineCloseCircle
                        size={25}
                        className="text-danger home-signup-icony"
                      />
                    )
                  ) : null}
                </div>
              </div>
              <div className="col-md-6  mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block text-white">
                  Password
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
                      id="example-collapse-text "
                      style={{ fontSize: "10px" }}
                    >
                      <p>
                        <span className="text-danger"> * </span> Minimum 8
                        characters
                      </p>
                      <p>
                        <span className="text-danger "> * </span> Maximum 20
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
                <div className="percent-container mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    min="0"
                    value={information.password}
                    name="password"
                    className="icon-need no-capitalized"
                    placeholder={`password`}
                    onChange={handleChange}
                  />
                  <BsShieldLock
                    className="home-signup-iconx icon-hover"
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
                      className="home-signup-icony"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <FaEyeSlash
                      size={25}
                      className="home-signup-icony"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-12 d-flex justify-content-end mt-3">
                <button
                  className="button-customer button-cancel"
                  onClick={handleClear}
                  disabled={registering}
                >
                  Clear
                </button>
                <button
                  className="button-customer button-review"
                  onClick={handleReview}
                  disabled={registering}
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddressInfo
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
        setInformation={setInformation}
      />
      <AddressInfo
        showAddressModal={storeAddModal}
        setShowAddressModal={setStoreAddModal}
        setInformation={setStoreAddress}
      />
      <Modal
        show={reviewModal}
        onHide={() => {
          setReviewModal(false);
        }}
        backdrop="static"
        dialogClassName="modal-90w shadow "
      >
        <Modal.Body className="gradient__bg">
          <div className="label-name-bar mt-3" />
          <h1 className="brand-name text-left d-block text-white gradient__text">
            Review Your Information
          </h1>
          <div className="row">
            <div className="col-md-5">
              <ProfileIdContainer
                images={images}
                setImages={setImages}
                update={false}
              />
            </div>
            <div className="col-md-7 row">
              <label className="label-name text-left gradient__text  d-block">
                Store Owner Personal Information
              </label>
              <div className="col-md-6">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Full Name
                </label>
                <label className="label-name">
                  {toCapitalized(
                    information.lastname +
                      ", " +
                      information.firstname +
                      " " +
                      information.middlename
                  )}
                </label>
              </div>
              <div className="col-md-4 ">
                <label className="label-name d-block text-left gradient_text_light_green">
                  birthday
                </label>
                <label className="label-name">
                  {toCapitalized(information.birthday)}
                </label>
              </div>
              <div className="col-md-2 ">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Age
                </label>
                <label className="label-name">
                  {information.birthday
                    ? calculateAge(information.birthday)
                    : ""}
                </label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Phone
                </label>
                <label className="label-name">{information.phone.phone}</label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Sex
                </label>
                <label className="label-name">{information.sex}</label>
              </div>
              <div className="col-md-12">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Home Address
                </label>
                <label className="label-name">
                  {information.address.fullAddress
                    ? information.address.fullAddress
                    : ""}
                </label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  City/ Mun
                </label>
                <label className="label-name">
                  {information.address.mun ? information.address.mun.label : ""}
                </label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Province
                </label>
                <label className="label-name">
                  {information.address.prov
                    ? information.address.prov.label
                    : ""}
                </label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Zip Code
                </label>
                <label className="label-name">
                  {information.address.prov
                    ? zipcodes.reverse(
                        toCapitalized(information.address.mun.value.name)
                      )
                    : ""}
                </label>
              </div>
              <label className="label-name text-left gradient__text  d-block">
                Store Information
              </label>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Store Name
                </label>
                <label className="label-name">
                  {information ? information.store_name : ""}
                </label>
              </div>
              <div className="col-md-8">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Store Location Address
                </label>
                <label className="label-name">
                  {storeAddress.address.fullAddress
                    ? storeAddress.address.fullAddress
                    : ""}
                </label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  City/ Mun
                </label>
                <label className="label-name">
                  {storeAddress.address.mun
                    ? storeAddress.address.mun.label
                    : ""}
                </label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Province
                </label>
                <label className="label-name">
                  {storeAddress.address.prov
                    ? storeAddress.address.prov.label
                    : ""}
                </label>
              </div>
              <div className="col-md-4">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Zip Code
                </label>
                <label className="label-name">
                  {storeAddress.address.prov
                    ? zipcodes.reverse(
                        toCapitalized(storeAddress.address.mun.value.name)
                      )
                    : ""}
                </label>
              </div>
              <label className="label-name text-left gradient__text  d-block">
                Security Credentials
              </label>
              <div className="col-md-6">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Email Address
                </label>
                <label className="label-name">{information.email.email}</label>
              </div>
              <div className="col-md-6">
                <label className="label-name d-block text-left gradient_text_light_green">
                  Password
                </label>
                <label className="label-name">{information.password}</label>
              </div>
              <div className="col-md-12 pl-2 mt-3">
                <div className="d-flex w-100">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={check}
                    onClick={() => {
                      setCheck(!check);
                    }}
                  />
                  <label className="label-name text-left gradient__text  d-block">
                    Terms & Conditopm
                  </label>
                </div>
                <p className="ml-1 text-white">
                  I give my consent by providing my personal information to be
                  used on applying for free GROCERY SALE MONITORING (POS)
                  sponsored by{" "}
                  <label className="label-name text-left gradient__text ">
                    JARM INC.
                  </label>{" "}
                  as part of the Store Membership. (Republic Act No. 10173 –
                  Data Privacy Act of 2012)
                </p>
              </div>
              <div className="col-md-12 d-flex d-flex justify-content-end">
                <button
                  className="button-customer button-back"
                  onClick={() => {
                    setReviewModal(false);
                  }}
                  disabled={registering}
                >
                  Back
                </button>
                {check ? (
                  <button
                    className="button-customer button-save"
                    onClick={handleSubmit}
                    disabled={registering}
                  >
                    {registering ? (
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
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Register;
