import React, { useState, useEffect, useRef } from "react";
import JARM from "src/assets/icons/chat.jpg";
import ImageUploaderChat from "../ImageUploader";
import axios from "src/helpers/axios";
import Picker from "emoji-picker-react";
import Skeleton from "react-loading-skeleton";
import { MdOutlinePhotoLibrary, MdEmojiEmotions } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import { getBase64 } from "src/reusable/index";
import shortid from "shortid";
import { useSelector } from "react-redux";
import Linkify from "react-linkify";
import Photogrid from "react-facebook-photo-grid";
import moment from "moment";
import Male from "src/assets/icons/male.jpg";
import axiosInstance from "src/helpers/axios";
const AdminView = () => {
  const uploadRef = useRef();
  const chatContainer = useRef();
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [chat, setChat] = useState([]);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const handleGetConvoAdmin = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/get-chat-room-admin");
      setLoading(false);
      if (res.status === 200) {
        setChat(res.data);
        handleUpdate();
      }
    } catch (e) {
      setLoading(false);
    }
  };
  const onEmojiClick = (e, { emoji }) => {
    setMessage((prev) => {
      return (prev += emoji);
    });
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
              receiver: { admin: "6124fc63b3cc293abc52a7dc" },
            },
          ];
        });
        setImages([]);
        setMessage("");
        socket.emit("send-msg-store-to-admin", { images, message }, (data) => {
          handleUpdate();
        });
      }
      return;
    }
  };
  const handlescrollBottom = () => {
    const scroll =
      chatContainer.current.scrollHeight - chatContainer.current.clientHeight;
    chatContainer.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    handlescrollBottom();
    // eslint-disable-next-line
  }, [chat]);

  useEffect(() => {
    handleGetConvoAdmin();
    if (socket) {
      socket.on("new-message-send-by-admin", async (data) => {
        const { sendMessage } = await data;
        if (sendMessage) {
          setChat((prev) => {
            return [...prev, sendMessage];
          });
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new-message-send-by-admin", async (data) => {
        const { sendMessage } = await data;
        if (sendMessage) {
          setChat((prev) => {
            return [...prev, sendMessage];
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [socket]);

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
  const handleUpdate = async () => {
    if (socket) {
      const result = await axiosInstance.post("/update-unseen-store-admin", {
        admin: "6124fc63b3cc293abc52a7dc",
      });
      socket.emit("update-socket-store-admin", { result }, (data) => {});
      return 0;
    }
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
              <img alt="avatar-logo" src={JARM} />
              <div className="profile-heading">
                <h1>JARM MANAGEMENT</h1>
                <h2>
                  status - <span className={"active"}>active</span>
                </h2>
              </div>
            </div>
          )}
        </div>
        <div className="chat-content-info-content" ref={chatContainer}>
          {!loading ? (
            <div className="chat-heading-information">
              <center>
                <img alt="cashier-pofilexx" src={JARM} />
                <h1 className="gradient__text">JARM MANAGEMENT CHAT SYSTEM</h1>
                <h3>Hi Welcome to JARM</h3>
              </center>
            </div>
          ) : null}
          {!loading
            ? chat.map((data) => {
                if (
                  !data.hasOwnProperty("message") ||
                  !data.hasOwnProperty("images")
                ) {
                  return null;
                }
                if (user) {
                  if (data.sender.admin) {
                    return (
                      <div className="left-sender">
                        <div className="sender-content">
                          <img src={JARM} alt="cashier-pofilexx" />
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
                            src={
                              user ? user.branch_owner_profile.profile : Male
                            }
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
            : null}
        </div>
        {!loading ? (
          images.length > 0 ? (
            <ImageUploaderChat images={images} setImages={setImages} />
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
          ) : (
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
          )}
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
        ) : (
          <div className="chat-right-content">
            <center></center>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
