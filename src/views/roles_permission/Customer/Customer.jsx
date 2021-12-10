import { CDataTable, CButton } from "@coreui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  checkAuthenicatingPassword,
  getAllCustomer,
  updateStatusPermissionOfCustomer,
} from "src/redux/action";
import { AllCustomerFields, getstatus, toCapitalized } from "src/reusable";
import { SiWebauthn } from "react-icons/si";
import FrontID from "src/assets/icons/BackId.jpg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { DraftJsToolBar } from "src/reusable/EditorStateComponent";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import Authentication from "src/reusable/Authentication";
export const CustomerRolesAndPermission = (props) => {
  const { allCustomer, loading } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [itemInformation, setItem] = useState(null);
  const [choosing, setChoosing] = useState("");
  const [authenticationModal, setAuthenticationModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
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
    dispatch(getAllCustomer());
    handleEditorState();
    // eslint-disable-next-line
  }, []);
  const handleShowModal = (item) => {
    setAuthenticationModal(true);

    setItem(item);
  };
  const handleSubmit = () => {
    if (choosing === "") {
      Swal.fire({
        icon: "warning",
        text: "Choose Status ",
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
          updateStatusPermissionOfCustomer({
            customer: itemInformation._id,
            message,
            status: choosing,
          })
        );
        if (res) {
          setChoosing("");
          setShowModal(false);
          handleEditorState();
          setLoadingUpdate(false);
          return;
        }
        setLoadingUpdate(false);
        setShowModal(false);
        return;
      }
    });
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
      setShowModal(true);
    }
    return res;
  };
  return (
    <div className="w-100">
      <Authentication
        authenticationModal={authenticationModal}
        setAuthenticationModal={setAuthenticationModal}
        handleSubmitAuth={handleSubmitAuth}
      />
      <h2 className="h1-status">Status Permission</h2>
      <CDataTable
        items={allCustomer}
        fields={AllCustomerFields}
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
                <SiWebauthn
                  size="35"
                  className="hover"
                  onClick={() => handleShowModal(item)}
                />
              </div>
            </td>
          ),
        }}
      />
      <Modal show={showModal} size="lg">
        <Modal.Body>
          {itemInformation ? (
            <div className="fluid-container">
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
                <label className="label-name text-left d-block">Status</label>
                <select
                  name="civilStatus"
                  onChange={(e) => setChoosing(e.target.value)}
                >
                  {choosing ? null : <option value="">Choosing...</option>}
                  <option value="active">active</option>
                  <option value="banned">banned</option>
                </select>
              </div>
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
            onClick={() => setShowModal(false)}
            disabled={loadingUpdate}
          >
            Close
          </CButton>
          <CButton
            color="info"
            variant="outline"
            disabled={loadingUpdate}
            onClick={handleSubmit}
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
