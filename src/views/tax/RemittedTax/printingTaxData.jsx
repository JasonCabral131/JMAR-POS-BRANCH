import React from "react";
import { toCapitalized } from "src/reusable";

import Logo from "./../../../assets/icons/hamburger_logo_expand.png";
import storelogo from "./../../../assets/icons/store.jpg";
const PrintingTax = React.forwardRef(({ tax, user }, ref) => {
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
      <br />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tax</th>
            <th scope="col">Percentage</th>
            <th scope="col">Amount</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {tax.map((data) => {
            return (
              <tr>
                <th>{data.index}</th>
                <th>{data.tax}</th>
                <th>{data.percentage}</th>
                <th>{`₱ ${new Intl.NumberFormat().format(
                  Math.round((data.total + Number.EPSILON) * 100) / 100
                )}`}</th>
                <th>{data.date}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="signatureOverPrintedName">
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
    </div>
  );
});
export default PrintingTax;
