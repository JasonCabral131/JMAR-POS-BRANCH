import React, { useState } from "react";
import "src/views/pages/login/index.css";
import pngChange from "src/assets/icons/emailverify.png";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { EmailValidator } from "src/reusable";
import { HiOutlineMail } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import cashierAxios from "src/helpers/cashierAxios";
import Swal from "sweetalert2";

const initialState = {
  email: { email: "", valid: false },
};
const ForgotPasswordCashier = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [userInformation, setUserInformation] = useState(initialState);
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setUserInformation((prev) => {
      return {
        ...prev,
        email: { email: value, valid: EmailValidator(value) },
      };
    });
  };
  const handleChangePass = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (userInformation.email.email.length < 0) {
      setError("Please Provide Email Address");
      setLoading(false);
      return;
    }
    if (!userInformation.email.valid) {
      setError("Please Provide Valid Email Address");
      setLoading(false);
      return;
    }
    try {
      const res = await cashierAxios.post(
        "/cashier-forgot-password-email-verification",
        { email: userInformation.email.email }
      );
      setLoading(false);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Check your Email",
        });
        setUserInformation(initialState);
        history.push("/JARM/sign-in");
        return;
      } else {
        Swal.fire({
          icon: "warning",
          text: "Invalid Email Address",
        });
        setUserInformation(initialState);
        history.push("/JARM/sign-in");
        return;
      }
    } catch (e) {
      Swal.fire({
        icon: "warning",
        text: "Invalid Email Address",
      });
      setUserInformation(initialState);
      setLoading(false);
      history.push("/JARM/sign-in");
      return;
    }
    // eslint-disable-next-line
  };
  return (
    <div className="login-component-container">
      <section className="section-container side">
        <img src={pngChange} alt="login  img information " />
      </section>
      <section className="section-container main">
        <div className="login-container">
          <p className="title gradient__text">Change Your Password</p>
          <div className="separator" />
          <p className="welcome-message">
            Please, provide email credential to proceed and change your password
            information
          </p>
          <form className="login-form">
            <div className="form_control">
              <input
                type="email"
                placeholder="Email Address"
                className="inputx input_input"
                value={userInformation.email.email}
                onChange={handleEmailChange}
              />
              <HiOutlineMail className="icon" size={25} />
              {userInformation.email.email.length > 0 ? (
                userInformation.email.valid ? (
                  <AiOutlineCheckCircle
                    size={25}
                    className="text-success password-icon"
                    style={{ cursor: "default" }}
                  />
                ) : (
                  <AiOutlineCloseCircle
                    size={25}
                    className="text-danger password-icon"
                    style={{ cursor: "default" }}
                  />
                )
              ) : null}
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button
              className="submit inputx"
              style={{ cursor: loading ? "wait" : "pointer" }}
              onClick={handleChangePass}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ForgotPasswordCashier;
