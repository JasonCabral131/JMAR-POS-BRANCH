import React from "react";
import creator from "src/assets/icons/creator.jpg";
const RecentPost = (props) => {
  return (
    <div className="w-100 p-1">
      {" "}
      <div className="card shadow p-1">
        <div className=" blog-content-heading">
          <img alt={Math.random()} src={creator} />
          <label>Top Content Creator</label>
        </div>
      </div>
    </div>
  );
};
export default RecentPost;
