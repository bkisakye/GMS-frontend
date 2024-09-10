import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { FaRegEye, FaRegCheckCircle } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsClipboard2 } from "react-icons/bs";
import { format } from "date-fns";
import { toast } from "react-toastify";

const GrantCloseOut = () => {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  const [reviewData, setReviewData] = useState({
    comments: "",
    status: "",
    reviewer: userId,
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
  if (request && request.grant_closeout && request.grant_closeout.grant_account) {
    return request.grant_closeout.grant_account.account_holder?.organisation_name || 'Unknown';
  
    } else if (request && request.modifications && request.modifications.grant_account) {
      return request.modifications.grant_account.account_holder || "Unknown";
    } else if (
      request &&
      request.requirements &&
      request.requirements.grant_account
    ) {
      return (
        request.requirements.grant_account.account_holder
          ?.organisation_name || "Unknown"
      );
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
        </div>
      );
    }
    return null;
  };

  const getRequirementsDetails = (request) => {
    if (request.requirements) {
      return (
        <div>
          <p>
            <strong>Requested By:</strong>{" "}
            {request.requirements.requested_by.email || "N/A"}
          </p>
          <p>
            <strong>Grant:</strong>{" "}
            {request.requirements.grant_account.grant.name || "N/A"}
          </p>
          <p>
            <strong>Requested Date:</strong>{" "}
            {new Date(request.requirements.request_date).toLocaleDateString() ||
              "N/A"}
          </p>
          <p>
            <strong>Items:</strong>
            {request.requirements.items &&
            request.requirements.items.length > 0 ? (
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {request.requirements.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              "N/A"
            )}
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
  if (!selectedRequest) {
    console.error("No request selected.");
    return;
  }

  const reviewDataWithRequestId = {
    request: selectedRequest.id, // Add the request_id here
    reviewer: userId,
    comments: reviewData.comments,
    status: reviewData.status,
  };

  try {
    const response = await fetchWithAuth(`/api/grants/request-reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewDataWithRequestId),
    });

    if (response.ok) {
      
      setShowReviewModal(false);
      window.location.reload();
      toast.success("Review submitted successfully!");
      console.log("Review Data:", reviewDataWithRequestId);
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
                    <td>{getAccountHolderInfo(request) || "N/A"}</td>

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
                      {request.request_type === "grant_closeout" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          handleShowReportsModal();
                        }}
                      >{" "}
                        <BsClipboard2 />
                    </Button>
                      )}
                      {request.reviewed === false && (
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
                      )}
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
          {selectedRequest &&
            selectedRequest.request_type === "grant_closeout" && (
              <div>
                <p>
                  <strong>Request Type:</strong>{" "}
                  {selectedRequest.request_type || "N/A"}
                </p>
                <p>
                  <strong>Account Holder:</strong>{" "}
                  {getAccountHolderInfo(selectedRequest) || "N/A"}
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
              </div>
            )}

          {selectedRequest &&
            selectedRequest.request_type === "requirements" && (
              <div>{getRequirementsDetails(selectedRequest)}</div>
            )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
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
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={reviewData.status}
                onChange={handleReviewChange}
              >
                <option value="">Select Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Control>
            </Form.Group>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleReviewSubmit}>
            Submit Review
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
          <Modal.Title className="fs-4 fw-bold text-primary">
            Financial and Progress Reports
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h5 className="mb-3 fs-5 fw-semibold text-secondary">
              Financial Report
            </h5>
            {financialReport ? (
              <div>
                {Object.entries({
                  "Grant Account": financialReport.grant_account,
                  "Report Date": format(
                    new Date(financialReport.report_date),
                    "MMM d, yyyy"
                  ),
                  "Fiscal Year": financialReport.fiscal_year,
                  "Total Budget": financialReport.budget_summary.total_budget,
                  "Allocated Amount":
                    financialReport.budget_summary.total_allocated,
                  // "Total Budgeted":
                  //   financialReport.budget_summary.total_budgeted,
                  // Balance: financialReport.budget_summary.remaining_amount,
                  Balance: financialReport.budget_summary.remaining_amount,
                }).map(([label, value], index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between py-2 border-bottom"
                  >
                    <span className="fw-medium">{label}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">
                No financial report available.
              </p>
            )}
            <hr className="my-4" />
            <h5 className="mt-4 mb-3 fs-5 fw-semibold text-secondary">
              Progress Report
            </h5>
            {progressReport ? (
              <div>
                {Object.entries({
                  "Report Date": format(
                    new Date(progressReport.report_date),
                    "MMM d, yyyy"
                  ),
                  Progress: `${progressReport.progress_percentage}%`,
                  "Progress Status": progressReport.status,
                }).map(([label, value], index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between py-2 border-bottom"
                  >
                    <span className="fw-medium">{label}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">
                No progress report available.
              </p>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GrantCloseOut;
