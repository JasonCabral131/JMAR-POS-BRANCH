import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const CounterSkelon = (props) => {
  return (
    <SkeletonTheme baseColor="#AFBEC2" highlightColor="#EBEDEF">
      <div className="row ml-2">
        <div className="col-md-9">
          <div className="row mt-1">
            <div className="col-md-4">
              <div className="ml-4">
                <Skeleton height={25} width={250} />
              </div>
              <div className="ml-4">
                <Skeleton height={35} width={350} />
              </div>
            </div>
            <div className="col-md-8 d-flex justify-content-between">
              <div className="w-50">
                <Skeleton height={100} width={100} />
              </div>
              <div className="w-50 d-flex justify-content-end">
                <Skeleton height={100} width={100} />
              </div>
            </div>
          </div>
          <div className="mt-2  p-2" style={{ height: 410 }}>
            <Skeleton height={395} width={"100%"} />
          </div>
        </div>
        <div className="col-md-3">
          <div
            style={{
              width: "100%",
              marginTop: 20,
            }}
          >
            <Skeleton height={35} width={"100%"} />
            <div className="mt-2">
              <Skeleton height={85} width={"100%"} />
            </div>
            <div className="mt-1">
              <Skeleton height={18} width={150} />
            </div>

            <div className="w-100 mt-2" />
            <Skeleton height={48} width={"100%"} borderRadius={10} />
            <div className="w-100 mt-2" />
            <Skeleton height={118} width={"100%"} borderRadius={10} />
            <div className="w-100 mt-2" />
            <Skeleton height={50} width={"100%"} borderRadius={2} />
            <div className="w-100 mt-2" />
            <Skeleton height={50} width={"100%"} borderRadius={2} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
export default CounterSkelon;
