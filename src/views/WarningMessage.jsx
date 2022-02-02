import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "src/helpers/axios";
import { LoaderSpinner } from "src/reusable";

const WarningMessage = () => {
  const { _id } = useParams();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);

  const handleGetWarning = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/get-warning-details", { _id });
      setLoading(false);
      if (res.status === 200) {
        setContent(res.data);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetWarning();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    handleGetWarning();
    // eslint-disable-next-line
  }, [_id]);
  return loading ? (
    <LoaderSpinner height="400px" />
  ) : content ? (
    <div className="w-100 p-1 card shadow">
      <h3 className="gradient__text ml-4"> JARM MANAGEMENT </h3>
      <div className="p-2">
        <span dangerouslySetInnerHTML={{ __html: content.message }} />
      </div>
    </div>
  ) : (
    <h1 className="mt-5 text-center text-danger">Content Not Found </h1>
  );
};
export default WarningMessage;
