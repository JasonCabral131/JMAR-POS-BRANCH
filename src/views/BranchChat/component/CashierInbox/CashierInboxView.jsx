import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MdOutlinePhotoLibrary, MdEmojiEmotions } from "react-icons/md";
import Picker from "emoji-picker-react";
import axiosInstance from "src/helpers/axios";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { getBase64, LoaderSpinner, toCapitalized } from "src/reusable";
import Female from "src/assets/icons/female.jpg";
import Male from "src/assets/icons/male.jpg";
import moment from "moment";
import shortid from "shortid";
import ImageUploaderChat from "../ImageUploader";
import Linkify from "react-linkify";
import Photogrid from "react-facebook-photo-grid";
import { BiSend } from "react-icons/bi";
const CashierInboxView = () => {
  const uploadRef = useRef();
  const chatContainer = useRef();
  const { cashierId } = useParams();
  const { socket } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [images, setImages] = useState([]);
  const [cashier, setCashier] = useState(null);
  const [active, setActive] = useState(false);
  const onEmojiClick = (e, { emoji }) => {
    setMessage((prev) => {
      return (prev += emoji);
    });
  };
  const handleGetCashierChat = async () => {
    try {
      if (chat.length < 1) {
        setLoading(true);
      }
      const res = await axiosInstance.post("/get-cashier-chat-information", {
        cashierId,
      });
      setLoading(false);
      handleUpdate();
      if (res.status === 200) {
        setCashier(res.data.cashier);
        setChat(res.data.chat);
        console.log(res.data.chat.length);
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
      handleUpdate();
      setLoading(true);
      // setChat([]);
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
      handleUpdate();
      setLoading(true);
      //setChat([]);
    };
    // eslint-disable-next-line
  }, [cashierId]);
  useEffect(() => {
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
      socket.on("new-message-send-by-cashier", async (data) => {
        if (cashier) {
          const { sendMessage } = await data;
          if (sendMessage) {
            if (
              sendMessage.sender.cashier
                .toLowerCase()
                .includes(cashier._id.toLowerCase())
            ) {
              setChat((prev) => {
                return [...prev, sendMessage];
              });
            }
          }
        }
      });
    }
    // eslint-disable-next-line
  }, [socket]);
  const handleUpdate = async () => {
    if (socket) {
      try {
        const result = await axiosInstance.post(
          "/update-unseen-cashier-information",
          { cashierId }
        );
        socket.emit("update-socket-cashier", { result }, (data) => {});
        return 0;
      } catch (e) {}
    }
  };
  const handleImageChange = async (e) => {
    const { files } = e.target;
    const letData = [];
    for (let file of files) {
      letData.push({
        url: await getBase64(file),
        _id: shortid.generate(),
        file,
      });
    }
    setImages([...images, ...letData]);
  };
  const handlescrollBottom = () => {
    const scroll =
      chatContainer.current.scrollHeight - chatContainer.current.clientHeight;
    chatContainer.current.scrollTo(0, scroll);
  };

  const handleSendChat = async () => {
    if (message.trim().length > 0) {
      if (socket) {
        setChat((prev) => {
          return [
            ...prev,
            {
              createdAt: new Date(),
              message,
              images,
              sender: { branch: user._id },
              receiver: { cashier: cashierId },
            },
          ];
        });
        setImages([]);
        setMessage("");
        socket.emit(
          "send-chat-cashier-data-by-branch",
          { images, cashierId, message },
          (data) => {
            handleUpdate();
          }
        );
      }
      return;
    }
    if (images.length > 0) {
      if (socket) {
        setChat((prev) => {
          return [
            ...prev,
            {
              createdAt: new Date(),
              message,
              images,
              sender: { branch: user._id },
              receiver: { cashier: cashierId },
            },
          ];
        });
        setImages([]);
        setMessage("");
        socket.emit(
          "send-chat-cashier-data-by-branch",
          { images, cashierId, message },
          (data) => {
            handleUpdate();
          }
        );
      }
      return;
    }
  };
  useEffect(() => {
    handlescrollBottom();
  }, [chat]);
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
        <div className="chat-content-info-content" ref={chatContainer}>
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
          {!loading ? (
            chat.map((data) => {
              if (user) {
                if (
                  !data.hasOwnProperty("message") ||
                  !data.hasOwnProperty("images")
                ) {
                  return null;
                }
                if (data.sender.cashier) {
                  return (
                    <div className="left-sender">
                      <div className="sender-content">
                        <img
                          src={
                            cashier
                              ? cashier.profile.url
                                ? cashier.profile.url
                                : cashier.profile.sex === "Male"
                                ? Female
                                : Male
                              : Male
                          }
                          alt="cashier-pofilexx"
                        />
                        <div className="w-100 d-flex flex-column">
                          {data.message.trim().length > 0 ? (
                            <div className="left-sender-content">
                              <p>
                                {" "}
                                <Linkify>{data.message}</Linkify>
                              </p>
                            </div>
                          ) : null}
                          {data.images.length > 0 ? (
                            <div className="image-container-chat ml-1">
                              <Photogrid
                                images={data.images.map((photo) => {
                                  return photo.url;
                                })}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <p>{moment(new Date(data.createdAt)).fromNow()}</p>
                    </div>
                  );
                }
                if (data.sender.branch) {
                  return (
                    <div className="right-sender">
                      <div className="sender-content">
                        {data.message.trim().length > 0 ? (
                          <div className="right-sender-content">
                            <p>
                              {" "}
                              <Linkify>{data.message}</Linkify>
                            </p>
                          </div>
                        ) : null}

                        <img
                          src={user ? user.branch_owner_profile.profile : Male}
                          alt="cashier-pofilexx"
                        />
                      </div>
                      {data.images.length > 0 ? (
                        <div className="image-container-chat mr-1">
                          <Photogrid
                            images={data.images.map((photo) => {
                              return photo.url;
                            })}
                          />
                        </div>
                      ) : null}
                      <p className="text-right">
                        {moment(new Date(data.createdAt)).fromNow()}
                      </p>
                    </div>
                  );
                }
              }
              return null;
            })
          ) : (
            <LoaderSpinner height="400px" />
          )}
        </div>
        {!loading ? (
          cashier ? (
            images.length > 0 ? (
              <ImageUploaderChat images={images} setImages={setImages} />
            ) : null
          ) : null
        ) : null}
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
                onClick={(e) => {
                  uploadRef.current.click();
                }}
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
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendChat();
                  }
                }}
              />
              {images.length > 0 || message.trim().length > 0 ? (
                <BiSend
                  size={25}
                  color="#30a501"
                  onClick={handleSendChat}
                  className="ml-2 hover"
                />
              ) : null}
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                multiple={true}
                className="d-none"
                onChange={handleImageChange}
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
