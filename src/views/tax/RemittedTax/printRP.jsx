import React from "react";
import { toCapitalized } from "src/reusable";
import momentTm from "moment-timezone";
import Logo from "./../../../assets/icons/hamburger_logo_expand.png";
import storelogo from "./../../../assets/icons/store.jpg";

const PrintRP = React.forwardRef(({ remitInfo, user, recipient }, ref) => {
  return (
    <div
      className="w-100 p-2"
      ref={ref}
      style={{ position: "relative", height: "100%" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginBottom: 20,
        }}
      >
        <img src={Logo} alt="jarm -logo" style={{ width: 200, height: 100 }} />
      </div>
      <h4 className="brand-information-header-x">
        <p> {user.branch_name + " Store"}</p>
        <img
          alt={"store"}
          src={storelogo}
          className="ml-2"
          style={{ width: "40px", height: "40px" }}
        />
      </h4>
      <hr />
      <h4>{user.branch_address.fullAddress} </h4>
      <br />
      <h3>
        Tax:{" "}
        <span style={{ letterSpacing: 2, color: "#b8a8b3" }}>
          {" "}
          {remitInfo ? remitInfo.tax : null}{" "}
        </span>
      </h3>
      <h3>
        Percentage:{" "}
        <span style={{ letterSpacing: 2, color: "#b8a8b3" }}>
          {remitInfo ? remitInfo.percentage : null} %{" "}
        </span>
      </h3>
      <h3>
        Tax Collected:{" "}
        <span style={{ letterSpacing: 2, color: "#b8a8b3" }}>
          {" ₱. "}
          {remitInfo ? new Intl.NumberFormat().format(remitInfo.total) : null}
        </span>
      </h3>
      <br />
      <hr />
      <h4>Taxes Collected</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Tax Collected</th>
          </tr>
        </thead>
        <tbody>
          {remitInfo
            ? Array.isArray(remitInfo.product)
              ? remitInfo.product.map((data) => {
                  return (
                    <tr key={data.product}>
                      <td>{data.product}</td>
                      <td>{data.taxCollected}</td>
                    </tr>
                  );
                })
              : null
            : null}
        </tbody>
      </table>
      <div className="signatureOverPrintedName">
        <h6>Store Owner </h6>
        <br />
        <h4 className="text-center">
          {toCapitalized(
            user.branch_owner_fname +
              " " +
              user.branch_owner_MI +
              " " +
              user.branch_owner_lname
          )}
        </h4>
        <hr />
        <h6 className="text-center">Signature Over Printed Name</h6>
      </div>
      <div className="signatureOverPrintedNamex">
        <h6>Recipient: </h6>
        <br />
        <h4 className="text-center">{toCapitalized(recipient)}</h4>

        <hr />
        <h6 className="text-center">Signature Over Printed Name</h6>
      </div>
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <h5>
          <span className="fw-bolder">Date: </span>
          {momentTm.tz(new Date(), "Asia/Manila").toLocaleString()}
        </h5>
      </div>
    </div>
  );
});
export default PrintRP;
