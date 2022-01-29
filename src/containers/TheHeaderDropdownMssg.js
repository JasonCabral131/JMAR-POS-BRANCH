import React, { useState, useEffect } from "react";
import { CBadge, CDropdown, CDropdownToggle } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import axiosInstance from "src/helpers/axios";
import { useSelector } from "react-redux";
import boopSfx from "src/assets/ringtunes/messenger.mp3";
const TheHeaderDropdownMssg = () => {
  const [itemsCount, setItemCount] = useState(0);
  const history = useHistory();
  const { socket } = useSelector((state) => state.socket);
  const handleGetChat = async () => {
    try {
      const res = await axiosInstance.get(
        "/get-all-chat-unseen-chat-branch-xx"
      );
      if (res.status === 200) {
        setItemCount(res.data);
      }
    } catch (e) {}
  };
  useEffect(() => {
    handleGetChat();
    if (socket) {
      socket.on("new-message-send-by-cashier", async (data) => {
        let audio = new Audio(boopSfx);
        audio.play();
        handleGetChat();
      });
      socket.on("new-message-send-by-customer", async (data) => {
        let audio = new Audio(boopSfx);
        audio.play();
        handleGetChat();
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <CDropdown inNav className="c-header-nav-item mx-2" direction="down">
      <CDropdownToggle
        className="c-header-nav-link"
        caret={false}
        onClick={() => history.push("/jarm-chat-system")}
      >
        <CIcon name="cil-speech" />
        {itemsCount > 0 ? (
          <CBadge shape="pill" color="info">
            {itemsCount}
          </CBadge>
        ) : null}
      </CDropdownToggle>
    </CDropdown>
  );
};

export default TheHeaderDropdownMssg;
