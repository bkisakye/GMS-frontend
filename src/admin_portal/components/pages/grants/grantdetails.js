import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const modalHeaderStyle = {
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
};

const modalTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: 500,
};

const modalBodyStyle = {
  padding: "2rem",
  backgroundColor: "#ffffff",
};

const detailItemStyle = {
  fontSize: "1rem",
  marginBottom: "1rem",
  lineHeight: "1.5",
};

const modalFooterStyle = {
  backgroundColor: "#f8f9fa",
  borderTop: "1px solid #dee2e6",
};

const buttonStyle = {
  backgroundColor: "#6c757d",
  border: "none",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "1rem",
};

const buttonHoverStyle = {
  backgroundColor: "#5a6268",
};

const GrantDetailsModal = ({ isOpen, onClose, grant }) => {
  if (!isOpen || !grant) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="lg"
      className="modal-custom"
    >
      <Modal.Header closeButton style={modalHeaderStyle}>
        <Modal.Title style={modalTitleStyle}>Grant Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle}>
        <div className="mb-4">
          <p style={detailItemStyle}>
            <strong>Name:</strong> {grant.name}
          </p>
          <p style={detailItemStyle}>
            <strong>Description:</strong> {grant.description}
          </p>
          <p style={detailItemStyle}>
            <strong>Start Date:</strong> {grant.start_date}
          </p>
          <p style={detailItemStyle}>
            <strong>End Date:</strong> {grant.end_date}
          </p>
          <p style={detailItemStyle}>
            <strong>Amount:</strong> {grant.amount}
          </p>
          <p style={detailItemStyle}>
            <strong>Status:</strong> {grant.is_open ? "Active" : "Inactive"}
          </p>
          <p style={detailItemStyle}>
            <strong>Category:</strong> {grant.category_detail.name}
          </p>
          <p style={detailItemStyle}>
            <strong>Donor:</strong> {grant.donor_detail.name}
          </p>
          <p style={detailItemStyle}>
            <strong>Districts:</strong>{" "}
            {grant.district_detail.length > 0
              ? grant.district_detail
                  .map((district) => district.name)
                  .join(", ")
              : "No districts listed"}
          </p>
          <p style={detailItemStyle}>
            <strong>Application Deadline:</strong> {grant.application_deadline}
          </p>
          <p style={detailItemStyle}>
            <strong>Eligibility Details:</strong>{" "}
            {grant.eligibility_details || "No eligibility details provided"}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer style={modalFooterStyle}>
      </Modal.Footer>
    </Modal>
  );
};

export default GrantDetailsModal;
