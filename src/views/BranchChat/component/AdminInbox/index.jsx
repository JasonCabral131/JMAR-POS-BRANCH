import React from "react";
import JARM from "src/assets/icons/chat.jpg";
const AdminView = () => {
  return (
    <div className="w-100">
      <div className="chat-content-info-header shadow">
        <div className="content-info-header">
          <img alt="avatar-logo" src={JARM} />
          <div className="profile-heading">
            <h1>JARM MANAGEMENT</h1>
            <h2>
              status - <span className={"active"}>active</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
