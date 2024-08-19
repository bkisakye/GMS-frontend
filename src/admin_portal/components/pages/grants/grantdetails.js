import React from "react";

const GrantDetailsModal = ({ isOpen, onClose, grant }) => {
  if (!isOpen || !grant) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <button onClick={onClose} style={modalStyles.closeButton}>
          X
        </button>
        <h2>Grant Details</h2>
        <p>
          <strong>Name:</strong> {grant.name}
        </p>
        <p>
          <strong>Description:</strong> {grant.description}
        </p>
        <p>
          <strong>Start Date:</strong> {grant.start_date}
        </p>
        <p>
          <strong>End Date:</strong> {grant.end_date}
        </p>
        <p>
          <strong>Amount:</strong> {grant.amount}
        </p>
        <div style={modalStyles.questionsSection}>
          <h3 style={modalStyles.questionsHeading}>Specific Questions</h3>
          <ul style={modalStyles.questionsList}>
            {grant.specific_questions.map((question) => (
              <li key={question.id} style={modalStyles.questionItem}>
                {question.text}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onClose} style={modalStyles.closeButton}>
          Close
        </button>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    position: "relative",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  questionsSection: {
    marginTop: "20px",
  },
  questionsHeading: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  questionsList: {
    listStyleType: "disc",
    paddingLeft: "20px",
  },
  questionItem: {
    marginBottom: "10px",
  },
};

export default GrantDetailsModal;
