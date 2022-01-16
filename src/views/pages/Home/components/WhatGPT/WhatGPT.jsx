import React from "react";
import { Feature } from "..";
import "./WhatGPT.scss";
const WhatGPT = (props) => {
  return (
    <div className="gpt3__whatgpt3 section__margin">
      <div className="gpt3_whatgp3-feature">
        <Feature
          title={"What is this Web App?"}
          {...props}
          text={
            "This is Multibranch system that covers the sales of the branch" +
            ",Also can manipulate inventory of the product Brand. This also monitor " +
            "the cashier sales for  day, week, month and even year and much more has a " +
            " downloadable android application for barcode scanning, qrcode-scanning, And later on " +
            "this project  will integrate paymongoose  payless transaction that will connect to your paypal account " +
            "as now we dont have budget to have that services, we only integrate QRCODE Payless transaction " +
            "that deposited to customer account in each branch, And Government Tax are available and to be remitted "
          }
        />
      </div>
      <div className="gpt3__whatgpt3-heading">
        <h1 className="gradient__text">
          The Possibility and Upgrade Are are still going on to meet your
          expectation
        </h1>
        <p>Create your branch Now</p>
      </div>
      <div className="gpt3__whatgpt3-container">
        <Feature
          title={"Chatbox System"}
          text={
            "You can send messages to your employee with real time chat messenging application and also chat the administrative about your issue that you want to know"
          }
          {...props}
        />
        <Feature
          {...props}
          title={"Customer Tracking"}
          text={
            "This will track the customer purchase item if something went/wrong about his purchase can be easily to track the purchase"
          }
        />
        <Feature
          title={"Roles and Permission"}
          text="Administrative can banned branch based on the customer issue that they been raised and also not just customer the branch can also do such thing to customer, cashier based on thier performance that they have to the certain branch"
          {...props}
        />
      </div>
    </div>
  );
};

export default WhatGPT;
