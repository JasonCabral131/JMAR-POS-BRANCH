import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "src/helpers/axios";
const UnseenCashier = ({ cashierId }) => {
  const [unseen, setUnseen] = useState(0);
  const { socket } = useSelector((state) => state.socket);
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
  useEffect(() => {
    if (socket) {
      socket.on("new-message-send-by-cashier", async ({ sendMessage }) => {
        handleGetUnseenChat();
      });
      handleGetUnseenChat();
    }
    // eslint-disable-next-line
  }, [socket]);
  return unseen > 0 ? (
    <div className="status-check">
      <span>{unseen}</span>
    </div>
  ) : (
    <div className="no-unseen-chat" />
  );
};

export default UnseenCashier;
