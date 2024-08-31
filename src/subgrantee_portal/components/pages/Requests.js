import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { fetchWithAuth } from "../../../utils/helpers";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [grantAccounts, setGrantAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    grantCloseoutDetails: "",
    reason: "",
    lessons_learnt: "",
    best_practices: "",
    achievements: "",
    grant_account: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchWithAuth(`/api/grants/requests/${userId}/`);
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError("Failed to fetch requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  useEffect(() => {
    const fetchGrantAccounts = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/grant-account/${userId}/`
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setGrantAccounts(data);
        } else if (data && typeof data === "object" && data.id) {
          setGrantAccounts([data]);
        } else {
          console.error("Received unexpected data for grant accounts:", data);
          setError("No valid grant accounts found.");
        }
      } catch (error) {
        console.error("Error fetching grant accounts:", error);
        setError("Failed to fetch grant accounts. Please try again later.");
      }
    };

    fetchGrantAccounts();
  }, [userId]);

  const handleRequestTypeChange = (e) => {
    setSelectedRequestType(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requestPayload = {
      request_type: selectedRequestType,
      ...formData,
    };

    try {
      const response = await fetchWithAuth(
        `/api/grants/grant-closeout-request/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Request submitted successfully:", data);
      setShowModal(false);
      // Optionally, refresh the requests list here
    } catch (error) {
      console.error("Error submitting request:", error);
      setError("Failed to submit request. Please try again later.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.request_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.grant_closeout?.grant_account?.grant?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.grant_closeout?.status
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const showAdditionalFields = formData.reason === "completed";

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => setShowModal(true)} className="btn btn-primary">
          Add Request
        </Button>
      </div>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Request Type, Grant, or Status"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </InputGroup>

      {loading ? (
        <p>Loading requests...</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Request</th>
                <th>Grant</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.request_type}</td>
                    <td>
                      {request.grant_closeout?.grant_account?.grant?.name ||
                        "N/A"}
                    </td>
                    <td>{request.grant_closeout?.status || "N/A"}</td>
                    <td>{new Date(request.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding Request */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="requestType">
              <Form.Label>Request Type</Form.Label>
              <Form.Control
                as="select"
                value={selectedRequestType}
                onChange={handleRequestTypeChange}
                required
              >
                <option value="">Select Request Type</option>
                <option value="grant_account">Grant Account</option>
                <option value="budget_total">Budget Total</option>
                <option value="budget_total_modification">
                  Budget Total Modification
                </option>
                <option value="disbursement">Disbursement</option>
                <option value="closeout">Closeout</option>
                <option value="modification">Modification</option>
                <option value="document">Document</option>
                <option value="review">Review</option>
                <option value="grant_closeout">Grant Closeout</option>
              </Form.Control>
            </Form.Group>

            {selectedRequestType === "grant_closeout" && (
              <>
                <Form.Group controlId="grant_account">
                  <Form.Label>Grant Account</Form.Label>
                  <Form.Control
                    as="select"
                    name="grant_account"
                    value={formData.grant_account}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a grant account</option>
                    {grantAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.grant.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="reason">
                  <Form.Label>Reason for Close Out</Form.Label>
                  <Form.Control
                    as="select"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="completed">Completed</option>
                    <option value="terminated">Terminated</option>
                    <option value="suspended">Suspended</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>

                {showAdditionalFields && (
                  <>
                    <Form.Group controlId="achievements">
                      <Form.Label>Achievements</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="achievements"
                        value={formData.achievements}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="lessonsLearnt">
                      <Form.Label>Lessons Learnt</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="lessons_learnt"
                        value={formData.lessons_learnt}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="bestPractices">
                      <Form.Label>Best Practices</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="best_practices"
                        value={formData.best_practices}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </>
                )}
              </>
            )}

            {selectedRequestType === "modification" && (
              <>
                <Form.Group controlId="grant_account">
                  <Form.Label>Grant Account</Form.Label>
                  <Form.Control
                    as="select"
                    name="grant_account"
                    value={formData.grant_account}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a grant account</option>
                    {grantAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.grant.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Requests;
