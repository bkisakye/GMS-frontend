import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Accordion,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { fetchWithAuth } from "../../../../utils/helpers";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewApplicationModal = ({ isOpen, onClose, applicationId }) => {
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (applicationId) {
      fetchWithAuth(`/api/grants/grant-applications/${applicationId}/`)
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject("Network response was not ok.")
        )
        .then((data) => {
          // Log the IDs for debugging
          const grant_id = data[0]?.grant?.id || null;
          const user_id = data[0]?.subgrantee?.id || null;
          console.log("Fetched Grant ID:", grant_id);
          console.log("Fetched User ID:", user_id);

          // Fetch additional data if needed
          if (grant_id && user_id) {
            return fetchWithAuth(
              `/api/grants/transformed-data/?user_id=${user_id}&grant_id=${grant_id}`
            );
          } else {
            throw new Error("Grant ID or User ID is missing");
          }
        })
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject("Failed to fetch transformed data.")
        )
        .then((data) => {
          setApplicationData(data[0] || {});
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [applicationId]);

  const renderQuestion = (question) => {
    const { question_type, text, answer, choices } = question;

    switch (question_type) {
      case "text":
        return (
          <Card className="mb-3" key={text}>
            <Card.Header>{text}</Card.Header>
            <Card.Body>{answer}</Card.Body>
          </Card>
        );

      case "checkbox":
        return (
          <Card className="mb-3" key={text}>
            <Card.Header>{text}</Card.Header>
            <Card.Body>
              <ul>
                {choices &&
                  choices.map((choice, index) => (
                    <li key={index}>{choice.check}</li>
                  ))}
              </ul>
            </Card.Body>
          </Card>
        );

      case "radio":
        return (
          <Card className="mb-3" key={text}>
            <Card.Header>{text}</Card.Header>
            <Card.Body>{answer}</Card.Body>
          </Card>
        );

      case "number":
        return (
          <Card className="mb-3" key={text}>
            <Card.Header>{text}</Card.Header>
            <Card.Body>{answer}</Card.Body>
          </Card>
        );

      default:
        return null;
    }
  };

  const exportToPDF = () => {
    if (contentRef.current && applicationData) {
      const orgName = applicationData.user?.organisation_name || "Organization";
      const grantName = applicationData.grant?.name || "Grant";
      const filename = `${orgName}-${grantName}.pdf`;

      html2canvas(contentRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(filename);
      });
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Application Details</Modal.Title>
      </Modal.Header>
      <Modal.Body ref={contentRef}>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          applicationData.transformed_data?.grant?.responses?.map(
            (question, index) => (
              <Accordion defaultActiveKey="0" key={index}>
                <Card>{renderQuestion(question)}</Card>
              </Accordion>
            )
          )
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={exportToPDF}>
          Export as PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewApplicationModal;
