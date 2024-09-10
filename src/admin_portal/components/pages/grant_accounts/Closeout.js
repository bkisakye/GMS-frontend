import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { fetchWithAuth } from "../../../../utils/helpers";
import { toast } from "react-toastify";

const Closeout = ({ showModal, handleClose }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    const response = await fetchWithAuth(
      `/api/grants/grant-closeout-request/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason,
          reviewed_by: userId,
          status: "approved",
          reviewed: true,
          grant_account: 1, // Add the correct grant_account ID here
        }),
      }
    );

    if (!response.ok) {
      // Only read the response body if the response is not OK
      const errorData = await response.json();
      toast.error(
        errorData.detail ||
          "An error occurred while processing the closeout request."
      );
      throw new Error(errorData.detail || "Unexpected error");
    }

    toast.success("Closeout request submitted successfully!");
    handleClose(); // Close the modal on successful submission
  } catch (error) {
    console.error("Error handling closeout request:", error);
    toast.error("An error occurred while processing the closeout request.");
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Grant Closeout Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Reason for Closeout</Form.Label>
            <Form.Control
              as="select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select Reason</option>
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
              <option value="suspended">Suspended</option>
            </Form.Control>
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Closeout;
