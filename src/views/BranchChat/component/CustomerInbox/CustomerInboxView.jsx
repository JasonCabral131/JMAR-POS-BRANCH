import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import axiosInstance from "src/helpers/axios";
import { getBase64, LoaderSpinner, toCapitalized } from "src/reusable";
import Female from "src/assets/icons/female.jpg";
import Male from "src/assets/icons/male.jpg";
import moment from "moment";
import Photogrid from "react-facebook-photo-grid";
import Linkify from "react-linkify";
import { useSelector } from "react-redux";
import ImageUploaderChat from "../ImageUploader";
import { BiSend } from "react-icons/bi";
import { MdOutlinePhotoLibrary, MdEmojiEmotions } from "react-icons/md";
import Picker from "emoji-picker-react";
import shortid from "shortid";

const CustomerInboxView = () => {
  const { customerId } = useParams();
  const { socket } = useSelector((state) => state.socket);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const chatContainer = useRef();
  const uploadRef = useRef();
  const [message, setMessage] = useState("");
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [chat, setChat] = useState([]);
  const [images, setImages] = useState([]);
  const [customer, setCustomer] = useState(null);
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
      const res = await axiosInstance.post("/get-branch-to-customer-chat", {
        customerId,
      });
      setLoading(false);
      handleUpdate();
      if (res.status === 200) {
        setCustomer(res.data.customer);
        setChat(res.data.chat);
        console.log(res.data.chat.length);
        return;
      }
    } catch (e) {
      setLoading(false);
    }
  };
  const newCustomerId = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/get-branch-to-customer-chat", {
        customerId,
      });
      setLoading(false);
      handleUpdate();
      if (res.status === 200) {
        setCustomer(res.data.customer);
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
    // eslint-disable-next-line
  }, []);
  const handleSetActive = (data) => {
    if (customer) {
      const isAct = data.filter(
        (c) => c._id.toString() === customer._id.toString()
      );
      setActive(isAct.length > 0);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.emit("get-active-branch-customer", { user }, (data) => {
        handleSetActive(data);
      });
    }
    handlescrollBottom();
    // eslint-disable-next-line
  }, [customer]);
  useEffect(() => {
    newCustomerId();
    return () => {
      setActive(false);
    };
    // eslint-disable-next-line
  }, [customerId]);
  useEffect(() => {
    handlescrollBottom();
    // eslint-disable-next-line
  }, [chat]);
  useEffect(() => {
    if (socket) {
      socket.on("new-join-customer", (data) => {
        socket.emit("get-active-branch-customer", { user }, (data) => {
          handleSetActive(data);
        });
      });
      socket.on("new-message-send-by-customer", async (data) => {
        const { sendMessage } = await data;

        if (sendMessage) {
          if (
            sendMessage.sender.customer
              .toLowerCase()
              .includes(customerId.toLowerCase())
          ) {
            setChat((prev) => {
              return [...prev, sendMessage];
            });
          }
        }
      });
    }
    // eslint-disable-next-line
  }, [socket]);
  const handleUpdate = async () => {
    await axiosInstance.post("/update-chat-cashier", { customerId });
  };
  const handlescrollBottom = () => {
    const scroll =
      chatContainer.current.scrollHeight - chatContainer.current.clientHeight;
    chatContainer.current.scrollTo(0, scroll);
  };
  const handleSendChat = async () => {
    if (message.trim().length > 0 || images.length > 0) {
      if (socket) {
        setChat((prev) => {
          return [
            ...prev,
            {
              createdAt: new Date(),
              message,
              images,
              sender: { branch: user._id },
              receiver: { customer: customerId },
            },
          ];
        });
        setImages([]);
        setMessage("");
        handlescrollBottom();
        socket.emit(
          "send-chat-branch-to-customer",
          { images, customerId, message },
          (data) => {
            handleUpdate();
          }
        );
      }
      return;
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
                  customer
                    ? customer.profile.url
                      ? customer.profile.url
                      : customer.profile.sex === "Male"
                      ? Female
                      : Male
                    : Male
                }
              />
              <div className="profile-heading">
                <h1>
                  {customer
                    ? toCapitalized(
                        `${customer.firstname} ${customer.lastname}`
                      )
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
                    customer
                      ? customer.profile.url
                        ? customer.profile.url
                        : customer.profile.sex === "Male"
                        ? Female
                        : Male
                      : Male
                  }
                />
                <h1 className="gradient__text">
                  {customer
                    ? toCapitalized(
                        `${customer.firstname} ${customer.middlename} ${customer.lastname}`
                      )
                    : "information not found"}
                </h1>
                <h3>
                  Customer Since{" "}
                  {customer
                    ? moment(new Date(customer.createdAt)).get("year")
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
                if (data.sender.customer) {
                  return (
                    <div className="left-sender">
                      <div className="sender-content">
                        <img
                          src={
                            customer
                              ? customer.profile.url
                                ? customer.profile.url
                                : customer.profile.sex === "Male"
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
                return null;
              }
              return null;
            })
          ) : (
            <LoaderSpinner height="400px" />
          )}
        </div>
        {!loading ? (
          customer ? (
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
          ) : customer ? (
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
      <div className="chat-right-side"></div>
    </div>
  );
};

export default CustomerInboxView;
