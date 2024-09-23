import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { BsEyeFill, BsCheckCircle, BsFileEarmarkPdf } from "react-icons/bs";
import {
  Table,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Form,
  FormGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import useLoadingHandler from "../../../hooks/useLoadingHandler";

const ProgressReports = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewComments, setReviewComments] = useState("");
  const [reviewerStatus, setReviewerStatus] = useState("");
  const { loadingStates, handleLoading } = useLoadingHandler();

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
    setReviewerStatus("");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    await handleLoading("handleReviewSubmit", async () => {
      const response = await fetchWithAuth(
        `/api/grants/progress-reports/${selectedReport.id}/review/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_comments: reviewComments,
            reviewer_status: reviewerStatus,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Report reviewed successfully!");
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
        toast.error("Error reviewing report.");
      }
    });
  };

  const exportReportToPDF = (report) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;

    // Add a title
    pdf.setFontSize(20);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Progress Report", pageWidth / 2, 20, { align: "center" });

    // Add organization details
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Organization: ${report.grant_account?.account_holder?.organisation_name}`,
      20,
      40
    );
    pdf.text(`Grant: ${report.grant_account?.grant?.name}`, 20, 50);

    // Add report details
    pdf.setFontSize(12);
    const details = [
      ["Report Date", new Date(report.report_date).toLocaleDateString()],
      ["Completed KPIs", report.completed_pkis.join(", ")],
      ["Progress", `${report.progress_percentage}%`],
      ["Status", report.status],
      ["Review Status", report.review_status],
      ["Review Comments", report.review_comments],
    ];

    pdf.autoTable({
      startY: 60,
      head: [["Report Details", "Value"]],
      body: details,
      theme: "grid",
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Add a footer
    const pageCount = pdf.internal.getNumberOfPages();
    pdf.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pdf.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    pdf.save(`ProgressReport_${report.grant_account?.account_holder?.organisation_name} - ${report.grant_account?.grant?.name}.pdf`);
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
            <th>Export</th>
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
                <td>
                  <Button
                    variant="outline-primary"
                    className="ms-2"
                    title="Export Report"
                    onClick={() => exportReportToPDF(report)}
                  >
                    <BsFileEarmarkPdf />
                  </Button>
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
          <FormGroup>
            <Form.Label>Review Status</Form.Label>
            <Form.Control
              as="select"
              value={reviewerStatus}
              onChange={(e) => setReviewerStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Form.Control>
          </FormGroup>
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
          <Button variant="primary" onClick={handleReviewSubmit} disabled={loadingStates.handleReviewSubmit}>
            {loadingStates.handleReviewSubmit ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProgressReports;
