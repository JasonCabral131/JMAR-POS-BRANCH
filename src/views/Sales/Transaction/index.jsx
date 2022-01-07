import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "src/helpers/axios";
import { LoaderSpinner } from "src/reusable";
import { SalesInfo } from "../Recent/RecentSale";

const Transaaction = () => {
  const [item, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const handleTransaction = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/get-transaction-information/${id}`);
      setLoading(false);
      if (res.status === 200) {
        setSale(res.data);
        return;
      }
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleTransaction();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="w-100 p-2">
      {loading ? (
        <LoaderSpinner height="400px" />
      ) : item ? (
        <div className="w-100">
          <SalesInfo item={item} />
        </div>
      ) : (
        <h1 className="mt-4 text-center text-danger">No Data Found</h1>
      )}
    </div>
  );
};

export default Transaaction;
