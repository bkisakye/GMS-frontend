import React from "react";
import { Modal, Button } from "react-bootstrap";

const SubgranteeModal = ({ show, onHide, subgrantee }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{subgrantee.organizationName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <h6>Organization Details</h6>
            <p>
              <strong>Address:</strong> {subgrantee.organizationAddress}
            </p>
            <p>
              <strong>District:</strong> {subgrantee.district}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {subgrantee.organizationPhoneNumber}
            </p>
          </div>
          <div className="col-md-6">
            <h6>Contact Information</h6>
            <p>
              <strong>Contact Person:</strong> {subgrantee.contactPerson}
            </p>
            <p>
              <strong>Secondary Contact:</strong> {subgrantee.secondaryContact}
            </p>
            <p>
              <strong>Category:</strong> {subgrantee.category}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubgranteeModal;
