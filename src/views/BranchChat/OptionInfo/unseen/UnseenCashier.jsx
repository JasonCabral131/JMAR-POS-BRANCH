import React, { useState, useEffect } from "react";
import axiosInstance from "src/helpers/axios";
const UnseenCashier = ({ cashierId }) => {
  const [unseen, setUnseen] = useState(0);
  const handleGetUnseenChat = async () => {
    try {
      const res = await axiosInstance.post("/get-unseen-cashier-information", {
        cashierId,
      });
      if (res.status === 200) {
        setUnseen(res.data);
        return;
      }
      setUnseen(0);
      return;
    } catch (error) {
      setUnseen(0);
    }
  };
  useEffect(() => {
    handleGetUnseenChat();
    // eslint-disable-next-line
  }, []);
  return unseen > 0 ? (
    <div className="status-check">
      <span>{unseen}</span>
    </div>
  ) : (
    <div className="no-unseen-chat" />
  );
};

export default UnseenCashier;
