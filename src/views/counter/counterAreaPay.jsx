import { CButton } from "@coreui/react";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { RiSecurePaymentFill, RiQrCodeLine } from "react-icons/ri";
import boopSfx from "src/assets/ringtunes/windows-error-ringtone.mp3";
import { useSelector } from "react-redux";
import ToPrintContainer from "./to-print-info";
import useDetectPrint from "use-detect-print";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { cashierPay, logout } from "src/redux/action";

import { getProductByBrandOwner } from "src/redux/action/product.action";
export const CounterAreaPay = ({
  purchase,
  setPurchase,
  payment,
  setPayment,
  tax,
  payer,
  setPayer,
  searchRef,
}) => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const [salesId, setSalesId] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const isPrinting = useDetectPrint();
  const subTotal = purchase.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.total;
  }, 0);
  const getTotal = () => {
    let taxSubTotal = 0;
    tax.map((data) => {
      taxSubTotal += parseFloat(data.percentage / 100) * subTotal;
      return data;
    });
    const Total = subTotal + taxSubTotal;
    return Math.round((Total + Number.EPSILON) * 100) / 100;
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setPurchase([]);
    },
    onBeforePrint: async (data) => {
      if (await data) {
      }
    },
  });
  useEffect(() => {
    if (purchase.length === 0) {
      setPayment({ payment: "", isvalid: false });
    }
    return () => {
      if (purchase.length === 0) {
        setPayment({ payment: "", isvalid: false });
      }
    };
    // eslint-disable-next-line
  }, [purchase]);

  useEffect(() => {
    if (isPrinting) {
      alert("is printing");
    }
    // eslint-disable-next-line
  }, [isPrinting]);
  const handlePayment = async (val) => {
    if (val) {
      if (purchase.length < 1) {
        let audio = new Audio(boopSfx);
        audio.play();
        return;
      }
      if (payment.payment === "") {
        let audio = new Audio(boopSfx);
        audio.play();
        return;
      }
      if (payment.payment < getTotal()) {
        let audio = new Audio(boopSfx);
        audio.play();
        return;
      }
      const salesId = Math.floor(Math.random() * 999999999999999);
      setSalesId(salesId);

      let transactionObject = {
        salesId,
        payment: payment.payment,
        customer: payer ? payer : null,
        products: purchase,
        taxs: await tax.map((data) => {
          return {
            _id: data._id,
            percentage: data.percentage,
            tax: data.tax,
            amount: parseFloat(data.percentage / 100) * subTotal,
          };
        }),
      };
      if (user.status === "owner") {
        setPaymentLoading(true);
        const res = await dispatch(cashierPay(transactionObject));
        setPaymentLoading(false);
        if (res.result) {
          Swal.fire({
            icon: "success",
            text: res.message,
          });
          dispatch(getProductByBrandOwner());
          handlePrint();
          setTimeout(() => {
            searchRef
              ? searchRef.current
                ? searchRef.current.blur()
                : console.log("")
              : console.log("");
          }, 400);
          return;
        }
        Swal.fire({
          icon: "warning",
          text: res.message,
        });
        return;
      } else if (user.status === "cashier") {
      } else {
        dispatch(logout());
        Swal.fire("Warning", "Wrong Type Of User Detected", "warning");
      }
    }
  };

  return (
    <div className="CounterAreaPay">
      <center>
        {" "}
        <label className="label-name text-center fs-3">Total Amount</label>
      </center>
      <h1 className="total-amount-container ">
        ₱{" "}
        {purchase.length > 0 ? (
          <span>{`${new Intl.NumberFormat().format(getTotal())}`}</span>
        ) : (
          <span>00.00</span>
        )}
      </h1>
      <label className="label-name text-left">Enter Amount</label>
      <input
        type="number"
        name="amount"
        className="inputvalue filter-input"
        min="1"
        disabled={purchase.length > 0 ? false : true}
        style={{ cursor: purchase.length > 0 ? "text" : "not-allowed" }}
        placeholder="enter amount"
        value={payment.payment}
        onChange={(e) => {
          const { value } = e.target;
          if (value < getTotal()) {
            setPayment({ payment: value, isvalid: false });
          } else {
            setPayment({ payment: value, isvalid: true });
          }
        }}
        onKeyPress={(e) => {
          if (e.key === "-" || e.key === "E" || e.key === "e") {
            e.preventDefault();
          }
          if (payment.payment < 1) {
            if (e.key === "0") {
              e.preventDefault();
            }
          }
        }}
        onPaste={(e) => {
          const data = e.clipboardData.getData("Text");
          if (!isNaN(data)) {
            if (data < 0) {
              e.preventDefault();
            }
          } else {
            e.preventDefault();
          }
          if (payment.payment < 1) {
            if (data === "0") {
              e.preventDefault();
            }
          }
        }}
      />
      {purchase.length < 1 ? (
        <small className="text-danger toshow-data">No Data Available</small>
      ) : null}
      {purchase.length > 0 ? (
        payment.payment !== "" ? (
          payment.payment < getTotal() ? (
            <h1 className="total-amount-container border border-danger">
              <span>Insufficient Amount</span>
            </h1>
          ) : (
            <>
              {" "}
              <label className="d-block label-name text-center fs-3 mt-2">
                Change
              </label>
              <h1 className="total-amount-container border border-success">
                ₱{" "}
                <span>
                  {Math.round(
                    (parseFloat(payment.payment) -
                      getTotal() +
                      Number.EPSILON) *
                      100
                  ) / 100}
                </span>
              </h1>{" "}
            </>
          )
        ) : (
          <h1 className="total-amount-container border border-danger">
            <span>Payment Needed !!!</span>
          </h1>
        )
      ) : (
        <h1 className="total-amount-container border border-danger">
          <span>No Data Found !!!</span>
        </h1>
      )}
      <CButton
        color="info"
        size="lg"
        className="mt-4 w-100 fs-3"
        onClick={() => handlePayment(true)}
        disabled={paymentLoading}
      >
        {paymentLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm mr-1"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </>
        ) : (
          <>
            {" "}
            <RiSecurePaymentFill size={25} /> Pay At Counter
          </>
        )}
      </CButton>
      <CButton
        color="primary"
        size="lg"
        className="mt-4 w-100 fs-3"
        onClick={() => handlePayment(false)}
        disabled={paymentLoading}
      >
        {paymentLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm mr-1"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </>
        ) : (
          <>
            {" "}
            <RiQrCodeLine size={25} /> QRCODE PAYMENT
          </>
        )}
      </CButton>
      <div className="d-none">
        <ToPrintContainer
          ref={componentRef}
          user={user}
          salesId={salesId}
          purchase={purchase}
          tax={tax}
          getTotal={getTotal}
          payment={payment}
        />
      </div>
    </div>
  );
};
