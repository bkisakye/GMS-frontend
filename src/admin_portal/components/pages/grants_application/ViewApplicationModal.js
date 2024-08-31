import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Accordion,
  Card,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { fetchWithAuth } from "../../../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileAlt,
  faSpinner,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewApplicationModal = ({ isOpen, onClose, applicationId }) => {
  const [applicationData, setApplicationData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (applicationId) {
      Promise.all([
        fetchWithAuth(`/api/grants/grant-applications/${applicationId}/`),
        fetchWithAuth(
          `/api/grants/applications/${applicationId}/documents/list/`
        ),
      ])
        .then(([applicationResponse, documentsResponse]) => {
          if (!applicationResponse.ok || !documentsResponse.ok) {
            throw new Error("Network response was not ok.");
          }
          return Promise.all([
            applicationResponse.json(),
            documentsResponse.json(),
          ]);
        })
        .then(([applicationData, documentsData]) => {
          const grant_id = applicationData[0]?.grant?.id || null;
          const user_id = applicationData[0]?.subgrantee?.id || null;

          if (grant_id && user_id) {
            return fetchWithAuth(
              `/api/grants/transformed-data/?user_id=${user_id}&grant_id=${grant_id}`
            )
              .then((response) =>
                response.ok
                  ? response.json()
                  : Promise.reject("Failed to fetch transformed data.")
              )
              .then((transformedData) => {
                setApplicationData(transformedData[0] || {});
                setDocuments(documentsData.documents || []);
                setLoading(false);
              });
          } else {
            throw new Error("Grant ID or User ID is missing");
          }
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
            <Card.Header className="bg-primary text-white">
              <FontAwesomeIcon icon={faFileAlt} className="me-2" />
              {text}
            </Card.Header>
            <Card.Body>{answer}</Card.Body>
          </Card>
        );

      case "checkbox":
        return (
          <Card className="mb-3" key={text}>
            <Card.Header className="bg-primary text-white">
              <FontAwesomeIcon icon={faFileAlt} className="me-2" />
              {text}
            </Card.Header>
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
            <Card.Header className="bg-primary text-white">
              <FontAwesomeIcon icon={faFileAlt} className="me-2" />
              {text}
            </Card.Header>
            <Card.Body>{answer}</Card.Body>
          </Card>
        );

      case "number":
        return (
          <Card className="mb-3" key={text}>
            <Card.Header className="bg-primary text-white">
              <FontAwesomeIcon icon={faFileAlt} className="me-2" />
              {text}
            </Card.Header>
            <Card.Body>{answer}</Card.Body>
          </Card>
        );

      default:
        return null;
    }
  };

  const renderDocuments = () => {
    return (
      <Card className="mb-3">
        <Card.Header className="bg-secondary text-white">
          <FontAwesomeIcon icon={faFilePdf} className="me-2" />
          Associated Documents
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {documents.map((doc, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => setSelectedDocument(doc)}
              >
                {doc.documents.split("/").pop()}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  };

  const renderDocumentPreview = () => {
    if (!selectedDocument) return null;

    const fileName = selectedDocument.documents.split("/").pop();
    const fileExtension = fileName.split(".").pop().toLowerCase();

    // Construct the correct URL for the document
    const documentUrl = `http://localhost:8000${selectedDocument.documents}`;

    switch (fileExtension) {
      case "pdf":
      // return (
      //   <iframe
      //     src={documentUrl}
      //     title={fileName}
      //     width="100%"
      //     height="500px"
      //     style={{ border: "none" }}
      //   />
      // );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <div className="text-center">
            <p className="mb-3">Document: {fileName}</p>
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              Download {fileName}
            </a>
          </div>
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
      <Modal.Body ref={contentRef} className="bg-light p-4">
        {loading ? (
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {applicationData.transformed_data?.grant?.responses?.map(
              (question, index) => (
                <Accordion defaultActiveKey="0" key={index}>
                  <Card>{renderQuestion(question)}</Card>
                </Accordion>
              )
            )}
            {renderDocuments()}
            {selectedDocument && (
              <Card className="mt-3">
                <Card.Header className="bg-info text-white">
                  <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                  Document Preview
                </Card.Header>
                <Card.Body>{renderDocumentPreview()}</Card.Body>
              </Card>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={exportToPDF}>
          <FontAwesomeIcon icon={faFilePdf} className="me-2" />
          Export as PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewApplicationModal;
