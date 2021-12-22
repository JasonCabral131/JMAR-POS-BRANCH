import React from "react";

import Logo from "src/assets/icons/hamburger_logo_expand.png";
import storelogo from "src/assets/icons/store.jpg";
import { toCapitalized } from "src/reusable";
const WeeklyPrinting = React.forwardRef(({ sales, cinfo, user }, ref) => {
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
      <hr />
      {cinfo ? (
        <div className="col-md-2">
          <div className="w-100 p-2 d-flex justify-content-center flex-column align-items-center">
            <img
              alt="profile"
              src={cinfo.profile.url}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "100%",
              }}
            />
            <h3 className="mt-2 text-center" style={{ color: "#b0b0b0" }}>
              {toCapitalized(
                `${cinfo.firstname} ${cinfo.middlename} ${cinfo.lastname}`
              )}
            </h3>
          </div>
        </div>
      ) : null}
      <h4 className="text-left mt-1">Weekly Sales Information</h4>
      <hr />
    </div>
  );
});
export default WeeklyPrinting;
