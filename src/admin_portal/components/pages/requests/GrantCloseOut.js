import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { FaRegEye, FaRegCheckCircle } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsClipboard2 } from "react-icons/bs";
import { format } from "date-fns";

const GrantCloseOut = () => {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewData, setReviewData] = useState({
    comments: "",
    status: "",
    reviewer: "",
  });
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [financialReport, setFinancialReport] = useState(null);
  const [progressReport, setProgressReport] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchWithAuth("/api/grants/all-requests/");
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          console.error(
            "Error fetching grant closeout requests:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching grant closeout requests:", error);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      const grantAccountId = selectedRequest.grant_closeout?.grant_account?.id;
      if (grantAccountId) {
        fetchFinancialReport(grantAccountId);
        fetchProgressReport(grantAccountId);
      }
    }
  }, [selectedRequest]);

  const fetchFinancialReport = async (grantAccountId) => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/most-recent-financial-report/${grantAccountId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setFinancialReport(data);
      } else {
        console.error("Error fetching financial report:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching financial report:", error);
    }
  };

  const fetchProgressReport = async (grantAccountId) => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/most-recent-progress-report/${grantAccountId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setProgressReport(data);
      } else {
        console.error("Error fetching progress report:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching progress report:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getFilteredRequests = () => {
    const query = searchQuery.toLowerCase();
    return requests.filter((request) =>
      request.request_type.toLowerCase().includes(query)
    );
  };

  const getAccountHolderInfo = (request) => {
    if (request.grant_closeout && request.grant_closeout.initiated_by) {
      return request.grant_closeout.initiated_by;
    } else if (request.modifications && request.modifications.requested_by) {
      return request.modifications.requested_by;
    }
    return null;
  };

  const getGrantInfo = (request) => {
    if (request.grant_closeout && request.grant_closeout.grant_account?.grant) {
      return request.grant_closeout.grant_account.grant;
    } else if (
      request.modifications &&
      request.modifications.grant_account?.grant
    ) {
      return request.modifications.grant_account.grant;
    }
    return null;
  };

  const getStatus = (request) => {
    if (request.grant_closeout && request.grant_closeout.status) {
      return request.grant_closeout.status;
    } else if (request.modifications && request.modifications.status) {
      return request.modifications.status;
    }
    return null;
  };

  const getProgressPercentage = (request) => {
    if (request.grant_closeout && request.grant_closeout.completed_kpis) {
      return request.grant_closeout.completed_kpis.progress_percentage || "N/A";
    }
    return "N/A";
  };

  const getAchievements = (request) => {
    if (
      request.grant_closeout &&
      typeof request.grant_closeout.achievements === "string"
    ) {
      return request.grant_closeout.achievements || "N/A";
    }
    return "N/A";
  };

  const getBestPractices = (request) => {
    if (
      request.grant_closeout &&
      typeof request.grant_closeout.best_practices === "string"
    ) {
      return request.grant_closeout.best_practices || "N/A";
    }
    return "N/A";
  };

  const getLessonsLearned = (request) => {
    if (
      request.grant_closeout &&
      typeof request.grant_closeout.lessons_learnt === "string"
    ) {
      return request.grant_closeout.lessons_learnt || "N/A";
    }
    return "N/A";
  };

  const getModificationDetails = (request) => {
    if (request.modifications) {
      return (
        <div>
          <p>
            <strong>Requested By:</strong>{" "}
            {request.modifications.requested_by.email || "N/A"}
          </p>
          <p>
            <strong>Requested Date:</strong>{" "}
            {new Date(
              request.modifications.requested_date
            ).toLocaleDateString() || "N/A"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {request.modifications.description || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {request.modifications.status || "N/A"}
          </p>
          <p>
            <strong>Reviewed By:</strong>{" "}
            {request.modifications.reviewed_by
              ? request.modifications.reviewed_by.email
              : "N/A"}
          </p>
          <p>
            <strong>Reviewed Date:</strong>{" "}
            {request.modifications.reviewed_date
              ? new Date(
                  request.modifications.reviewed_date
                ).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Comments:</strong> {request.modifications.comments || "N/A"}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleReviewChange = (event) => {
    setReviewData({
      ...reviewData,
      [event.target.name]: event.target.value,
    });
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/closeouts/${selectedRequest.grant_closeout.id}/reviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );
      if (response.ok) {
        alert("Review submitted successfully!");
        setShowReviewModal(false);
        console.log("Review Data:", reviewData);
      } else {
        console.error("Error submitting review:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleShowReportsModal = () => {
    if (selectedRequest) {
      const grantAccountId = selectedRequest.grant_closeout?.grant_account?.id;
      if (grantAccountId) {
        fetchFinancialReport(grantAccountId);
        fetchProgressReport(grantAccountId);
        setShowReportsModal(true);
      }
    }
  };

  const filteredRequests = getFilteredRequests();

  const shouldHideAdditionalFields = (request) => {
    const reason = request.grant_closeout?.reason;
    return reason === "terminated" || reason === "suspended";
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Grant Closeout Requests</h1>
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by request type"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-3"
        />
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Request Type</th>
                  <th>Account Holder</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.request_type}</td>
                    <td>{getAccountHolderInfo(request)?.email || "N/A"}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsModal(true);
                        }}
                      >
                        <FaRegEye />
                      </Button>{" "}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          handleShowReportsModal();
                        }}
                      >
                        <BsClipboard2 />
                      </Button>{" "}
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowReviewModal(true);
                        }}
                      >
                        <FaRegCheckCircle />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <p>
                <strong>Request Type:</strong>{" "}
                {selectedRequest.request_type || "N/A"}
              </p>
              <p>
                <strong>Account Holder:</strong>{" "}
                {getAccountHolderInfo(selectedRequest)?.email || "N/A"}
              </p>
              <p>
                <strong>Grant Info:</strong>{" "}
                {getGrantInfo(selectedRequest)
                  ? getGrantInfo(selectedRequest).name || "N/A"
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {getStatus(selectedRequest) || "N/A"}
              </p>
              <p>
                <strong>Progress:</strong>{" "}
                {getProgressPercentage(selectedRequest)}
              </p>
              <p>
                <strong>Achievements:</strong>{" "}
                {getAchievements(selectedRequest)}
              </p>
              <p>
                <strong>Best Practices:</strong>{" "}
                {getBestPractices(selectedRequest)}
              </p>
              <p>
                <strong>Lessons Learned:</strong>{" "}
                {getLessonsLearned(selectedRequest)}
              </p>
              {shouldHideAdditionalFields(selectedRequest) && (
                <div>
                  <h5>Modification Details:</h5>
                  {getModificationDetails(selectedRequest)}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      {/* Review Modal */}
      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Submit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comments"
                value={reviewData.comments}
                onChange={handleReviewChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={reviewData.status}
                onChange={handleReviewChange}
              >
                <option value="">Select Status</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reviewer</Form.Label>
              <Form.Control
                type="text"
                name="reviewer"
                value={reviewData.reviewer}
                onChange={handleReviewChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reports Modal */}
      <Modal
        show={showReportsModal}
        onHide={() => setShowReportsModal(false)}
        centered
        size="lg"
        className="reports-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            Financial and Progress Reports
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h5 className="mb-3 section-title">Financial Report</h5>
            {financialReport ? (
              <div>
                <div className="report-item">
                  <span className="report-label">Grant Account:</span>
                  <span className="report-value">
                    {financialReport.grant_account}
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Report Date:</span>
                  <span className="report-value">
                    {format(
                      new Date(financialReport.report_date),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Fiscal Year:</span>
                  <span className="report-value">
                    {financialReport.fiscal_year}
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Total Budget:</span>
                  <span className="report-value">
                    {financialReport.budget_summary.total_budget}
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Allocated Amount:</span>
                  <span className="report-value">
                    {financialReport.budget_summary.total_allocated}
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Total Budgeted:</span>
                  <span className="report-value">
                    {financialReport.budget_summary.total_budgeted}
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Balance:</span>
                  <span className="report-value">
                    {financialReport.budget_summary.remaining_amount}
                  </span>
                </div>
              </div>
            ) : (
              <p className="no-report">No financial report available.</p>
            )}
            <hr className="report-divider" />
            <h5 className="mt-4 mb-3 section-title">Progress Report</h5>
            {progressReport ? (
              <div>
                <div className="report-item">
                  <span className="report-label">Report Date:</span>
                  <span className="report-value">
                    {format(
                      new Date(progressReport.report_date),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Progress:</span>
                  <span className="report-value">
                    {progressReport.progress_percentage}%
                  </span>
                </div>
                <div className="report-item">
                  <span className="report-label">Progress Status:</span>
                  <span className="report-value">{progressReport.status}</span>
                </div>
              </div>
            ) : (
              <p className="no-report">No progress report available.</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrantCloseOut;
