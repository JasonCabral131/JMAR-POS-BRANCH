import React from "react";

import Logo from "src/assets/icons/hamburger_logo_expand.png";
import storelogo from "src/assets/icons/store.jpg";
import { toCapitalized } from "src/reusable";
const AllDataDaily = React.forwardRef(({ sales, cinfo, user }, ref) => {
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
      <h4 className="text-left mt-1">Daily Sale</h4>
      <hr />

      {sales
        ? Array.isArray(sales.salesByDay)
          ? sales.salesByDay.map((data) => {
              return (
                <>
                  <table className="table table-borderless mt-2">
                    <thead className="border border-bottom-1">
                      <tr>
                        <th className="text-left">Date</th>
                        <th className="text-left">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="mt-1">
                        <th className="text-left">{data.date}</th>
                        <th className="text-left">{data.totalAmount}</th>
                      </tr>
                    </tbody>
                  </table>
                  <table className="table table-borderless mt-2">
                    <thead className="border border-bottom-1 mt-1">
                      <tr>
                        <th className="text-left">Transaction ID</th>
                        <th className="text-left">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data.data)
                        ? data.data.map((tdata) => {
                            return (
                              <>
                                <tr className="mt-1">
                                  <th className="text-left">{tdata.salesId}</th>
                                  <th className="text-left">{tdata.total}</th>
                                </tr>
                                <table className="table table-borderless mt-2">
                                  <thead className="border border-bottom-1 mt-1">
                                    <tr>
                                      <th className="text-left">Product</th>
                                      <th className="text-left">Price</th>
                                      <th className="text-left">Quantity</th>
                                      <th className="text-left"> Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tdata.product.map((PData) => {
                                      return (
                                        <tr className="border-bottom mt-1">
                                          <th className="text-left">
                                            {PData.product.product}
                                          </th>
                                          <th className="text-left">
                                            {PData.price}
                                          </th>
                                          <th className="text-left">
                                            {PData.quantity}
                                          </th>
                                          <th className="text-left">
                                            {PData.amount}
                                          </th>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </>
                            );
                          })
                        : null}
                    </tbody>
                  </table>
                </>
              );
            })
          : null
        : null}
    </div>
  );
});
export default AllDataDaily;
