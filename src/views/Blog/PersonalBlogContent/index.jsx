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
import { getBase64 } from "src/reusable";

import Skeleton from "react-loading-skeleton";
import Loader from "react-loader-spinner";
import axiosInstance from "src/helpers/axios";
import { checkIsStillValidOwner } from "src/redux/action";

const PersonalBlogContent = (props) => {
  const location = useLocation();
  const store = useRef();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const history = useHistory();

  const [modal, setModal] = useState(false);
  const [dataUrl, setDataUrl] = useState(null);

  const [updatingBackground, setUpdatingBackground] = useState(false);

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
              <p
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
              </p>
            </div>
            <div className="edit-profile-navgiation">
              <button
                onClick={() => {
                  setModal(true);
                }}
              >
                <MdModeEditOutline size={20} /> <span>Profile</span>
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
                <div
                  className="edit-background shadow"
                  onClick={() => {
                    store.current.click();
                  }}
                >
                  <AiFillCamera size={25} /> <span>Edit store profile </span>
                </div>
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
    </div>
  );
};

export default PersonalBlogContent;
