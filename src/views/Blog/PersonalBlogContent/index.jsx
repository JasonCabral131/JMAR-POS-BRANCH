import React from "react";
import "./style.scss";
import background from "src/assets/icons/background.png";
import { useSelector } from "react-redux";
import jarm from "src/assets/icons/Jarm_Logo.svg";
import { MdModeEditOutline } from "react-icons/md";
import { useHistory, useLocation } from "react-router-dom";

const PersonalBlogContent = (props) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const history = useHistory();
  return (
    <div className="personl-container">
      <div className="profile-container">
        <div className="user-profile-container  p-2">
          <div className="profile-background">
            <img alt="background-img" src={background} />
            <h1 className="branch-name">
              {user ? `${user.branch_name} Store` : null}
            </h1>
            <div className="lining-style" />
            <div className="avatar-container">
              <img
                className="avatar-profile"
                alt="avatar-profile"
                src={
                  user
                    ? user.branch_owner_profile.profile
                      ? user.branch_owner_profile.profile
                      : jarm
                    : jarm
                }
              />
            </div>
            <div className="user-personal-info">
              <h1>
                <span>
                  {user
                    ? `${user.branch_owner_fname} ${user.branch_owner_MI} ${user.branch_owner_lname}`
                    : null}
                </span>
              </h1>
              <h2>{user ? user.branch_address.fullAddress : null}</h2>
            </div>
          </div>

          <div className="default-space" />
          <div className="profile-navigation">
            <div className="profile-navigation-lists">
              <p
                className={
                  location.pathname ===
                  "/branch/BlogPosting/personal-blog-content"
                    ? "active-route"
                    : ""
                }
                onClick={() =>
                  history.push("/branch/BlogPosting/personal-blog-content")
                }
              >
                Blog
              </p>
              <p
                onClick={() =>
                  history.push(
                    "/branch/BlogPosting/personal-blog-content/blog-photo-album"
                  )
                }
                className={
                  location.pathname ===
                  "/branch/BlogPosting/personal-blog-content/blog-photo-album"
                    ? "active-route"
                    : ""
                }
              >
                Photo
              </p>
            </div>
            <div className="edit-profile-navgiation">
              <button>
                <MdModeEditOutline size={20} /> <span>Edit profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalBlogContent;
