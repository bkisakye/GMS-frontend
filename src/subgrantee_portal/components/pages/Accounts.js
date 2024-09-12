import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { BsFileBarGraph, BsFileEarmarkText } from "react-icons/bs";
import {
  Spinner,
  Table,
  Button,
  InputGroup,
  FormControl,
  Modal,
  Tooltip,
  Form,
  OverlayTrigger,
} from "react-bootstrap";
import { toast } from "react-toastify";

const Accounts = () => {
  const [grantAccount, setGrantAccount] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [kpis, setKpis] = useState([]);
  const [checkedKpis, setCheckedKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    fetchGrantAccounts();
  }, [userId]);

  const fetchGrantAccounts = async () => {
    try {
      const response = await fetchWithAuth(`/api/grants/grant-account/${userId}/`);
      if (response.ok) {
        const data = await response.json();
        setGrantAccount(data);
        setKpis(
          data.grant?.kpis
            ? data.grant.kpis.split(",").map((kpi) => kpi.trim())
            : []
        );
        console.log("accounts", data);
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

  const filteredAccount = grantAccount.filter(account =>
    account.grant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = async (account) => {
   console.log("Opening modal for account:", account);
  setSelectedAccount(account);
  setShowModal(true);

  // Set the KPIs for the selected grant
  setKpis(
    account.grant?.kpis
      ? account.grant.kpis.split("\n").map((kpi) => kpi.trim()) // Split by newline instead of commas if needed
      : []
  );
console.log("kpi", kpis)
  try {
    const response = await fetchWithAuth(
      `/api/grants/progress-report/${account.id}/`
    );
    if (response.ok) {
      const data = await response.json();
      setCheckedKpis(data.completed_kpis || []);
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

const generateFinancialReport = async () => {
  if (!selectedAccount) {
    console.error("No account selected");
    toast.error("No account selected");
    return;
  }

  setLoading(true);
  try {
    const response = await fetchWithAuth(
      `/api/grants/generate-report/${selectedAccount.id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log("Financial report generated successfully");
      toast.success("Financial Report generated successfully");
    } else {
      console.error("Failed to generate financial report");
      toast.error("Failed to generate financial report");
    }
  } catch (error) {
    console.error("Error generating financial report:", error);
    toast.error("Error generating financial report");
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/grants/progress-report/${selectedAccount.id}/`,
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
        fetchGrantAccounts();
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
          {filteredAccount.length > 0 ? (
            filteredAccount.map((account) => (
              <tr key={account.id}>
                <td>{account.grant?.name}</td>
                <td>{account.grant?.start_date}</td>
                <td>{account.grant?.end_date}</td>
                <td>{account.grant?.reporting_time}</td>
                <td>{account.budget_total?.budget_total}</td>
                <td>{account.current_amount}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="submit-report-tooltip">Submit Report</Tooltip>
                    }
                  >
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleOpenModal(account)}
                    >
                      <BsFileEarmarkText />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="generate-report-tooltip">
                        Generate Financial Report
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="success"
                      onClick={generateFinancialReport}
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <BsFileBarGraph />
                      )}
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
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
          <Modal.Title>KPIs for {selectedAccount?.grant?.name}</Modal.Title>
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
