import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "src/helpers/axios";
const UnseenCustomer = ({ customerId }) => {
  const [unseen, setUnseen] = useState(0);
  const { socket } = useSelector((state) => state.socket);
  const handleGetUnseenChat = async () => {
    try {
      const res = await axiosInstance.post("/get-unseen-chat-cashier", {
        customerId,
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
      socket.on("nms-customer-branch", async ({ sendMessage }) => {
        handleGetUnseenChat();
      });
      socket.on("unms-branch-customer", async (data) => {
        if (data.toString() === customerId.toString()) {
          handleGetUnseenChat();
        }
      });
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

export default UnseenCustomer;
