import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MdOutlinePhotoLibrary, MdEmojiEmotions } from "react-icons/md";
import Picker from "emoji-picker-react";
import axiosInstance from "src/helpers/axios";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { toCapitalized } from "src/reusable";
import Female from "src/assets/icons/female.jpg";
import Male from "src/assets/icons/male.jpg";
import moment from "moment";
const CashierInboxView = () => {
  const { cashierId } = useParams();
  const { socket } = useSelector((state) => state.socket);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [cashier, setCashier] = useState(null);
  const [active, setActive] = useState(false);
  const onEmojiClick = (e, { emoji }) => {
    setMessage((prev) => {
      return (prev += emoji);
    });
  };
  const handleGetCashierChat = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/get-cashier-chat-information", {
        cashierId,
      });
      setLoading(false);
      if (res.status === 200) {
        setCashier(res.data.cashier);
        setChat(res.data.chat);
        return;
      }
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetCashierChat();
    if (socket) {
      socket.emit("get-active-user-by-branch", { cashier }, (data) => {
        if (Array.isArray(data.customer)) {
          const filteredOut = data.customer.filter(
            (custo) => custo._id === cashierId
          );
          if (filteredOut.length > 0) {
            setActive(true);
          } else {
            setActive(false);
          }
        }
      });
    }
    return () => {
      setActive(false);
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    handleGetCashierChat();
    if (socket) {
      socket.emit("get-active-user-by-branch", { cashier }, (data) => {
        if (Array.isArray(data.customer)) {
          const filteredOut = data.customer.filter(
            (custo) => custo._id === cashierId
          );
          if (filteredOut.length > 0) {
            setActive(true);
          } else {
            setActive(false);
          }
        }
      });
    }
    return () => {
      setActive(false);
    };
    // eslint-disable-next-line
  }, [cashierId]);
  useEffect(() => {
    if (socket) {
      socket.on("login-active-cashier", async ({ customer }) => {
        console.log("login", customer._id, cashierId);
        if (cashierId === customer._id) {
          setActive(true);
        } else {
          setActive(false);
        }
      });
      socket.on("disconnect-cashier", async (data) => {
        //console.log("disconnect", cashierId);
        if (cashierId.toString() === data.cashierId.toString()) {
          setActive(false);
        }
      });
    }
    // eslint-disable-next-line
  }, [socket]);
  return (
    <div className="chat-content-information">
      <div className="chat-content-info">
        <div className="chat-content-info-header shadow">
          {loading ? (
            <div className="content-info-header">
              <Skeleton
                circle={true}
                width={50}
                height={50}
                baseColor="#202020"
                highlightColor="#444"
              />
              <div className="profile-heading">
                <Skeleton
                  width={200}
                  height={15}
                  baseColor="#202020"
                  highlightColor="#444"
                />
                <Skeleton
                  width={150}
                  height={10}
                  baseColor="#202020"
                  highlightColor="#444"
                />
              </div>
            </div>
          ) : (
            <div className="content-info-header">
              <img
                alt="avatar-logo"
                src={
                  cashier
                    ? cashier.profile.url
                      ? cashier.profile.url
                      : cashier.profile.sex === "Male"
                      ? Female
                      : Male
                    : Male
                }
              />
              <div className="profile-heading">
                <h1>
                  {cashier
                    ? toCapitalized(`${cashier.firstname} ${cashier.lastname}`)
                    : "Cashier Information Not Found"}
                </h1>
                <h2>
                  status -{" "}
                  <span className={`${active ? "active" : "unactive"} `}>
                    {active ? "active" : "unactive"}
                  </span>
                </h2>
              </div>
            </div>
          )}
        </div>
        <div className="chat-content-info-content">
          {!loading ? (
            <div className="chat-heading-information">
              <center>
                <img
                  alt="cashier-pofilexx"
                  src={
                    cashier
                      ? cashier.profile.url
                        ? cashier.profile.url
                        : cashier.profile.sex === "Male"
                        ? Female
                        : Male
                      : Male
                  }
                />
                <h1 className="gradient__text">
                  {cashier
                    ? toCapitalized(
                        `${cashier.firstname} ${cashier.middlename} ${cashier.lastname}`
                      )
                    : "information not found"}
                </h1>
                <h3>
                  Employed since since{" "}
                  {cashier
                    ? moment(new Date(cashier.createdAt)).get("year")
                    : "Not Found"}
                </h3>
              </center>
            </div>
          ) : null}
          <div className="left-sender">
            <div className="sender-content">
              <img src={Male} alt="cashier-pofilexx" />
              <div className="left-sender-content">
                <p>he bitch kamusta ka asdasda</p>
              </div>
            </div>
            <p>{moment(new Date()).fromNow()}</p>
          </div>
          <div className="right-sender">
            <div className="sender-content">
              <div className="right-sender-content">
                <p>he bitch kamusta ka asdasdasd</p>
              </div>
              <img src={Male} alt="cashier-pofilexx" />
            </div>
            <p className="text-right">{moment(new Date()).fromNow()}</p>
          </div>
        </div>
        <div className="chat-content-info-input">
          {loading ? (
            <div style={{ width: "100%" }}>
              <Skeleton
                width={"100%"}
                height={50}
                baseColor="#202020"
                highlightColor="#444"
              />
            </div>
          ) : cashier ? (
            <>
              <MdOutlinePhotoLibrary
                color="#858AF2"
                size={25}
                className="hover"
              />
              {isShowEmoji && (
                <div className="emoji-div">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <MdEmojiEmotions
                color="#858AF2"
                size={25}
                className="ml-1 hover"
                onClick={() => {
                  setIsShowEmoji(!isShowEmoji);
                }}
              />
              <input
                placeholder="type here..."
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
            </>
          ) : null}
        </div>
      </div>
      <div className="chat-right-side">
        {loading ? (
          <div className="chat-right-content">
            <center>
              <Skeleton
                circle={true}
                width={150}
                height={150}
                baseColor="#202020"
                highlightColor="#444"
              />
              <Skeleton
                width={120}
                height={20}
                baseColor="#202020"
                highlightColor="#444"
              />
            </center>
          </div>
        ) : cashier ? (
          <div className="chat-right-content">
            <center>
              <img
                alt="cashier-pofile"
                src={
                  cashier
                    ? cashier.profile.url
                      ? cashier.profile.url
                      : cashier.profile.sex === "Male"
                      ? Female
                      : Male
                    : Male
                }
              />
              <h1 className="mt-1">
                <span>{cashier ? cashier.shiftingSchedule : null}</span>{" "}
                Schedule{" "}
              </h1>
              <h3 className="mt-1">
                {cashier ? JSON.parse(cashier.address).fullAddress : null}
              </h3>
            </center>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CashierInboxView;
