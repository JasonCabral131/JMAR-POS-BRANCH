import React, { useState } from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import { checkAuthenicatingPassword, logout } from "src/redux/action";
import { useHistory } from "react-router-dom";
import { MdOutlineSecurity } from "react-icons/md";
import { Modal, Collapse } from "react-bootstrap";
import { GoArrowSmallDown, GoArrowSmallUp } from "react-icons/go";
import Authentication from "src/reusable/Authentication";
import Swal from "sweetalert2";
import { PasswordStrengt } from "src/reusable";
import axiosInstance from "src/helpers/axios";
const initialState = {
  current: "",
  newPass: "",
  confirm: "",
};
const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [modal, setModal] = useState(false);
  const [showPDetail, setShowPDetails] = useState(false);
  const [changePassw, setChangePass] = useState(initialState);
  const [authenticationModal, setAuthenticationModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const history = useHistory();
  const profile =
    "https://res.cloudinary.com/seven-eleven-grocery-netlify-com/image/upload/v1632895905/blank_vwt551.jpg";
  const handleUpdatePassword = async () => {
    try {
      setUpdating(true);
      const res = await axiosInstance.post("/change-password-store-info", {
        newPass: changePassw.newPass,
      });
      setUpdating(false);
      if (res.status === 200) {
        Swal.fire({ icon: "success", text: res.data.msg });
        setChangePass(initialState);
        setModal(false);
        return;
      }
      Swal.fire({ icon: "warning", text: res.data.msg });
      setModal(false);
      return;
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Failed to Updated Password",
      });
      setUpdating(false);
      return;
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
      handleUpdatePassword();
      return;
    }
    return res;
  };
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={
              user
                ? user.branch_owner_profile.profile
                  ? user.branch_owner_profile.profile
                  : profile
                : profile
            }
            style={{ width: "35px", height: "35px", borderRadius: "50px" }}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>
            {user
              ? user.branch_owner_lname + ", " + user.branch_owner_fname
              : null}
          </strong>
        </CDropdownItem>
        <CDropdownItem
          onClick={() =>
            history.push("/branch/BlogPosting/personal-blog-content")
          }
        >
          <CIcon name="cil-user" className="mfe-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem
          onClick={() => {
            setModal(true);
          }}
        >
          <MdOutlineSecurity className="mfe-2" />
          Change Password
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem
          onClick={() => {
            dispatch(logout());
          }}
        >
          <AiOutlineLogout size="20" className="mfe-2" />
          Sign out
        </CDropdownItem>
      </CDropdownMenu>
      <Modal show={modal} backdrop="static" size="lg" keyboard={false}>
        <Modal.Header>
          <h4 style={{ fontSize: 20, letterSpacing: 2 }}>
            Change Password <MdOutlineSecurity className=" ml-2 " color="red" />
          </h4>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12 mt-1">
            <div className="percent-container">
              <label className="label-name text-left d-block ">
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
                  <div id="example-collapse-text " style={{ fontSize: "10px" }}>
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
              <input
                type="password"
                placeholder="New Password"
                value={changePassw.newPass}
                onChange={(e) => {
                  setChangePass((prev) => {
                    return { ...prev, newPass: e.target.value };
                  });
                }}
              />
            </div>
          </div>
          <div className="col-md-12 mt-1">
            <div className="percent-container">
              <label className="label-name text-left d-block ">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={changePassw.confirm}
                onChange={(e) => {
                  setChangePass((prev) => {
                    return { ...prev, confirm: e.target.value };
                  });
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-customer button-cancel"
            onClick={() => {
              setChangePass(initialState);
              setModal(false);
            }}
            disabled={updating}
          >
            Cancel
          </button>
          <button
            className="button-customer button-save"
            onClick={() => {
              if (changePassw.newPass === "") {
                Swal.fire({
                  icon: "warning",
                  title: "Password Required",
                });
                return;
              }
              if (changePassw.newPass !== changePassw.confirm) {
                Swal.fire({
                  icon: "warning",
                  title: "Password Does Not Match",
                });
                return;
              }
              if (!PasswordStrengt(changePassw.newPass)) {
                Swal.fire({
                  icon: "warning",
                  text: "Password Required or Valid",
                  timer: 2000,
                });
                return;
              }
              setAuthenticationModal(true);
            }}
            disabled={updating}
          >
            {updating ? (
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
    </CDropdown>
  );
};

export default TheHeaderDropdown;
