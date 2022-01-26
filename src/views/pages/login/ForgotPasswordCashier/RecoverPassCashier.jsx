import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { LoaderSpinner, PasswordStrengt } from "src/reusable";
import { BsShieldLock } from "react-icons/bs";
import pngChange from "src/assets/icons/forgotpassword.png";
import Swal from "sweetalert2";
import cashierAxios from "src/helpers/cashierAxios";
const initialState = {
  password: "",
  confirmPass: "",
};
const RecoverPassCashier = (props) => {
  const { token } = useParams();
  const history = useHistory();
  const [passwordField, setPasswordField] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const res = await cashierAxios.post(
        "/cashier-forgot-password-token-verification",
        { token }
      );
      setIsLoading(false);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Change Your Password Now",
        });
        return;
      }
      history.push("/JARM/sign-in");
      setPasswordField(initialState);
    } catch (e) {
      setIsLoading(false);
      history.push("/JARM/sign-in");
      setPasswordField(initialState);
    }
  };

  useEffect(() => {
    const clear = setInterval(async () => {
      try {
        const res = await cashierAxios.post(
          "/cashier-forgot-password-token-verification",
          { token }
        );
        setIsLoading(false);
        if (res.status !== 200) {
          history.push("/JARM/sign-in");
          setPasswordField(initialState);
          return;
        }
      } catch (e) {
        setIsLoading(false);
        history.push("/JARM/sign-in");
        setPasswordField(initialState);
      }
    }, 1500);
    return () => {
      clearInterval(clear);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleVerify();
    // eslint-disable-next-line
  }, [token]);
  const handleChangePass = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (passwordField.password.length < 1) {
      setError("Password required");
      setLoading(false);
      return;
    }

    if (passwordField.password !== passwordField.confirmPass) {
      setError("Password Does Not Match");
      setLoading(false);
      return;
    }
    if (!PasswordStrengt(passwordField.password)) {
      setError(
        "have maximun of 20 character,minimun of 8 character, atleast 1 digit,  1 uppercase and lowercase"
      );
      setLoading(false);
      return;
    }
    try {
      const res = await cashierAxios.post(
        "/cashier-forgot-password-change-password",
        {
          token,
          password: passwordField.password,
        }
      );
      setLoading(false);
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Password Successfully Change",
        });
        history.push("/JARM/sign-in");
        setPasswordField(initialState);
        return;
      }
      history.push("/JARM/sign-in");
    } catch (e) {
      setLoading(false);
      Swal.fire({
        icon: "warning",
        text: "Failed to Change Password",
      });
      history.push("/JARM/sign-in");
    }
    return;
  };
  return isLoading ? (
    <div className="w-100 p-4" style={{ height: "600px", marginTop: 15 }}>
      <LoaderSpinner height="400px" />
    </div>
  ) : (
    <div className="login-component-container">
      <section className="section-container side">
        <img src={pngChange} alt="login  img information " />
      </section>
      <section className="section-container main">
        <div className="login-container">
          <p className="title gradient__text">Congrats You Make it here</p>
          <div className="separator" />
          <p className="welcome-message">
            Please, provide password credential to proceed and change your
            password information
          </p>
          <form className="login-form">
            <div className="form_control">
              <input
                type={"password"}
                placeholder="new password"
                className="inputx input_input"
                value={passwordField.password}
                onChange={(e) =>
                  setPasswordField((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
              />
              <BsShieldLock className="icon" size={25} />
            </div>
            <div className="form_control">
              <input
                type={"password"}
                placeholder="confirm password"
                className="inputx input_input"
                value={passwordField.confirmPass}
                onChange={(e) =>
                  setPasswordField((prev) => {
                    return { ...prev, confirmPass: e.target.value };
                  })
                }
              />
              <BsShieldLock className="icon" size={25} />
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
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
export default RecoverPassCashier;
