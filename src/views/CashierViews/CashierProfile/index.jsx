import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import cashierAxios from "src/helpers/cashierAxios";
import CashierInfo from "src/views/cashier/cashierSales/CashierInfo";
import { CDataTable, CCollapse, CCardBody } from "@coreui/react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import moment from "moment";
const CashierProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [details, setDetails] = useState([]);
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };
  const handleGetLogs = async (res) => {
    try {
      setLoading(true);
      const res = await cashierAxios.get("/get-cashier-logs-information");
      setLoading(false);
      if (res.status === 200) {
        setLogs(res.data);
      }
    } catch (e) {
      setLoading(true);
    }
  };
  useEffect(() => {
    handleGetLogs();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="w-100">
      {user ? <CashierInfo cashier={user} /> : null}
      <div className="card shadow mt-2 p-2">
        <CDataTable
          items={logs}
          fields={fields}
          columnFilter={false}
          tableFilterValue={null}
          tableFilter={{ placeholder: "search information..." }}
          itemsPerPageSelect={true}
          itemsPerPage={5}
          hover
          sorter
          pagination
          loading={loading}
          scopedSlots={{
            show_details: (item, index) => (
              <td>
                <div className="d-flex justify-content-center">
                  {details.includes(index) ? (
                    <AiOutlineDown
                      onClick={() => {
                        toggleDetails(index);
                      }}
                      className="hover mt-1 ml-4"
                    />
                  ) : (
                    <AiOutlineUp
                      onClick={() => {
                        toggleDetails(index);
                      }}
                      className="hover mt-1 ml-4"
                    />
                  )}
                </div>
              </td>
            ),
            details: (item, index) => {
              return (
                <CCollapse show={details.includes(index)}>
                  <CCardBody className={"p-1"}>
                    <h4 className="ml-2">{item.date + " List Of Sales"}</h4>
                    <div className="card shadow p-2">
                      <CDataTable
                        items={[...item.data]}
                        fields={Logfields}
                        columnFilter={false}
                        tableFilter={{
                          placeholder: "Log Information",
                        }}
                        footer={false}
                        itemsPerPageSelect={true}
                        itemsPerPage={10}
                        hover
                        sorter
                        pagination
                        scopedSlots={{
                          createdAt: (item) => {
                            return <td>{moment(item.createdAt).fromNow()}</td>;
                          },
                        }}
                      />
                    </div>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
        />
      </div>
    </div>
  );
};

export default CashierProfile;
const fields = [
  {
    key: "date",
    label: "Logs login and logout Date",
    _style: { width: "45%" },
  },
  {
    key: "show_details",
    label: "Details",
    _style: { width: "1%" },
  },
];
const Logfields = [
  {
    key: "message",
    label: "Log",
    _style: { width: "45%" },
  },
  {
    key: "createdAt",
    label: "Time",
    _style: { width: "45%" },
  },
];
