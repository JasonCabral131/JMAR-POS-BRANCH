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
            7-Eleven, retailer that operates more than 60,000 convenience
            stores, mostly in North America and Asia. The typical outlet is
            small in size and carries a limited stock of food, drinks, and other
            high-turnover products but stays open long hours.
          </p>
          <div className="gpt3__header-content__people">
            <img
              src={
                "https://github.com/adrianhajdin/project_modern_ui_ux_gpt3/blob/main/src/assets/people.png?raw=true"
              }
              alt="people"
            />
            <p>
              6 people including cashier and branch using this web application
            </p>
          </div>
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
