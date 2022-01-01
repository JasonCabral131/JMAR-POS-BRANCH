import React, { useState, Suspense } from "react";
import HeadingPerson from "./../index";
import "./style.scss";
import BlogLoading from "../BlogLoading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPersonalBlog } from "src/redux/action/blog.action";
import { useSelector } from "react-redux";
import moment from "moment";
import { IoMdGlobe } from "react-icons/io";
import Editor from "@react-page/editor";
import slate from "@react-page/plugins-slate";
// image
import Skeleton from "react-loading-skeleton";
import image from "@react-page/plugins-image";
import Photogrid from "react-facebook-photo-grid";
const cellPlugins = [slate(), image];
const BlogPersonal = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const handleGetBlog = async () => {
    setLoading(true);
    const res = await dispatch(getPersonalBlog());
    setLoading(false);
    if (res.result) {
      setBlogs(res.blogs);
    }
  };
  useEffect(() => {
    handleGetBlog();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <HeadingPerson />

      <div className="personal-blog-content-container">
        {loading ? (
          <BlogLoading />
        ) : (
          <>
            {blogs.map((data) => {
              return (
                <div
                  className="skeletong-loading-container-card card shadow p-2 mt-1"
                  key={data._id}
                >
                  <div></div>
                  <div className="d-flex">
                    <img
                      className="avatar-user-info"
                      alt={"user profile info"}
                      src={user ? user.branch_owner_profile.profile : null}
                    />
                    <div className="ml-2">
                      <h1 className="user-info-blog">
                        {user
                          ? `${user.branch_owner_fname} ${user.branch_owner_lname}`
                          : null}
                      </h1>
                      <div className="ml-1">
                        <p className="blog-from-now">
                          {moment(data.createdAt).fromNow()}{" "}
                          <IoMdGlobe className="ml-2" />
                        </p>
                      </div>
                    </div>
                  </div>
                  <h1 className="blog-title">{data.title}</h1>
                  <div className="mt-1 w-100" />
                  <Editor
                    cellPlugins={cellPlugins}
                    value={JSON.parse(data.information)}
                    readOnly
                  />
                  <div className="w-100 mt-1" />
                  <Suspense fallback={<Skeleton height={300} width={"100%"} />}>
                    <Photogrid
                      images={data.photos.map((photo) => {
                        return photo.url;
                      })}
                    />
                  </Suspense>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default BlogPersonal;
