import React from "react";
import Logo from "src/assets/icons/hamburger_logo_expand.png";
import storelogo from "src/assets/icons/store.jpg";
import { toCapitalized } from "src/reusable";

const SubBrandPrinting = React.forwardRef(
  ({ sales, product, user, chartState }, ref) => {
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
          <img
            src={Logo}
            alt="jarm -logo"
            style={{ width: 200, height: 100 }}
          />
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
        <h4>{toCapitalized(user.branch_address.fullAddress)} </h4>
        <br />
        <hr />
        <h3 className="mt-2 text-left" style={{ color: "#b0b0b0" }}>
          SubBrand:{" "}
          <span style={{ letterSpacing: 2, color: "#5c5c5c" }}>
            {product?.subcategory}{" "}
          </span>
        </h3>
        <br />

        <div className="mt-2">
          {sales?.map((data) => {
            return (
              <div className="w-100 p-2 border mt-2">
                <h3>
                  Date:{" "}
                  <span style={{ letterSpacing: 2, color: "#5c5c5c" }}>
                    {" "}
                    {data.date}
                  </span>
                </h3>
                <h3>
                  Total Amount:{" "}
                  <span style={{ letterSpacing: 2, color: "#5c5c5c" }}>
                    {data.totalAmount}
                  </span>
                </h3>
                <table className="mt-2 table table-borderless">
                  <thead>
                    <tr className="border-bottom">
                      <th className="text-center">Product</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((prdData) => {
                      return (
                        <tr className="border-bottom">
                          <th className="text-center">{prdData.product}</th>
                          <th className="text-center">{prdData.quantity}</th>
                          <th className="text-center">{prdData.amount}</th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default SubBrandPrinting;
