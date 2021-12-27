import React, { useState } from "react";
import { useSelector } from "react-redux";
import CreateBlogInfo from "./createBLog";
import RecentPost from "./Recent";
import "./style.scss";

const BlogPosting = (props) => {
  const [createBlogModal, setCreateBlog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="row">
      <div className="col-md-9  p-2">
        <div className="create-post shadow card p-2">
          <div className="blog-profile">
            <img
              alt={"blog-user-profile"}
              src={user.branch_owner_profile.profile}
            />
          </div>
          <div
            className="create-blog-input"
            onClick={() => setCreateBlog(true)}
          >
            <input
              type="text"
              placeholder={`What's on your mind, ${
                user ? user.branch_owner_fname : ""
              } start creating blog`}
              disabled={true}
            />
          </div>
        </div>
      </div>
      <div className="col-md-3  p-1">
        <RecentPost />
      </div>
      <CreateBlogInfo
        createBlogModal={createBlogModal}
        setCreateBlog={setCreateBlog}
        user={user}
      />
    </div>
  );
};
export default BlogPosting;
