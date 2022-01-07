import React from "react";
import background from "src/assets/icons/background.png";
import jarm from "src/assets/icons/Jarm_Logo.svg";
import "src/views/Blog/PersonalBlogContent/BlogPersonal/style.scss";
import "src/views/Blog/PersonalBlogContent/style.scss";
import "src/views/Blog/style.scss";
function CashierInfo({ cashier }) {
  return (
    <div className="personl-container">
      <div className="profile-container">
        <div className="user-profile-container  p-2">
          <div className="profile-background">
            <img alt="background-img" src={background} />
            <h1 className="branch-name">
              {cashier ? `${cashier.branch.branch_name} Store` : null}
            </h1>
            <div className="lining-style" />
            <div className="avatar-container">
              <img
                className="avatar-profile"
                alt="avatar-profile"
                src={
                  cashier
                    ? cashier.profile.url
                      ? cashier.profile.url
                      : jarm
                    : jarm
                }
              />
            </div>
            <div className="user-personal-info mt-2">
              <h1>
                <span>
                  {cashier
                    ? `${cashier.firstname} ${cashier.middlename} ${cashier.lastname}`
                    : null}
                </span>
              </h1>
              <h2>{cashier ? cashier.address.fullAddress : null}</h2>
            </div>
          </div>

          <div className="default-space" />
        </div>
      </div>
    </div>
  );
}

export default CashierInfo;
