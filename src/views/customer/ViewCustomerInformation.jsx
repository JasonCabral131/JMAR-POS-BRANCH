import React from "react";
import { Modal } from "react-bootstrap";
export const ViewCustomerinformation = ({
  viewModal,
  setViewModal,
  customerInfo,
  setCustomerInfo,
}) => {
  return (
    <Modal show={viewModal} onHide={() => setViewModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {customerInfo ? <p>Modal body text goes here.</p> : null}
      </Modal.Body>
    </Modal>
  );
};
