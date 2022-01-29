import React, { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import RecentPost from "./Recent";
import "./style.scss";
import Skeleton from "react-loading-skeleton";
import { IoMdGlobe } from "react-icons/io";
import { LoremIpsum } from "react-lorem-ipsum";
import Avatar from "react-avatar";
import moment from "moment";
const ImageComponent = React.lazy(() => import("./ImageComponent"));
const BlogPosting = (props) => {
  const history = useHistory();
  const { user } = useSelector((state) => state.auth);
  const [listItems, setListItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
    window.addEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, []);

  const handleScroll = () => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;
    setIsFetching(true);
  };

  const fetchData = async () => {
    setTimeout(async () => {
      const result = await fetch(`https://picsum.photos/v2/list?page=${page}`);
      const data = await result.json();
      setPage(page + 1);
      console.log(data);
      setListItems(() => {
        return [...listItems, ...data];
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreListItems();
    // eslint-disable-next-line
  }, [isFetching]);

  const fetchMoreListItems = () => {
    fetchData();
    setIsFetching(false);
  };
  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
  return (
    <div className="row ">
      <div className="col-md-9  p-2">
        <div className="create-post shadow card p-2">
          <div className="blog-profile">
            <img
              alt={"blog-user-profile"}
              src={user.branch_owner_profile.profile}
              onClick={() => {
                history.push("/branch/BlogPosting/personal-blog-content");
              }}
            />
          </div>
          <div
            className="create-blog-input"
            onClick={() => {
              history.push("/branch/BlogPosting/creatingBlog");
            }}
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
        <>
          {listItems.map((listItem) => (
            <div
              className="card data-info mt-2"
              key={listItem.id}
              style={{ width: "100%" }}
            >
              <div className="container">
                <div className="d-flex">
                  <Avatar name={listItem.author} size="60" round={true} />
                  <div className="ml-2">
                    <h1 className="user-info-blog">{listItem.author}</h1>
                    <div className="ml-1">
                      <p className="blog-from-now">
                        {moment(
                          randomDate(new Date(2021, 4, 11), new Date())
                        ).fromNow()}{" "}
                        <IoMdGlobe className="ml-2" />
                      </p>
                    </div>
                  </div>
                </div>
                <h4>
                  <b>{listItem.author}</b>
                </h4>

                <LoremIpsum p={Math.floor(Math.random() * 6)} />
              </div>
              <Suspense fallback={<Skeleton width={"100%"} height={300} />}>
                <ImageComponent src={listItem.download_url} />
              </Suspense>
            </div>
          ))}
          {isFetching && <h6>Fetching more list blogs...</h6>}
        </>
      </div>
      <div className="col-md-3  p-1 ">
        <RecentPost />
      </div>
    </div>
  );
};
export default BlogPosting;
