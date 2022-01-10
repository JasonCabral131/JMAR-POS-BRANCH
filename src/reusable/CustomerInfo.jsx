import React from "react";
import { useSelector } from "react-redux";
import background from "src/assets/icons/background.png";
import jarm from "src/assets/icons/Jarm_Logo.svg";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import "./style.scss";
import { toCapitalized } from ".";
import Swal from "sweetalert2";
const CustomerInfo = ({
  payer,
  handlePayment,
  setPayer,
  setHideModal,
  total,
  paymentLoading,
}) => {
  const { user } = useSelector((state) => state.auth);
  const handleCancelTransaction = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setHideModal(false);
        setPayer(null);
      }
    });
  };
  const handlePaymentToProceed = () => {
    if (parseFloat(payer.deposit) >= total) {
      const customer = { ...payer, payment_check: "payless-payment" };
      handlePayment(false, customer);
      return;
    }
    const customer = { ...payer, payment_check: "counter-payment" };
    handlePayment(false, customer);
  };
  return (
    <div className="profile-containerx  p-2">
      <div className="profile-backgroundx">
        <img alt="background-img" src={background} />
        <h1 className="branch-namex">
          {user ? `${user.branch_name} Store` : null}
        </h1>
        <div className="lining-stylex" />
        <div className="avatar-containerx">
          <img
            className="avatar-profilex"
            alt="avatar-profile"
            src={payer ? (payer.profile.url ? payer.profile.url : jarm) : jarm}
          />
        </div>
        <div className="user-personal-infox mt-2">
          <h1>
            <span>
              {payer
                ? toCapitalized(
                    `${payer.firstname} ${payer.middlename} ${payer.lastname}`
                  )
                : null}
            </span>
          </h1>
          <h2>{payer ? payer.address.fullAddress : null}</h2>
        </div>
      </div>
      <div className="default-spacex" />
      <div className="profile-navigationx">
        <div className="profile-navigation-listsx"></div>
        <div className="edit-profile-navgiationx">
          <button
            className="btn btn-success"
            onClick={() => handlePaymentToProceed()}
          >
            <FaHandHoldingUsd size={30} /> <span>Pay Now</span>
          </button>
          <button
            className="btn btn-danger ml-2"
            onClick={handleCancelTransaction}
          >
            <FcCancel size={30} /> <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
