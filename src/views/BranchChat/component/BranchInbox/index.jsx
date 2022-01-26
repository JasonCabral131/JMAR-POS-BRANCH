import React from "react";
import casImg from "src/assets/icons/branch.png";
const BranchView = () => {
  return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center">
      <h1 className="mt-5 gradient__text font">Branch to Branch Chat System</h1>
      <p>realtime chat system to have a connection to your employee</p>
      <img alt="cashier-info" src={casImg} />
    </div>
  );
};

export default BranchView;
