import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { getBase64, LoaderSpinner, toCapitalized } from "src/reusable";
import Female from "src/assets/icons/female.jpg";
import Male from "src/assets/icons/male.jpg";
import "react-bnb-gallery/dist/style.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "./style.scss";
import Picker from "emoji-picker-react";
import { BiSend } from "react-icons/bi";
import { MdOutlinePhotoLibrary, MdEmojiEmotions } from "react-icons/md";
import shortid from "shortid";
import ImageUploaderChat from "src/views/BranchChat/component/ImageUploader";
import moment from "moment";
import cashierAxios from "src/helpers/cashierAxios";
import Linkify from "react-linkify";
import Photogrid from "react-facebook-photo-grid";
import { CCollapse } from "@coreui/react";
import ReactBnbGallery from "react-bnb-gallery";
import Gallery from "react-photo-gallery";
import "react-bnb-gallery/dist/style.css";
import { FaRegEye } from "react-icons/fa";
const BranchChatContent = () => {
  const uploadRef = useRef();
  const chatContainer = useRef();
  const { user, authenticating } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [showMedia, setShowMedia] = useState(true);
  const [media, setMedia] = useState([]);
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [view, setView] = useState(false);
  const handleGetChatInfo = async () => {
    if (user) {
      try {
        if (chat.length < 1) {
          setLoading(true);
        }
        const res = await cashierAxios.post("/get-chat-from-branch", {
          branch: user.branch._id,
        });
        setLoading(false);
        if (res.status === 200) {
          setChat(res.data.chat);
          setMedia(res.data.media);
          await cashierAxios.post("/update-unseen-chat-from-branch", {
            branch: user.branch._id,
          });
        }
      } catch (e) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    handleGetChatInfo();
    if (socket) {
      socket.emit(
        "is-branch-owner-active",
        { branchId: user.branch._id },
        (data) => {
          setActive(data);
        }
      );
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (socket) {
      socket.emit(
        "is-branch-owner-active",
        { branchId: user.branch._id },
        (data) => {
          setActive(data);
        }
      );
      socket.on("new-message-send-by-branch", async (data) => {
        if (user) {
          const { sendMessage } = await data;
          if (sendMessage) {
            if (
              sendMessage.sender.branch
                .toLowerCase()
                .includes(user.branch._id.toLowerCase())
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
  const handlescrollBottom = () => {
    const scroll =
      chatContainer.current.scrollHeight - chatContainer.current.clientHeight;
    chatContainer.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    handlescrollBottom();
  }, [chat]);
  const onEmojiClick = (e, { emoji }) => {
    setMessage((prev) => {
      return (prev += emoji);
    });
  };
  const handleSendChat = () => {
    if (message.trim().length > 0) {
      if (socket) {
        setChat([
          ...chat,
          {
            createdAt: new Date(),
            message,
            images,
            sender: { cashier: user._id },
            receiver: { branch: user.branch._id },
          },
        ]);
        setImages([]);
        setMessage("");
        socket.emit(
          "sending-msg-cashier-to-branch",
          { images, branch: user.branch._id, message },
          (data) => {
            console.log(data);
          }
        );
      }
      return;
    }
    if (images.length > 0) {
      if (socket) {
        setChat([
          ...chat,
          {
            createdAt: new Date(),
            message,
            images,
            sender: { cashier: user._id },
            receiver: { branch: user.branch._id },
          },
        ]);
        setImages([]);
        setMessage("");
        socket.emit(
          "sending-msg-cashier-to-branch",
          { images, branch: user.branch._id, message },
          (data) => {
            console.log(data);
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
      <div className="owner-content-info">
        <div className="chat-content-info-header shadow">
          {authenticating ? (
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
                  user
                    ? user.branch.branch_owner_profile.profile
                      ? user.branch.branch_owner_profile.profile
                      : user.branch.branch_owner_sex === "male"
                      ? Female
                      : Male
                    : Male
                }
              />
              <div className="profile-heading">
                <h1>
                  {user
                    ? toCapitalized(
                        `${user.branch.branch_owner_fname} ${user.branch.branch_owner_MI}. ${user.branch.branch_owner_lname}`
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
              <FaRegEye
                size={25}
                color="#ffffff"
                className="hover eye-view-content"
                onClick={() => setView(!view)}
              />
            </div>
          )}
        </div>
        <div className="chat-content-info-content" ref={chatContainer}>
          {!loading || !authenticating ? (
            <div className="chat-heading-information">
              <center>
                <img
                  alt="cashier-pofilexx"
                  src={
                    user
                      ? user.branch.branch_owner_profile.profile
                        ? user.branch.branch_owner_profile.profile
                        : user.branch.branch_owner_sex === "male"
                        ? Female
                        : Male
                      : Male
                  }
                />
                <h1 className="gradient__text">
                  {user
                    ? toCapitalized(
                        `${user.branch.branch_owner_fname} ${user.branch.branch_owner_MI}. ${user.branch.branch_owner_lname}`
                      )
                    : "Branch Information Not Found"}
                </h1>
                <h3>
                  This store created since{" "}
                  {user
                    ? moment(new Date(user.branch.createdAt)).get("year")
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
                            user
                              ? user.profile.url
                                ? user.profile.url
                                : user.profile.sex === "Male"
                                ? Female
                                : Male
                              : Male
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
                if (data.sender.branch) {
                  return (
                    <div className="left-sender">
                      <div className="sender-content">
                        <img
                          src={
                            user
                              ? user.branch.branch_owner_profile.profile
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
              }
              return null;
            })
          ) : (
            <LoaderSpinner height="400px" />
          )}
        </div>
        {!loading ? (
          user ? (
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
          ) : user ? (
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
      <div className="owner-right-side">
        <div className="shared-media-content d-flex justify-content-between pointer">
          <h6 className="text-white">
            Shared Media Photos{" "}
            <FaRegEye
              size={25}
              color="#ffffff"
              className="hover ml-1"
              onClick={() => setView(!view)}
            />
          </h6>

          <div className="text-left ml-5">
            {showMedia ? (
              <IoIosArrowUp
                className="text-white"
                size={20}
                onClick={() => setShowMedia(!showMedia)}
              />
            ) : (
              <IoIosArrowDown
                className="text-white"
                size={20}
                onClick={() => setShowMedia(!showMedia)}
              />
            )}
          </div>
        </div>
        <CCollapse show={showMedia}>
          <div className="container p-1">
            <ReactBnbGallery
              show={view}
              photos={media.map((photo) => {
                return photo.url;
              })}
              onClose={() => setView(false)}
            />
            <Gallery
              photos={media.map((photo) => {
                return {
                  src: photo.url,
                  width: 1,
                  height: 1,
                };
              })}
            />
          </div>
        </CCollapse>
      </div>
    </div>
  );
};

export default BranchChatContent;
