import React, { useEffect, useState } from "react";
import { IoImages } from "react-icons/io5";
import Editor from "@react-page/editor";
import slate from "@react-page/plugins-slate";
// image
import image from "@react-page/plugins-image";
import { useHistory } from "react-router-dom";
import { ImageGallery } from "src/reusable";
import { useDispatch } from "react-redux";
import { createBlog } from "src/redux/action/blog.action";
import Skeleton from "react-loading-skeleton";

const cellPlugins = [slate(), image];
const CreateBlogInfo = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [title, setTitle] = useState("");

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [value, setValue] = useState(null);

  const handleSubmit = async () => {
    const form = new FormData();
    let message = JSON.stringify(value);
    form.append("information", message);
    form.append("title", title);
    for (let file of images) {
      form.append("photos", file.file);
    }
    console.log(message);
    setLoading(true);
    const res = await dispatch(createBlog(form));

    setLoading(false);
    if (res) {
      history.push("/branch/BlogPosting");
    }
  };
  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <div className="w-100 card shadow p-3">
      {loading ? (
        <>
          <Skeleton height={50} />
          <Skeleton height={650} />
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
                  }
                }}
              />
            ) : null}
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
