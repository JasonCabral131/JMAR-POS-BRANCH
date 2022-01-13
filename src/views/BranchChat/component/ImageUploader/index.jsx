import React from "react";
import "./style.scss";
import { IoMdClose } from "react-icons/io";
const ImageUploaderChat = ({ images, setImages }) => {
  const removeImage = (_id) => {
    const removed = images.filter((data) => data._id !== _id);
    console.log(removed);
    setImages(removed);
  };
  return (
    <div className="chat-uploader-container">
      {images.map((data) => {
        return (
          <div key={Math.random()} className="image-card-container">
            <img alt={Math.random()} src={data.url} />
            <div
              className="remove-chat-upload"
              onClick={() => removeImage(data._id)}
            >
              <IoMdClose size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ImageUploaderChat;
