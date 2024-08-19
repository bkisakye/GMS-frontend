import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const GrantModal = ({ grant, onClose }) => {
  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{grant.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Description:</strong> {grant.description}
        </p>
        <p>
          <strong>Category:</strong> {grant.category?.name}
        </p>
        <p>
          <strong>Donor:</strong> {grant.donor?.name || "Not specified"}
        </p>
        <p>
          <strong>Amount:</strong> ${grant.amount}
        </p>
        <p>
          <strong>Start Date:</strong> {grant.start_date}
        </p>
        <p>
          <strong>End Date:</strong> {grant.end_date}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GrantModal;
