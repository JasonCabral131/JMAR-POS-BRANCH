import React from "react";
import logo from "src/assets/icons/admin.png";
const Admin = () => {
  return (
    <div className="option-container-info scale-up-hor-center">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img
          src={logo}
          alt={Math.random()}
          style={{ width: "95%", height: "250px" }}
        />
        <h4 className="mt-4 gradient__text">JARM MANAGEMENT</h4>
      </div>
    </div>
  );
};

export default Admin;
