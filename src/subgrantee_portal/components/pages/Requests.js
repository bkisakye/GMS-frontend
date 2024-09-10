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
import { toast } from "react-toastify";

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
    items: [{ name: "", quantity: "", description: "" }],
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
        if (Array.isArray(data)) {
          setGrantAccounts(data);
        } else if (data && typeof data === "object" && data.id) {
          setGrantAccounts([data]);
        } else {
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
    setFormData({
      ...formData,
      items: [{ name: "", quantity: "", description: "" }],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRequirementChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };
    setFormData({ ...formData, items: updatedItems });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { name: "", quantity: "", description: "" },
      ],
    });
  };

  const removeRequirement = (index) => {
    const updatedItems = formData.items.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const requestPayload = {
      request_type: selectedRequestType,
      ...formData,
    };

    try {
      let endpoint = "";
      if (selectedRequestType === "requirements") {
        endpoint = `/api/grants/requirements/`;
      } else if (selectedRequestType === "grant_closeout") {
        endpoint = `/api/grants/grant-closeout-request/`;
      } else if (selectedRequestType === "modification") {
        endpoint = `/api/grants/modification-request/`;
      }

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      toast.success("Request submitted successfully");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to submit request. Please try again later.");
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

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
                filteredRequests.map((request) => {
                  let grantName = "N/A";
                  let status = "N/A";

                  if (request.request_type === "grant_closeout") {
                    grantName =
                      request.grant_closeout?.grant_account?.grant?.name ||
                      "N/A";
                    status = request.grant_closeout?.status || "N/A";
                  } else if (request.request_type === "modification") {
                    grantName =
                      request.modification?.grant_account?.grant?.name || "N/A";
                    status = request.modification?.status || "N/A";
                  } else if (request.request_type === "requirements") {
                    grantName =
                      request.requirements?.grant_account?.grant?.name || "N/A";
                    status = request.requirements?.status || "N/A";
                  }

                  return (
                    <tr key={request.id}>
                      <td>{request.request_type}</td>
                      <td>{grantName}</td>
                      <td>{status}</td>
                      <td>{new Date(request.created_at).toLocaleString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding Requests */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
                <option value="">Select request type</option>
                <option value="requirements">Requirements</option>
                <option value="modification">Modification</option>
                <option value="grant_closeout">Grant Closeout</option>
              </Form.Control>
            </Form.Group>

            {selectedRequestType === "requirements" && (
              <>
                <Form.Group controlId="grantAccount">
                  <Form.Label>Grant Account</Form.Label>
                  <Form.Control
                    as="select"
                    name="grant_account"
                    value={formData.grant_account}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Grant Account</option>
                    {grantAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.grant.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="items">
                  <Form.Label>Requirements</Form.Label>
                  {formData.items.map((req, index) => (
                    <div key={index} className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={req.name}
                        onChange={(e) => handleRequirementChange(index, e)}
                        required
                      />
                      <Form.Control
                        type="number"
                        placeholder="Quantity"
                        name="quantity"
                        value={req.quantity}
                        onChange={(e) => handleRequirementChange(index, e)}
                        required
                      />
                      <Form.Control
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={req.description}
                        onChange={(e) => handleRequirementChange(index, e)}
                        required
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeRequirement(index)}
                        className="mt-2"
                      >
                        Remove Requirement
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={addRequirement}
                    className="btn btn-secondary"
                  >
                    Add Another Requirement
                  </Button>
                </Form.Group>
              </>
            )}

            {selectedRequestType === "grant_closeout" && (
              <>
                <Form.Group controlId="grantCloseoutDetails">
                  <Form.Label>Grant Closeout Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="grantCloseoutDetails"
                    value={formData.grantCloseoutDetails}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="grantAccount">
                  <Form.Label>Grant Account</Form.Label>
                  <Form.Control
                    as="select"
                    name="grant_account"
                    value={formData.grant_account}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Grant Account</option>
                    {grantAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.grant.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </>
            )}

            {selectedRequestType === "modification" && (
              <>
                <Form.Group controlId="reason">
                  <Form.Label>Reason for Modification</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="grantAccount">
                  <Form.Label>Grant Account</Form.Label>
                  <Form.Control
                    as="select"
                    name="grant_account"
                    value={formData.grant_account}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Grant Account</option>
                    {grantAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.grant.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </>
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
              >
                Close
              </Button>
              <Button type="submit" className="btn btn-primary">
                Submit Request
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Requests;
