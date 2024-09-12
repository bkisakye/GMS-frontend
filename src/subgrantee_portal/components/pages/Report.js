import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { BsBarChartFill } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa";
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
import { toast } from "react-toastify";

const Report = () => {
  const [grantAccounts, setGrantAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [progressReport, setProgressReport] = useState(null);
  const [financialReport, setFinancialReport] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
    const totalAllocated =
      financialReport?.budget_summary?.total_allocated || 0;
    const remainingAmount =
      financialReport?.budget_summary?.remaining_amount || 0;
    const totalBudget = totalAllocated + remainingAmount;
    const expenditurePercentage = (totalAllocated / totalBudget) * 100;
    const remainingPercentage = (remainingAmount / totalBudget) * 100;
    const statusClass = financialReport?.budget_summary?.is_over_budget
      ? "danger"
      : "success";
    const statusText = financialReport?.budget_summary?.is_over_budget
      ? "Over Budget"
      : "On Budget";


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
        console.log(data); // Debugging log
        setGrantAccounts(data);
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
        setShowProgressModal(true);
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
        setShowFinancialModal(true);
      } else {
        console.error("Failed to fetch financial report");
      }
    } catch (error) {
      console.error("Error fetching financial report:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleProgressReportClick = (account) => {
    setSelectedAccount(account);
    fetchProgressReport(account.id);
  };

  const handleFinancialReportClick = (account) => {
    setSelectedAccount(account);
    fetchFinancialReport(account.id);
  };

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    setProgressReport(null);
  };

  const handleCloseFinancialModal = () => {
    setShowFinancialModal(false);
    setFinancialReport(null);
  };

  const filteredAccounts = grantAccounts.filter((account) =>
    account.grant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td>{account.grant?.name}</td>
                <td>{account.grant?.reporting_time}</td>
                <td>{account.budget_total?.budget_total}</td>
                <td>{account.current_amount}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Progress Report</Tooltip>}
                  >
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleProgressReportClick(account)}
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
                      onClick={() => handleFinancialReportClick(account)}
                    >
                      <FaFileInvoiceDollar />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No matching grant accounts found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal
        show={showProgressModal}
        onHide={handleCloseProgressModal}
        centered
        size="lg"
        className="progress-report-modal"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-bar-chart-fill me-2"></i>
            Progress Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {modalLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <Spinner
                animation="border"
                role="status"
                variant="primary"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : progressReport ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <tbody>
                  <tr>
                    <th>Report Date</th>
                    <td>
                      {new Date(
                        progressReport.report_date
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Completed KPIs</th>
                    <td>
                      {progressReport.completed_pkis?.join(", ") || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span
                        className={`badge bg-${
                          progressReport.status === "Completed"
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {progressReport.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Progress Percentage</th>
                    <td>
                      <div className="progress" style={{ height: "20px" }}>
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{
                            width: `${progressReport.progress_percentage}%`,
                          }}
                          aria-valuenow={progressReport.progress_percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {progressReport.progress_percentage}%
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Review Status</th>
                    <td>
                      <span
                        className={`badge bg-${
                          progressReport.review_status === "Approved"
                            ? "success"
                            : "info"
                        }`}
                      >
                        {progressReport.review_status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Review Comments</th>
                    <td>
                      {progressReport.review_comments || "No comments provided"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>No progress report available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProgressModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showFinancialModal}
        onHide={handleCloseFinancialModal}
        centered
        size="lg"
        className="financial-report-modal"
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="bi bi-cash-coin me-2"></i>
            Financial Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {modalLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <Spinner
                animation="border"
                role="status"
                variant="success"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : financialReport ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <tbody>
                  <tr>
                    <th>Report Date</th>
                    <td>
                      {new Date(
                        financialReport.report_date
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className={`badge bg-${statusClass}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Total Expenditure</th>
                    <td className="fs-4">
                      ${financialReport.budget_summary?.total_allocated}
                    </td>
                  </tr>
                  <tr>
                    <th>Remaining Balance</th>
                    <td className="fs-4">
                      ${financialReport.budget_summary?.remaining_amount}
                    </td>
                  </tr>
                  <tr>
                    <th>Budget Overview</th>
                    <td>
                      <div className="progress" style={{ height: "25px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${expenditurePercentage}%` }}
                          aria-valuenow={expenditurePercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          Expenditure
                        </div>
                        <div
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: `${remainingPercentage}%` }}
                          aria-valuenow={remainingPercentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          Remaining
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="alert alert-info d-flex align-items-center"
              role="alert"
            >
              <i className="bi bi-info-circle-fill me-2"></i>
              No financial report found.
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Report;
