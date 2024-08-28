import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import {
  Table,
  Badge,
  Button,
  FormControl,
  InputGroup,
  Container,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [disbursements, setDisbursements] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [disbursementAmount, setDisbursementAmount] = useState("");
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line

  useEffect(() => {
    fetchAccountsAndDisbursements();
  }, []);

  const fetchAccountsAndDisbursements = async () => {
    try {
      const response = await fetchWithAuth("/api/grants/grant-accounts/");
      const data = await response.json();
      setAccounts(data);
      const disbursementPromises = data.map((account) =>
        fetchWithAuth(
          `/api/grants/disbursements-by-account/${account.id}/`
        ).then((disbursementResponse) =>
          disbursementResponse.json().then((disbursementData) => ({
            accountId: account.id,
            disbursementData,
          }))
        )
      );
      const disbursementResults = await Promise.all(disbursementPromises);
      const newDisbursements = disbursementResults.reduce(
        (acc, { accountId, disbursementData }) => {
          acc[accountId] = disbursementData;
          return acc;
        },
        {}
      );
      setDisbursements(newDisbursements);
    } catch (error) {
      console.error("Error fetching accounts or disbursements:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "fully_disbursed":
        return <Badge bg="success">Fully Disbursed</Badge>;
      case "partially_disbursed":
        return <Badge bg="warning">Partially Disbursed</Badge>;
      case "not_disbursed":
        return <Badge bg="danger">Not Disbursed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAccounts = accounts.filter((account) =>
    `${account.account_holder?.organisation_name} ${account.grant?.name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDisburse = async () => {
    if (disbursementAmount <= 0) {
      setError("Disbursement amount must be positive.");
      return;
    }

    if (parseFloat(disbursementAmount) > budgetTotal) {
      setError("Disbursement amount cannot exceed the available budget.");
      return;
    }

    setError(""); // Clear previous errors
    setIsSubmitting(true); // Show loading state

    try {
      const existingDisbursement = disbursements[selectedAccountId]?.[0];
      let response;

      if (existingDisbursement) {
        response = await fetchWithAuth(
          `/api/grants/disbursements/${existingDisbursement.id}/update/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ disbursement_amount: disbursementAmount }),
          }
        );
      } else {
        response = await fetchWithAuth(
          `/api/grants/disbursements/create/${selectedAccountId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ disbursement_amount: disbursementAmount }),
          }
        );
      }

      if (!response.ok) {
        let errorMessage =
          "An error occurred while processing the disbursement.";
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = "An unexpected error occurred. Please try again.";
          console.error("Server responded with HTML:", errorText);
        }

        throw new Error(errorMessage);
      }

      setDisbursementAmount("");
      setShowModal(false);
      await fetchAccountsAndDisbursements(); // Refetch accounts and disbursements
    } catch (error) {
      console.error("Error handling disbursement:", error);
      setError(error.message); // Display error to the user
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };

  const DisburseButton = ({ accountId }) => (
    <Button
      variant="outline-primary"
      size="sm"
      className="disburse-btn"
      onClick={() => {
        setSelectedAccountId(accountId);
        setBudgetTotal(
          accounts.find((acc) => acc.id === accountId)?.budget_total
            ?.budget_total || 0
        ); // Fetch the budget total
        setShowModal(true);
      }}
    >
      <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
      Disburse
    </Button>
  );

  return (
    <Container className="mt-5">
      <InputGroup className="mb-4">
        <FormControl
          placeholder="Search by Organization or Grant Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead className="bg-light">
          <tr>
            <th>Account</th>
            <th>Budget</th>
            <th>Disbursed Amount</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => {
              const disbursement = disbursements[account.id]?.[0] || {}; // Assuming there’s only one disbursement per account
              return (
                <tr key={account.id}>
                  <td>
                    {account.account_holder?.organisation_name} -{" "}
                    {account.grant?.name}
                  </td>
                  <td>{account.budget_total?.budget_total}</td>
                  <td>{disbursement.disbursement_amount || "N/A"}</td>
                  <td>{disbursement.budget_balance || "N/A"}</td>
                  <td>{getStatusBadge(account.disbursed)}</td>
                  <td>
                    {account.disbursed !== "fully_disbursed" && (
                      <DisburseButton accountId={account.id} />
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No matching accounts found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setError(""); // Clear any existing errors when closing the modal
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Disburse Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Disbursement Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={disbursementAmount}
                onChange={(e) => setDisbursementAmount(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleDisburse}
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Accounts;
