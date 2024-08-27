import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { BsFileEarmarkText } from "react-icons/bs";
import {
  Spinner,
  Table,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Form,
} from "react-bootstrap";

const Accounts = () => {
  const [grantAccount, setGrantAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [kpis, setKpis] = useState([]);
  const [checkedKpis, setCheckedKpis] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    fetchGrantAccounts();
  }, [userId]);

  const fetchGrantAccounts = async () => {
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
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAccount = grantAccount?.grant?.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  const handleOpenModal = async () => {
    setShowModal(true);
    try {
      const response = await fetchWithAuth(
        `/api/grants/progress-report/${grantAccount.id}/`
      );
      if (response.ok) {
        const data = await response.json();
        setCheckedKpis(data.completed_pkis || []);
      }
    } catch (error) {
      console.error("Error fetching latest progress report:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCheckedKpis([]);
  };

  const handleCheckboxChange = (kpi) => {
    setCheckedKpis((prev) =>
      prev.includes(kpi) ? prev.filter((item) => item !== kpi) : [...prev, kpi]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/grants/progress-report/${grantAccount.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed_pkis: checkedKpis,
          }),
        }
      );

      if (response.ok) {
        console.log("Progress report submitted successfully");
        handleCloseModal();
        fetchGrantAccounts(); // Refresh the grant account data
      } else {
        console.error("Failed to submit progress report");
      }
    } catch (error) {
      console.error("Error submitting progress report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!grantAccount) {
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
            <th>Start Date</th>
            <th>End Date</th>
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
              <td>{grantAccount.grant?.start_date}</td>
              <td>{grantAccount.grant?.end_date}</td>
              <td>{grantAccount.grant?.reporting_time}</td>
              <td>{grantAccount.budget_total?.budget_total}</td>
              <td>{grantAccount.current_amount}</td>
              <td>
                <Button
                  variant="info"
                  title="Submit Report"
                  onClick={handleOpenModal}
                >
                  <BsFileEarmarkText />
                </Button>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No matching grant account found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>KPIs for {grantAccount.grant?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {kpis.map((kpi, index) => (
            <Form.Check
              key={index}
              type="checkbox"
              label={kpi}
              checked={checkedKpis.includes(kpi)}
              onChange={() => handleCheckboxChange(kpi)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Accounts;
