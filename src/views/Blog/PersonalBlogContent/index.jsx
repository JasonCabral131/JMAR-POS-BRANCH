import React, { useState, useRef } from "react";
import "./style.scss";
import background from "src/assets/icons/background.png";
import { useDispatch, useSelector } from "react-redux";
import jarm from "src/assets/icons/Jarm_Logo.svg";
import { MdModeEditOutline } from "react-icons/md";
import { useHistory, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { AiOutlineClose, AiFillCamera } from "react-icons/ai";
import Jarm from "src/assets/icons/hamburger_logo_expand.png";
import { EmailValidator, getBase64, informationObject } from "src/reusable";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import Loader from "react-loader-spinner";
import axiosInstance from "src/helpers/axios";
import {
  checkAuthenicatingPassword,
  checkIsStillValidOwner,
  logout,
} from "src/redux/action";
import { RiStore2Line } from "react-icons/ri";
import Authentication from "src/reusable/Authentication";
import Swal from "sweetalert2";
import { BsPhoneVibrate } from "react-icons/bs";
import AddressInfo from "src/reusable/Address";
import { FaHome } from "react-icons/fa";

const PersonalBlogContent = (props) => {
  const { user, token } = useSelector((state) => state.auth);

  const history = useHistory();
  const initialInformation = {
    ...informationObject,
    address: JSON.parse(user?.branch_owner_address),
    store_name: user?.branch_name,
    phone: { phone: user?.branch_owner_phone, valid: true },
    email: { email: user?.branch_owner_email, valid: true },
  };
  const initialStoreAdd = {
    address: user?.branch_address,
  };
  const location = useLocation();
  const store = useRef();
  const dispatch = useDispatch();

  const [updateModal, setUpdateModal] = useState(false);
  const [information, setInformation] = useState(initialInformation);
  const [storeAddress, setStoreAdd] = useState(initialStoreAdd);
  const [storeAddModal, setStoreAddModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [dataUrl, setDataUrl] = useState(null);
  const [authenticationModal, setAuthenticationModal] = useState(false);
  const [updatingBackground, setUpdatingBackground] = useState(false);
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const handleUpdateStore = async () => {
    try {
      setUpdatingInfo(true);
      const res = await axiosInstance.post(
        "/update-store-information-details",
        {
          phone: information.phone.phone,
          email: information.email.email,
          address: JSON.stringify(information.address),
          store_add: JSON.stringify(storeAddress.address),
          store_name: information.store_name,
        }
      );
      if (res.status === 200) {
        if (user) {
          await dispatch(checkIsStillValidOwner({ token, _id: user._id }));
        } else {
          dispatch(logout());
        }
        Swal.fire({
          icon: "success",
          text: "Store Information Successfully Updated",
        });
        setUpdateModal(false);
        setUpdatingInfo(false);
        return;
      }
      Swal.fire({
        icon: "warning",
        text: res.data.msg,
      });
      setUpdatingInfo(false);
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Failed to Updated Store Information",
      });
      setUpdatingInfo(false);
    }
  };
  const handleSubmitAuth = async (password) => {
    if (password === "") {
      Swal.fire({
        icon: "warning",
        text: "Password required!",
      });
      return;
    }
    const res = await dispatch(checkAuthenicatingPassword({ password }));
    if (res) {
      setAuthenticationModal(false);
      handleUpdateStore();
      return;
    }
    return res;
  };
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
  const handleReview = () => {
    if (!information.phone.valid) {
      Swal.fire({
        icon: "warning",
        text: "Phone Required or Valid",
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
    if (!information.address.fullAddress) {
      Swal.fire({
        icon: "warning",
        text: "Home Address Required",
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
    setAuthenticationModal(true);
    return;
  };
  return (
    <div className="personl-container">
      <div className="profile-container">
        <div className="user-profile-container  p-2">
          <div className="profile-background">
            <img alt="background-img" src={background} />
            <h1 className="branch-name">
              {user ? `${user.branch_name} Store` : null}
            </h1>
            <div className="lining-style" />
            <div className="avatar-container">
              <img
                className="avatar-profile"
                alt="avatar-profile"
                src={
                  user
                    ? user.branch_owner_profile.profile
                      ? user.branch_owner_profile.profile
                      : jarm
                    : jarm
                }
              />
            </div>
            <div className="user-personal-info">
              <h1>
                <span>
                  {user
                    ? `${user.branch_owner_fname} ${user.branch_owner_MI} ${user.branch_owner_lname}`
                    : null}
                </span>
              </h1>
              <h2>{user ? user.branch_address.fullAddress : null}</h2>
            </div>
          </div>

          <div className="default-space" />
          <div className="profile-navigation">
            <div className="profile-navigation-lists">
              <p
                className={
                  location.pathname ===
                  "/branch/BlogPosting/personal-blog-content"
                    ? "active-route"
                    : ""
                }
                onClick={() =>
                  history.push("/branch/BlogPosting/personal-blog-content")
                }
              >
                Blog
              </p>
              {/* <p
                onClick={() =>
                  history.push(
                    "/branch/BlogPosting/personal-blog-content/blog-photo-album"
                  )
                }
                className={
                  location.pathname ===
                  "/branch/BlogPosting/personal-blog-content/blog-photo-album"
                    ? "active-route"
                    : ""
                }
              >
                Photo
              </p> */}
            </div>
            <div className="edit-profile-navgiation">
              <button
                onClick={() => {
                  setModal(true);
                }}
              >
                <MdModeEditOutline size={20} />{" "}
                <span style={{ marginTop: 5 }}>Edit profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={modal}
        onHide={() => setModal(false)}
        size={"xl"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div className="heading-profile-store-container">
            <div className="store-profile">
              {updatingBackground ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader
                    type="BallTriangle"
                    height={100}
                    width={100}
                    color="grey"
                  />
                </div>
              ) : (
                <img
                  alt={Math.random()}
                  src={
                    dataUrl
                      ? dataUrl
                      : user
                      ? user.storeProf
                        ? user.storeProf.background.url
                        : Jarm
                      : Jarm
                  }
                />
              )}

              {updatingBackground ? (
                <div className="loadingStyle">
                  <Skeleton height={37} width={180} />
                </div>
              ) : (
                <>
                  <div
                    className="edit-background shadow"
                    onClick={() => {
                      store.current.click();
                    }}
                  >
                    <AiFillCamera size={25} /> <span>Edit store profile </span>
                  </div>
                  <div
                    className="edit-store shadow"
                    onClick={() => {
                      setUpdateModal(true);
                      setModal(false);
                    }}
                  >
                    <RiStore2Line size={25} />{" "}
                    <span>Edit Store Information </span>
                  </div>
                </>
              )}
            </div>
            <img
              className="profile-avatar-store"
              src={user ? user.branch_owner_profile.profile : ""}
              alt={Math.random()}
            />
            <div className="close-model-x" onClick={() => setModal(false)}>
              <AiOutlineClose size={15} />
            </div>
          </div>

          <div className="information-content-store">
            <div className="row">
              <div className="col-md-5 mt-1">
                <label className="label-name ">Firstname</label>
                <div className="percent-container">
                  <input
                    className="form-control edit-input bg-white"
                    placeholder="Input firstname"
                    disabled
                    value={user ? user.branch_owner_fname : ""}
                  />
                </div>
              </div>
              <div className="col-md-3 mt-1">
                <label className="label-name ">Middle Initial</label>
                <div className="percent-container">
                  <input
                    className=" edit-input bg-white"
                    placeholder="Middle Initial"
                    disabled
                    value={user ? user.branch_owner_MI : ""}
                  />
                </div>
              </div>
              <div className="col-md-4 mt-1">
                <label className="label-name ">Lastname</label>
                <div className="percent-container">
                  <input
                    value={user ? user.branch_owner_lname : ""}
                    className="edit-input bg-white"
                    placeholder="input lastname "
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4 mt-1">
                <label className="label-name ">Phone</label>
                <div className="percent-container">
                  <input
                    value={user ? user.branch_owner_phone : ""}
                    onChange={(e) => {}}
                    className="form-control edit-input bg-white"
                    placeholder="input lastname"
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4 mt-1">
                <label className="label-name ">Sex</label>
                <div className="percent-container">
                  <input
                    value={user ? user.branch_owner_sex : ""}
                    onChange={(e) => {}}
                    className="form-control edit-input bg-white"
                    placeholder="input lastname"
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4 mt-1">
                <label className="label-name ">Birthday</label>
                <div className="percent-container">
                  <input
                    value={user ? user.branch_owner_birthday : ""}
                    onChange={(e) => {}}
                    className="form-control edit-input bg-white"
                    placeholder="input lastname"
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-12 mt-1">
                <label className="label-name ">Address</label>
                <div className="percent-container">
                  <input
                    value={
                      user
                        ? JSON.parse(user.branch_owner_address).fullAddress
                        : ""
                    }
                    onChange={(e) => {}}
                    className="form-control edit-input bg-white"
                    placeholder="input lastname"
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-4 mt-1">
                <label className="label-name ">Store Name</label>
                <div className="percent-container">
                  <input
                    value={user ? user.branch_name : ""}
                    onChange={(e) => {}}
                    className="form-control edit-input bg-white"
                    placeholder="input lastname"
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-8 mt-1">
                <label className="label-name ">Store Address</label>
                <div className="percent-container">
                  <input
                    value={user ? user.branch_address.fullAddress : ""}
                    onChange={(e) => {}}
                    className="form-control edit-input bg-white"
                    placeholder="input lastname"
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-12 mt-1">
                <label className="label-name gradient__text">
                  Email Address
                </label>
                <div className="percent-container">
                  <input
                    value={user ? user.branch_owner_email : ""}
                    onChange={(e) => {}}
                    className="form-control edit-input bg-white"
                    placeholder="input lastname"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="d-none">
            <input
              type="file"
              ref={store}
              multiple={false}
              accept="image/*"
              onChange={async (e) => {
                const { files } = e.target;
                if (files.length > 0) {
                  try {
                    setUpdatingBackground(true);
                    const url = await getBase64(files[0]);
                    const form = new FormData();
                    form.append("image", files[0]);
                    const res = await axiosInstance.post(
                      "/update-background-profile",
                      form
                    );
                    setUpdatingBackground(false);

                    if (res.status === 200) {
                      if (user && token) {
                        dispatch(
                          checkIsStillValidOwner({ token, _id: user._id })
                        );
                      }
                      setDataUrl(url);
                    }
                  } catch (e) {
                    setUpdatingBackground(false);
                  }
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={updateModal} size={"lg"}>
        <Modal.Body>
          <div className="heading-profile-store-container">
            <div
              className="close-model-x"
              onClick={() => {
                setUpdateModal(false);
                setInformation(initialInformation);
                setStoreAdd(initialStoreAdd);
              }}
            >
              <AiOutlineClose size={15} />
            </div>
            <h1 className="header-card-information">
              <span>Update Store Information</span>
            </h1>
            <div className="w-100 row">
              <div className="col-md-6 mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block ">Phone</label>
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
              <div className="col-md-6  mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block ">
                  Store Name
                </label>
                <div className="percent-container">
                  <input
                    type="text"
                    min="0"
                    value={information.store_name}
                    name="store_name"
                    className="no-capitalized"
                    placeholder={`Store Name (ex: Jarm's)`}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-12  mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block">
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
              <div className="col-md-12 mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block ">
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
              <div className="col-md-12 mt-2">
                <div className="label-name-bar" />
                <label className="label-name text-left d-block ">
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-customer button-save"
            onClick={() => {
              handleReview();
            }}
            disabled={updatingInfo}
          >
            {updatingInfo ? (
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
        </Modal.Footer>
      </Modal>
      <Authentication
        authenticationModal={authenticationModal}
        setAuthenticationModal={setAuthenticationModal}
        handleSubmitAuth={handleSubmitAuth}
      />
      <AddressInfo
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
        setInformation={setInformation}
      />
      <AddressInfo
        showAddressModal={storeAddModal}
        setShowAddressModal={setStoreAddModal}
        setInformation={setStoreAdd}
      />
    </div>
  );
};

export default PersonalBlogContent;
