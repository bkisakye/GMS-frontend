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
import { toast } from "react-toastify";
import Closeout from "./Closeout"; // Adjust the import path based on your file structure

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [disbursements, setDisbursements] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [showCloseoutModal, setShowCloseoutModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [disbursementAmount, setDisbursementAmount] = useState("");
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError("Failed to fetch accounts or disbursements.");
    }
  };

  const handleCloseOutClick = (accountId) => {
    setSelectedAccountId(accountId);
    setShowCloseoutModal(true);
  };

  const handleDisburseClick = (accountId) => {
    setSelectedAccountId(accountId);
    setBudgetTotal(
      accounts.find((acc) => acc.id === accountId)?.budget_total
        ?.budget_total || 0
    ); // Fetch the budget total
    setShowDisburseModal(true);
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
      toast.error("Disbursement amount must be positive.");
      return;
    }

    if (parseFloat(disbursementAmount) > budgetTotal) {
      toast.error("Disbursement amount cannot exceed the available budget.");
      return;
    }

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
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          toast.error(
            errorData.detail ||
              "An error occurred while processing the disbursement."
          );
        } else {
          const errorText = await response.text();
          toast.error("An unexpected error occurred. Please try again.");
          console.error("Server responded with HTML:", errorText);
        }

        throw new Error("Disbursement request failed.");
      }

      setDisbursementAmount("");
      setShowDisburseModal(false);
      await fetchAccountsAndDisbursements();
      toast.success("Disbursement successful!");
    } catch (error) {
      console.error("Error handling disbursement:", error);
      toast.error("An error occurred while processing the disbursement.");
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };

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
            <th>Closeout</th> {/* Added Closeout column */}
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
                  <td>{disbursement.disbursement_amount}</td>
                  <td>{disbursement.budget_balance}</td>
                  <td>{getStatusBadge(account.disbursed)}</td>
                  <td>
                    {account.disbursed !== "fully_disbursed" && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="disburse-btn"
                        onClick={() => handleDisburseClick(account.id)}
                      >
                        Disburse
                      </Button>
                    )}
                  </td>
                  <td>
                    {account.status === "active" ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="closeout-btn"
                        onClick={() => handleCloseOutClick(account.id)}
                      >
                        Closeout
                      </Button>
                    ) : account.status === "closed" ? (
                      <div className="account-closed-message">
                        This account is closed.
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No matching accounts found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Disburse Modal */}
      <Modal
        show={showDisburseModal}
        onHide={() => setShowDisburseModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Disburse Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Disbursement Amount</Form.Label>
              <Form.Control
                type="number"
                value={disbursementAmount}
                onChange={(e) => setDisbursementAmount(e.target.value)}
                min="0"
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

      {/* Closeout Modal */}
      <Closeout
        showModal={showCloseoutModal}
        handleClose={() => setShowCloseoutModal(false)}
      />
    </Container>
  );
};

export default Accounts;
