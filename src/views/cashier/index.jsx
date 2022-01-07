import React, { useState, useEffect } from "react";
import { CButton, CDataTable } from "@coreui/react";
import { Link } from "react-router-dom";
import { RiDeviceRecoverLine, RiFileAddLine } from "react-icons/ri";
import AddBranchCashier from "./addBranchCashier";
import { CashierFields, imagesObject, toCapitalized } from "src/reusable";
import { useDispatch, useSelector } from "react-redux";
import { archivedCashierData, getAllSalesOfCashier } from "src/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IoTrash, IoPencilOutline } from "react-icons/io5";
import UpdateCashierInformation from "./updateCashierInformation";
import Swal from "sweetalert2";
import { LoaderSpinner } from "src/reusable/index";
import { AiOutlineDownload } from "react-icons/ai";
import { triggerBase64Download } from "react-base64-downloader";
import { Chart } from "react-google-charts";
import Loader from "react-loader-spinner";
const CashierInformation = (props) => {
  const { cashier, loading } = useSelector((state) => state.cashier);
  const dispatch = useDispatch();
  const [addingLoading, setAddingLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [credentials, setCredential] = useState(imagesObject);
  const [cashierInformation, setcashierInformation] = useState(null);
  const [cashierSale, setCashierSale] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [chartWrapper, setChartWrapper] = useState(null);
  const handleEdit = (item) => {
    setCredential(imagesObject);
    setUpdateModal(true);
    setcashierInformation(item);
    console.log(item);
  };
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Archived",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(archivedCashierData({ _id: item._id, roles: "archived" }));
      }
    });
  };
  const getstatus = (stat) => {
    if (stat === "active") {
      return "success";
    }
    if (stat === "pending") {
      return "warning";
    }
    if (stat === "banned") {
      return "danger";
    }
  };
  const handleGetSales = async () => {
    setSalesLoading(true);
    const res = await dispatch(getAllSalesOfCashier());
    setSalesLoading(false);
    if (res.result) {
      setCashierSale(res.data);
    }
  };
  useEffect(() => {
    handleGetSales();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (addingLoading) {
      handleGetSales();
    }
    // eslint-disable-next-line
  }, [addingLoading]);
  const print = async () => {
    if (!chartWrapper) {
      console.error("ChartWrapper not ready yet");
    }
    console.log(chartWrapper.getChart());
    const base64 = await chartWrapper.getChart().getImageURI();
    const downloadname = `Brand Sale ( ${new Date().toLocaleString()} )`;
    triggerBase64Download(base64, downloadname);
  };
  return (
    <>
      {salesLoading ? (
        <LoaderSpinner height={"400px"} />
      ) : cashierSale.length > 1 ? (
        <div
          className="w-100 d-flex flex-column justify-content-center  p-2"
          style={{ position: "relative" }}
        >
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="LineChart"
            loader={
              <Loader type="Bars" color="#00BFFF" height={150} width={150} />
            }
            data={cashierSale}
            options={{
              title: `Cashier Sale`,
              hAxis: { title: "Cashier", titleTextStyle: { color: "#333" } },
              vAxis: { minValue: 0 },
              // lineWidth: 25
            }}
            getChartWrapper={(chartWrapper) => {
              setChartWrapper(chartWrapper);
            }}
          />

          {chartWrapper !== null && (
            <CButton
              color="secondary"
              style={{
                width: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "20px",
                right: "15px",
              }}
              variant="outline"
              onClick={() => print()}
            >
              {" "}
              <AiOutlineDownload size={20} />
            </CButton>
          )}
        </div>
      ) : (
        <h1 className="text-danger text-center mt-3">No Data Found</h1>
      )}
      <div className="card shadow card-container">
        <div className="card-header  ">
          <div className="row">
            <div className="col-md-6">
              <h1 className="header-card-information">
                <span>Branch Cashier</span>
              </h1>
            </div>
            <div className="col-md-6 w-100  d-flex justify-content-end">
              <div className="mt-auto">
                <CButton
                  color="danger"
                  variant="outline"
                  shape="square"
                  size="sm"
                >
                  <Link
                    to="/branch/branch-cashier-information/arhived-branch-cashier-information"
                    className="a-link-none"
                  >
                    <RiDeviceRecoverLine size="15" />
                  </Link>
                </CButton>
                <CButton
                  className="ml-1 "
                  color="info"
                  shape="square"
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  disabled={addingLoading}
                >
                  {addingLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Wait...
                    </>
                  ) : (
                    <>
                      {" "}
                      <RiFileAddLine size="15" />
                    </>
                  )}
                </CButton>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <CDataTable
            items={cashier}
            fields={CashierFields}
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
              name: (item) => (
                <td>
                  <div className="d-flex justify-content-center">
                    <div className="c-avatar  ">
                      <img
                        src={item.profile.url}
                        className="c-avatar-img"
                        alt="admin@bootstrapmaster.com"
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "100%",
                        }}
                      />
                      <span
                        className={`c-avatar-status bg-${getstatus(
                          item.status
                        )}`}
                      ></span>
                    </div>
                  </div>
                  <div className="brandnametable text-center">
                    <OverlayTrigger
                      key={"bottom"}
                      placement={"top"}
                      overlay={
                        <Tooltip id={`tooltip-bottom`}>
                          View Data Of {toCapitalized(item.name)}
                        </Tooltip>
                      }
                    >
                      <Link
                        to={`/branch/branch-cashier-information/${item._id}`}
                        className="a-link-none"
                      >
                        {item.name}
                      </Link>
                    </OverlayTrigger>
                  </div>
                  <div className="small text-muted text-center">
                    <span>Status</span> | {toCapitalized(item.status)}
                  </div>
                </td>
              ),
              action: (item, index) => (
                <td>
                  <div className="d-flex justify-content-center">
                    <CButton
                      color="danger"
                      shape="square"
                      size="sm"
                      onClick={() => handleDelete(item)}
                    >
                      <IoTrash size="15" />
                    </CButton>

                    <CButton
                      color="info"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="ml-1"
                      onClick={() => handleEdit(item)}
                    >
                      <IoPencilOutline size="15" />
                    </CButton>
                  </div>
                </td>
              ),
            }}
          />
        </div>
        <AddBranchCashier
          addingLoading={addingLoading}
          setAddingLoading={setAddingLoading}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
        <UpdateCashierInformation
          updateModal={updateModal}
          setUpdateModal={setUpdateModal}
          credentials={credentials}
          setCredential={setCredential}
          cashierInformation={cashierInformation}
          setcashierInformation={setcashierInformation}
          loadingUpdate={loadingUpdate}
          setLoadingUpdate={setLoadingUpdate}
        />
      </div>
    </>
  );
};

export default CashierInformation;
