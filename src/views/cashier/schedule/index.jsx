import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CDataTable, CButton } from "@coreui/react";
import { toCapitalized } from "src/reusable";
import { IoTrash, IoPencilOutline } from "react-icons/io5";
import Authentication from "src/reusable/Authentication";
import {
  checkAuthenicatingPassword,
  removeCashierBranch,
  UpdateSchedule,
} from "src/redux/action";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import FrontID from "src/assets/icons/BackId.jpg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { DraftJsToolBar } from "src/reusable/EditorStateComponent";
const fields = [
  { key: "index", label: "Index" },
  { key: "name", label: "Name" },
  { key: "phone", label: `Phone` },
  { key: "email", label: `email` },
  { key: "date", label: `Registered` },
  { key: "shiftingSchedule", label: `Schedule` },
  {
    key: "action",
    label: "Action",
  },
];
const ScheduleCashier = (props) => {
  const dispatch = useDispatch();
  const { cashier, loading } = useSelector((state) => state.cashier);
  const [authenticationModal, setAuthenticationModal] = useState(false);
  const [toOpen, setToOpen] = useState("");
  const [itemInformation, setItemInformation] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [choosing, setChoosing] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
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
  const [editorState, setEditorState] = useState(null);
  const handleEditorState = useCallback(() => {
    const html = "<span></span>";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [setEditorState]);
  useEffect(() => {
    handleEditorState();
    // eslint-disable-next-line
  }, []);
  const handleDelete = (item) => {
    setToOpen("delete");
    setItemInformation(item);
    setAuthenticationModal(true);
  };
  const handleEdit = (item) => {
    setToOpen("update");
    setAuthenticationModal(true);
    setItemInformation(item);
  };
  const handleSubmitAuth = async (password) => {
    if (password === "") {
      Swal.fire({
        icon: "warning",
        text: "Password required!",
      });
      return;
    }
    const res = await dispatch(checkAuthenicatingPassword({ password }));
    if (res) {
      setAuthenticationModal(false);
      if (toOpen === "delete") {
        submitDelete();
      } else {
        setShowUpdate(true);
      }
    }
    return res;
  };
  const submitDelete = () => {
    Swal.fire({
      icon: "question",
      title: "Are You Sure?",
      text: "You wont revert this action ",
      showCancelButton: true,
      confirmButtonText: "Yes, Proceed it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (itemInformation) {
          await dispatch(removeCashierBranch({ _id: itemInformation._id }));
          setItemInformation(null);
        }
      } else {
        setItemInformation(null);
      }
    });
  };
  const submitUpdate = () => {
    if (itemInformation) {
      if (choosing === "") {
        Swal.fire({
          icon: "warning",
          text: "Choose Schedule ",
        });
        return;
      }
      const message = editorState
        ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
        : "<span></span>";
      if (message.trim() === "<span></span>" || message.trim() === "<p></p>") {
        Swal.fire({
          icon: "warning",
          text: "Pls indicate a short message",
        });
        return;
      }
      Swal.fire({
        icon: "question",
        title: "Are You Sure?",
        text: "You want to Update This Schedule",
        showCancelButton: true,
        confirmButtonText: "Yes, Proceed it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoadingUpdate(true);
          const res = await dispatch(
            UpdateSchedule({
              _id: itemInformation._id,
              message,
              schedule: choosing,
            })
          );
          if (res) {
            setChoosing("");
            setShowUpdate(false);
            handleEditorState();
            setLoadingUpdate(false);
            return;
          }
          setLoadingUpdate(false);
          setShowUpdate(false);
          return;
        }
      });

      console.log(message);
    }
  };
  return (
    <div className="card">
      <div className="card-header">
        <h1 className="header-card-information">
          <span>Branch Cashier Scheduling</span>
        </h1>
      </div>
      <div className="card-body">
        <CDataTable
          items={cashier}
          fields={fields}
          columnFilter={false}
          tableFilterValue={null}
          tableFilter={{ placeholder: "search information..." }}
          itemsPerPageSelect={false}
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
                      className={`c-avatar-status bg-${getstatus(item.status)}`}
                    ></span>
                  </div>
                </div>
                <div className="brandnametable text-center">
                  <p> {item.name}</p>
                </div>
                <div className="small text-muted text-center">
                  <span>Status</span> | {toCapitalized(item.status)}
                </div>
              </td>
            ),
            action: (item, index) => (
              <td>
                <div className="d-flex justify-content-center">
                  {item.shiftingSchedule === "not-assigned" ? (
                    <CButton
                      color="danger"
                      shape="square"
                      size="sm"
                      onClick={() => handleDelete(item)}
                    >
                      <IoTrash size="20" />
                    </CButton>
                  ) : null}

                  <CButton
                    color="info"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="ml-1"
                    onClick={() => handleEdit(item)}
                  >
                    <IoPencilOutline size="20" />
                  </CButton>
                </div>
              </td>
            ),
          }}
        />
      </div>
      <Authentication
        authenticationModal={authenticationModal}
        setAuthenticationModal={setAuthenticationModal}
        handleSubmitAuth={handleSubmitAuth}
      />
      <Modal show={showUpdate} size="lg">
        <Modal.Body>
          <h1 className="header-card-information mb-3">
            <span>Shifting Schedule</span>
          </h1>
          {itemInformation ? (
            <div className="w-100">
              <div
                className="personal-container"
                style={{
                  display: "flex",
                  position: "relative",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={itemInformation ? itemInformation.profile.url : FrontID}
                  alt="profile-pic"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "100%",
                  }}
                />
                <div className="name-container">
                  <h1>
                    <span>{toCapitalized(itemInformation.name)}</span>
                  </h1>
                  <h2>
                    <span>
                      {toCapitalized(itemInformation.address.fullAddress)}
                    </span>
                  </h2>
                </div>
              </div>
              <div className=" percent-container mt-1">
                <label className="label-name text-left d-block">Schedule</label>
                <select
                  name="civilStatus"
                  onChange={(e) => setChoosing(e.target.value)}
                >
                  {choosing ? null : <option value="">Choosing...</option>}
                  <option value="morning">
                    Morning Shift &nbsp;&nbsp; (7:000 AM to 5:00 PM)
                  </option>
                  <option value="night">
                    Night Shift &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (5:00
                    PM to 3:00 AM)
                  </option>
                </select>
              </div>
              <hr />
              <label className="label-name">Description </label>
              <Editor
                placeholder={`Enter Your Response Here`}
                editorState={editorState}
                onEditorStateChange={(content) => setEditorState(content)}
                style={{ padding: "5px" }}
                toolbar={DraftJsToolBar}
              />
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <CButton
            color="secondary"
            onClick={() => {
              setChoosing("");
              setShowUpdate(false);
              handleEditorState();
            }}
            disabled={loadingUpdate}
          >
            Close
          </CButton>
          <CButton
            size="lg"
            color="info"
            variant="outline"
            onClick={submitUpdate}
            disabled={loadingUpdate}
          >
            {loadingUpdate ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                wait updating...
              </>
            ) : (
              "Update"
            )}
          </CButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ScheduleCashier;
