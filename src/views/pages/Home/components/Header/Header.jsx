import React from "react";
import "./Header.scss";
import HeaderLogo from "./../../assets/7-11-logo.png";
import { WhatGPT } from "..";
const Header = (props) => {
  return (
    <div className="gpt_3_home-container">
      <div className="gpt3__header section__padding">
        <div className="gpt3__header-content">
          <h1 className="gradient__text">
            Let's Build Something About Your Modern Gracery Store
          </h1>
          <p>
            JARM, operates more than 10,000 grocery store across the
            philippines, it covers all the point of sale system of the grocery
            that gives them comfort about there sale of their store, and can
            have Android online platform where the customer can order in the
            specific store and can track the order details and transaction that
            they have purchase or Order
          </p>
          {/* <div className="gpt3__header-content__people">
            <img
              src={
                "https://github.com/adrianhajdin/project_modern_ui_ux_gpt3/blob/main/src/assets/people.png?raw=true"
              }
              alt="people"
            />
            <p>
              6 people including cashier and branch using this web application
            </p>
          </div> */}
        </div>
        <div className="gpt3__header-image">
          <img src={HeaderLogo} alt="header-logo" />
        </div>
      </div>
      <WhatGPT {...props} />
    </div>
  );
};
export default Header;
