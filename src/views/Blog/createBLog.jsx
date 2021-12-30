import React, { useEffect, useState, useCallback } from "react";
import { IoImages } from "react-icons/io5";
import { EditorState, convertToRaw, ContentState } from "draft-js";

import Editor from "@react-page/editor";
import slate from "@react-page/plugins-slate";
// image
import image from "@react-page/plugins-image";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
//import { DraftJsToolBar } from "src/reusable/EditorStateComponent";
import Picker from "emoji-picker-react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { ImageGallery } from "src/reusable";
import { useDispatch } from "react-redux";
import { createBlog } from "src/redux/action/blog.action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const cellPlugins = [slate(), image];
const CreateBlogInfo = ({ createBlogModal, setCreateBlog, user }) => {
  const dispatch = useDispatch();
  const [editorState, setEditorState] = useState(null);
  const [title, setTitle] = useState("");
  const [showImoji, setShowEmoji] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [value, setValue] = useState(null);
  const handleEditorState = useCallback(() => {
    const html = "<span></span>";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
      setImages([]);
      setTitle("");
    }
  }, [setEditorState]);
  useEffect(() => {
    handleEditorState();
    // eslint-disable-next-line
  }, []);

  const onEmojiClick = (event, emojiObject) => {
    let message = editorState
      ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
      : "<span></span>";

    const html = (message += `<span>${emojiObject.emoji}</span>`);
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  };
  const handleSubmit = async () => {
    const form = new FormData();
    let message = editorState
      ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
      : "<span></span>";
    form.append("information", message);
    form.append("title", title);
    for (let file of images) {
      form.append("photos", file.file);
    }
    setLoading(true);
    const res = await dispatch(createBlog(form));

    setLoading(false);
    if (res) {
      handleEditorState();
    }
  };
  return (
    <div className="w-100">
      {loading ? (
        <>
          <Skeleton height={50} />
          <Skeleton height={450} />
          <Skeleton height={40} />
          <Skeleton height={60} />
        </>
      ) : (
        <>
          <div className=" percent-container mt-1 ">
            <label className="label-name text-left d-block">Blog Title</label>
            <input
              type="text"
              className=""
              placeholder={`input blog title`}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <br />
          <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
          <br />
          {showImages ? (
            <ImageGallery images={images} setImages={setImages} />
          ) : null}

          {showImoji ? (
            <Picker
              onEmojiClick={onEmojiClick}
              pickerStyle={{ width: "100%" }}
            />
          ) : null}
          <div className="adding-post-heading w-50 ">Add to your post</div>
          <div className="w-50 left-heading d-flex">
            {!loading ? (
              <IoImages
                color="#41B35D"
                size={30}
                className="hover"
                onClick={() => {
                  if (!loading) {
                    setShowImages(!showImages);
                    setShowEmoji(false);
                  }
                }}
              />
            ) : null}
            <HiOutlineEmojiHappy
              size={25}
              className="hover ml-3"
              onClick={() => {
                setShowImages(false);
                setShowEmoji(!showImoji);
              }}
            />
          </div>
          <button
            className={`btn btn-${
              title.length < 2 ? "secondary" : "info"
            } mt-2 `}
            style={{
              display: "flex",
              justifySelf: "center",
              alignSelf: "center",
              margin: "0 auto",
              padding: "8px",
              width: "95%",
              justifyItems: "center",
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              alignContent: "center",
            }}
            disabled={title.length < 2 ? true : false}
            onClick={handleSubmit}
          >
            Post
          </button>
        </>
      )}
    </div>
  );
};
export default CreateBlogInfo;
