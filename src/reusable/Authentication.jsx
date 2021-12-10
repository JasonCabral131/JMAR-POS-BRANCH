import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { BsShieldLock } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Authentication = ({
  authenticationModal,
  setAuthenticationModal,
  handleSubmitAuth,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    await handleSubmitAuth(password);
    setLoading(false);
    setPassword("");
  };
  return (
    <Modal size="md" show={authenticationModal}>
      <Modal.Body>
        <label className="label-name d-block text-left">
          Enter Your Password
        </label>

        <div className="percent-container mt-1">
          <input
            type={showPassword ? "text" : "password"}
            min="0"
            value={password}
            name="password"
            className="icon-need no-capitalized"
            placeholder={`password`}
            onChange={(e) => setPassword(e.target.value)}
          />
          <BsShieldLock className="home-signup-iconx icon-hover" size={25} />
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
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex">
          <button
            className="btn-qrcode cancel-button"
            onClick={() => setAuthenticationModal(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn-qrcode save-button"
            onClick={handleSubmit}
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
              "Confirm"
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default Authentication;
