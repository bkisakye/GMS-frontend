import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { BsEyeFill, BsCheckCircle } from "react-icons/bs";
import {
  Table,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Form,
} from "react-bootstrap";

const ProgressReports = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewComments, setReviewComments] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    fetchWithAuth(`/api/grants/progress-reports/`)
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) =>
        console.error("Error fetching progress reports:", error)
      );
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredReports = reports.filter((report) =>
    report.grant_account?.account_holder?.organisation_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleReviewClick = (report) => {
    setSelectedReport(report);
    setReviewComments("");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/progress-reports/${selectedReport.id}/review/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_comments: reviewComments,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShowReviewModal(false);
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === selectedReport.id
              ? {
                  ...report,
                  review_status: "reviewed", // Update the status directly
                  reviewer_name: data.reviewer, // Update with the actual reviewer if returned
                }
              : report
          )
        );
      } else {
        console.error("Error reviewing report:", response.statusText);
      }
    } catch (error) {
      console.error("Error reviewing report:", error);
    }
  };

  return (
    <div className="container mt-4">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Organization Name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Grant Account</th>
            <th>Report Date</th>
            <th>Completed KPIs</th>
            <th>Progress (%)</th>
            <th>Status</th>
            <th>Review Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <tr key={report.id}>
                <td>
                  {report.grant_account?.account_holder?.organisation_name} -{" "}
                  {report.grant_account?.grant?.name}
                </td>
                <td>{new Date(report.report_date).toLocaleDateString()}</td>
                <td>{report.completed_pkis.join(", ")}</td>
                <td>{report.progress_percentage}%</td>
                <td>{report.status}</td>
                <td>{report.review_status}</td>
                <td>
                  {report.review_status === "pending" && (
                    <Button
                      variant="primary"
                      title="Review Report"
                      onClick={() => handleReviewClick(report)}
                    >
                      <BsEyeFill />
                    </Button>
                  )}
                  {report.review_status === "reviewed" && (
                    <BsCheckCircle color="green" />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No matching reports found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Review Progress Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Review Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReviewSubmit}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProgressReports;
