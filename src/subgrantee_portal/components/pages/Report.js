import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { BsBarChartFill } from "react-icons/bs"; // For progress report
import { FaFileInvoiceDollar } from "react-icons/fa"; // For financial report
import {
  Spinner,
  Table,
  Button,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";

const Report = () => {
  const [grantAccount, setGrantAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false); // Progress modal state
  const [showFinancialModal, setShowFinancialModal] = useState(false); // Financial modal state
  const [progressReport, setProgressReport] = useState(null); // Progress report data
  const [financialReport, setFinancialReport] = useState(null); // Financial report data
  const [modalLoading, setModalLoading] = useState(false); // Loading state for both modals
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    fetchGrantAccounts();
  }, [userId]);

  const fetchGrantAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/grants/grant-account/${userId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setGrantAccount(data);
        setKpis(
          data.grant?.kpis
            ? data.grant.kpis.split(",").map((kpi) => kpi.trim())
            : []
        );
      } else {
        console.error("Failed to fetch grant accounts");
      }
    } catch (error) {
      console.error("Error fetching grant accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchProgressReport = async (grantAccountId) => {
    setModalLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/grants/most-recent-progress-report/${grantAccountId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setProgressReport(data);
        setShowProgressModal(true); // Open progress modal
      } else {
        console.error("Failed to fetch progress report");
      }
    } catch (error) {
      console.error("Error fetching progress report:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const fetchFinancialReport = async (grantAccountId) => {
    setModalLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/grants/most-recent-financial-report/${grantAccountId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setFinancialReport(data);
        setShowFinancialModal(true); // Open financial modal
      } else {
        console.error("Failed to fetch financial report");
      }
    } catch (error) {
      console.error("Error fetching financial report:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleProgressReportClick = (grantAccountId) => {
    fetchProgressReport(grantAccountId);
  };

  const handleFinancialReportClick = (grantAccountId) => {
    fetchFinancialReport(grantAccountId);
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    setProgressReport(null);
  };

  const handleCloseFinancialModal = () => {
    setShowFinancialModal(false);
    setFinancialReport(null);
  };

  const filteredAccount = grantAccount?.grant?.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Grant Name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Grant Name</th>
            <th>Reporting Time</th>
            <th>Total Amount</th>
            <th>Current Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccount ? (
            <tr>
              <td>{grantAccount.grant?.name}</td>
              <td>{grantAccount.grant?.reporting_time}</td>
              <td>{grantAccount.budget_total?.budget_total}</td>
              <td>{grantAccount.current_amount}</td>
              <td>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Progress Report</Tooltip>}
                >
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => handleProgressReportClick(grantAccount.id)} // Pass the grantAccountId to the function
                  >
                    <BsBarChartFill />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Financial Report</Tooltip>}
                >
                  <Button
                    variant="success"
                    onClick={() => handleFinancialReportClick(grantAccount.id)} // Pass the grantAccountId to the function
                  >
                    <FaFileInvoiceDollar />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No matching grant account found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for displaying progress report */}
      <Modal show={showProgressModal} onHide={handleCloseProgressModal}>
        <Modal.Header closeButton>
          <Modal.Title>Progress Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : progressReport ? (
            <div>
              <p>
                <strong>Report Date:</strong>{" "}
                {new Date(progressReport.report_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Completed KPIs:</strong>{" "}
                {progressReport.completed_pkis.join(", ")}
              </p>
              <p>
                <strong>Status:</strong> {progressReport.status}
              </p>
              <p>
                <strong>Progress Percentage:</strong>{" "}
                {progressReport.progress_percentage}%
              </p>
              <p>
                <strong>Review Status:</strong> {progressReport.review_status}
              </p>
              <p>
                <strong>Review Comments:</strong>{" "}
                {progressReport.review_comments}
              </p>
              <p>
                <strong>Reviewer:</strong> {progressReport.reviewer}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(progressReport.last_updated).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p>No progress report found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProgressModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for displaying financial report */}
      <Modal show={showFinancialModal} onHide={handleCloseFinancialModal}>
        <Modal.Header closeButton>
          <Modal.Title>Financial Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : financialReport ? (
            <div>
              <p>
                <strong>Report Date:</strong>{" "}
                {new Date(financialReport.report_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Expenditure:</strong>{" "}
                {financialReport.total_expenditure}
              </p>
              <p>
                <strong>Remaining Balance:</strong>{" "}
                {financialReport.remaining_balance}
              </p>
              <p>
                <strong>Status:</strong> {financialReport.status}
              </p>
              {/* Add other financial report fields here */}
            </div>
          ) : (
            <p>No financial report found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFinancialModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Report;
