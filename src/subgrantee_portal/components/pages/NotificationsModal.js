import React from "react";
import { Modal, Button } from "react-bootstrap";

const NotificationModal = ({ show, onHide, notificationDetails }) => {
  if (!notificationDetails) return null;

  const renderContent = () => {
    switch (notificationDetails.notification_category) {
      case "new_grant":
        return (
          <>
            <h5>Grant Details</h5>
            <p>Title: {notificationDetails.grant.title}</p>
            <p>Description: {notificationDetails.grant.description}</p>
            {/* Add other relevant grant details here */}
          </>
        );
      case "grant_review":
        return (
          <>
            <h5>Application Review</h5>
            <p>Score: {notificationDetails.application.score}</p>
            <p>Comments: {notificationDetails.application.comments}</p>
            {/* Add other relevant review details here */}
          </>
        );
      // Add more cases for different notification categories
      default:
        return <p>Unknown notification category.</p>;
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Notification Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderContent()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
