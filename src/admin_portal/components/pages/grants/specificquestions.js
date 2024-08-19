import React, { useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { Modal, Button, Form } from "react-bootstrap";

const QuestionModal = ({ isOpen, onClose, grantId }) => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [choices, setChoices] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchWithAuth("/api/grants/questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant: grantId,
          text: questionText,
          question_type: questionType,
          choices:
            questionType === "checkbox"
              ? choices.split(",").map((choice) => choice.trim())
              : null,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Question added successfully!");
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Specific Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Question Type:</Form.Label>
            <Form.Control
              as="select"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              required
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="checkbox">Checkbox</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Question Text:</Form.Label>
            <Form.Control
              as="textarea"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </Form.Group>
          {questionType === "checkbox" && (
            <Form.Group>
              <Form.Label>Choices (comma separated):</Form.Label>
              <Form.Control
                type="text"
                value={choices}
                onChange={(e) => setChoices(e.target.value)}
                placeholder="e.g. Option 1, Option 2"
              />
            </Form.Group>
          )}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default QuestionModal;
