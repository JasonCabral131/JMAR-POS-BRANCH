import React, { useState } from "react";
import "./index.css";
import { Form } from "react-bootstrap";
import { HiOutlineMail } from "react-icons/hi";
import { BsShieldLock } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { EmailValidator } from "src/reusable";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { login, loginCashier } from "src/redux/action";
import Swal from "sweetalert2";
import LoginLogo from "./../Home/assets/Jarm_Logo.svg";
const initialState = {
  email: { email: "", valid: false },
  password: "",
  loginAs: null,
};
const Login = (props) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [error, setError] = useState(null);
  const [userInformation, setUserInformation] = useState(initialState);
  const handleLogin = async (e) => {
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
    if (userInformation.password.length < 7) {
      setError("Password Must be greater than 6 character");
      setLoading(false);
      return;
    }
    if (!userInformation.loginAs) {
      setError("Please Select Login As? option...");
      setLoading(false);
      return;
    }

    const userInfo = {
      email: userInformation.email.email,
      password: userInformation.password,
      signInAs: userInformation.loginAs,
      dateNow: new Date(),
      localeTime: new Date()
        .toLocaleString({ hour: "numeric", minute: "numeric", hour12: true })
        .split(",")[1],
    };
    console.log(userInformation.loginAs);
    if (userInformation.loginAs === "branch-owner") {
      const result = await dispatch(login(userInfo));
      setLoading(false);
      if (!result.result) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message,
        });
        return;
      }
    } else {
      const result = await dispatch(loginCashier(userInfo));
      setLoading(false);
      if (!result.result) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message,
        });
        return;
      }
    }

    setUserInformation(initialState);
    return;
  };
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setUserInformation((prev) => {
      return {
        ...prev,
        email: { email: value, valid: EmailValidator(value) },
      };
    });
  };

  return (
    <div className="login-component-container">
      <section className="section-container side">
        <img src={LoginLogo} alt="login  img information " />
      </section>
      <section className="section-container main">
        <div className="login-container">
          <p className="title gradient__text">Welcome Back!</p>
          <div className="separator" />
          <p className="welcome-message">
            Please, provide login credential to proceed and have access to all
            our services
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
            <div className="form_control">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="inputx input_input"
                value={userInformation.password}
                onChange={(e) =>
                  setUserInformation((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
              />
              <BsShieldLock className="icon" size={25} />
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
            {error && <p className="text-danger">{error}</p>}
            <h1
              className="login-message gradient__text forgot-password"
              onClick={() => setCollapse(!collapse)}
            >
              Forgot Password ?
            </h1>
            <p className="login-message" onClick={() => setCollapse(!collapse)}>
              Login As ?
              {collapse ? (
                <AiFillCaretUp size="20" className="collapse-icon" />
              ) : (
                <AiFillCaretDown size="20" className="collapse-icon" />
              )}
            </p>
            <div
              className={`${
                collapse ? "d-flex justify-content-between" : "d-none"
              } m-1`}
              onChange={(e) => {
                const { id } = e.target;
                setUserInformation((prev) => {
                  return { ...prev, loginAs: id };
                });
              }}
            >
              <Form.Check
                inline
                className="text-white"
                label="Store Owner"
                name="loginAs"
                type={"radio"}
                id={`branch-owner`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  document.getElementById("branch-owner").click();
                }}
              />
              <Form.Check
                inline
                className="text-white"
                label="Store Cashier"
                name="loginAs"
                type={"radio"}
                id={`branch-cashier`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  document.getElementById("branch-cashier").click();
                }}
              />
            </div>

            <button
              className="submit inputx"
              style={{ cursor: loading ? "wait" : "pointer" }}
              onClick={handleLogin}
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
                "Login"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
export default Login;
