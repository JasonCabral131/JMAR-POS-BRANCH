import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
function BlogLoading() {
  return (
    <SkeletonTheme baseColor="#AFBEC2" highlightColor="#EBEDEF">
      <div className="skeletong-loading-container-card card shadow p-2">
        <div className="d-flex">
          <Skeleton circle={true} height={60} width={60} />
          <div className="ml-2">
            <Skeleton height={15} width={250} />
            <div className="ml-2">
              <Skeleton height={12} width={200} />
            </div>
          </div>
        </div>
        <div className="mt-1">
          <Skeleton height={30} width={300} />
        </div>
        <div className="mt-1">
          <Skeleton height={500} width={"100%"} />
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default BlogLoading;
