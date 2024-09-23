import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import {
  BsEyeFill,
  BsCheckCircle,
  BsFileEarmarkPdf,
  BsFileEarmarkExcel,
} from "react-icons/bs";
import {
  Table,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Form,
  FormGroup,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import useLoadingHandler from "../../../hooks/useLoadingHandler";

const FinanceReport = () => {
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
    fetchWithAuth(`/api/grants/finance-reports/`)
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) =>
        console.error("Error fetching finance reports:", error)
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
        `/api/grants/finance-reports/${selectedReport.id}/review/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewer_status: reviewerStatus,
            review_comments: reviewComments,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Review submitted successfully!");
        setShowReviewModal(false);
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === selectedReport.id
              ? {
                ...report,
                review_status: "reviewed",
                reviewer_name: data.reviewer,
              }
              : report
          )
        );
      } else {
        console.error("Error submitting review:", response.statusText);
        toast.error("Error submitting review. Please try again.");
      }
    });
  };

  const exportToPDF = (report) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;

    // Add a title
    pdf.setFontSize(20);
    pdf.setTextColor(0, 102, 204);
    pdf.text("Finance Report", pageWidth / 2, 20, { align: "center" });

    // Add organization details
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Organization: ${report.grant_account?.account_holder?.organisation_name}`,
      20,
      40
    );
    pdf.text(`Grant: ${report.grant_account?.grant?.name}`, 20, 50);

    // Add financial details
    pdf.setFontSize(12);
    const details = [
      [`Report Date: ${new Date(report.report_date).toLocaleDateString()}`],
      [`Budget: $${report.grant_account?.budget_total?.budget_total || "N/A"}`],
      [
        `Total Allocations: $${
          report.report_data?.budget_summary?.total_allocated?.toFixed(2) ||
          "N/A"
        }`,
      ],
      [
        `Balance: $${
          report.report_data?.budget_summary?.remaining_amount?.toFixed(2) ||
          "N/A"
        }`,
      ],
      [
        `Status: ${
          report.report_data?.budget_summary?.is_over_budget
            ? "Over Budget"
            : "Within Budget"
        }`,
        ],
        [
          `Review Comments: ${report.review_comments || "N/A"}`,
      ],
    ];

    pdf.autoTable({
      startY: 60,
      head: [["Financial Details"]],
      body: details,
      theme: "grid",
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });


    pdf.save(
      `FinanceReport_${report.grant_account?.account_holder?.organisation_name} - ${report.grant_account.grant.name}.pdf`
    );
  };

  const exportToExcel = (report) => {
    // Prepare the data
    const data = [
      ["Finance Report"],
      ["Organization", report.grant_account?.account_holder?.organisation_name],
      ["Grant", report.grant_account?.grant?.name],
      ["Report Date", new Date(report.report_date).toLocaleDateString()],
      [
        "Budget",
        `$${report.grant_account?.budget_total?.budget_total || "N/A"}`,
      ],
      [
        "Total Allocations",
        `$${
          report.report_data?.budget_summary?.total_allocated?.toFixed(2) ||
          "N/A"
        }`,
      ],
      [
        "Balance",
        `$${
          report.report_data?.budget_summary?.remaining_amount?.toFixed(2) ||
          "N/A"
        }`,
      ],
      [
        "Status",
        report.report_data?.budget_summary?.is_over_budget
          ? "Over Budget"
          : "Within Budget",
      ],
      ["Review Comments", report.review_comments || "N/A"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1"; // first row
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true, color: { rgb: "FFFFFFFF" } },
        fill: { fgColor: { rgb: "FF0066CC" } },
      };
    }

    // Set column widths
    ws["!cols"] = [{ wch: 20 }, { wch: 30 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    XLSX.writeFile(
      wb,
      `FinanceReport-${report.grant_account?.account_holder?.organisation_name} - ${report.grant_account.grant.name}.xlsx`
    );
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
            <th>Budget</th>
            <th>Total Allocations</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Action</th>
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
                <td>
                  ${report.grant_account?.budget_total?.budget_total || "N/A"}
                </td>
                <td>
                  $
                  {report.report_data?.budget_summary?.total_allocated?.toFixed(
                    2
                  ) || "N/A"}
                </td>
                <td
                  className={
                    report.report_data?.budget_summary?.remaining_amount < 0
                      ? "text-danger"
                      : ""
                  }
                >
                  $
                  {report.report_data?.budget_summary?.remaining_amount?.toFixed(
                    2
                  ) || "N/A"}
                </td>
                <td>
                  <span
                    className={
                      report.report_data?.budget_summary?.is_over_budget
                        ? "badge bg-danger"
                        : "badge bg-success"
                    }
                  >
                    {report.report_data?.budget_summary?.is_over_budget
                      ? "Over Budget"
                      : "Within Budget"}
                  </span>
                </td>
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
                    onClick={() => exportToPDF(report)}
                    title="Export to PDF"
                  >
                    <BsFileEarmarkPdf />
                  </Button>{" "}
                  <Button
                    variant="outline-success"
                    onClick={() => exportToExcel(report)}
                    title="Export to Excel"
                  >
                    <BsFileEarmarkExcel />
                  </Button>{" "}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No matching reports found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Review Finance Report</Modal.Title>
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
            {loadingStates.handleReviewSubmit ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit Review"
            )
            }
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FinanceReport;
