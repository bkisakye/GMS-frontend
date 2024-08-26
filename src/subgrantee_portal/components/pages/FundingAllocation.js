import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { fetchWithAuth } from "../../../utils/helpers";
import { AiFillEdit } from "react-icons/ai";

const FundingAllocation = ({ grantAccountId }) => {
  const [allocations, setAllocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAllocation, setCurrentAllocation] = useState(null);
  const [budgetItems, setBudgetItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    fetchAllocations();
    fetchBudgetItems();
  }, [grantAccountId]);

  const fetchAllocations = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/funding/${userId}/allocations/`
      );
      if (response.ok) {
        const data = await response.json();
        setAllocations(data);
      } else {
        console.error("Failed to fetch allocations");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchBudgetItems = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/budget_item/${userId}/`
      );
      if (response.ok) {
        const data = await response.json();
        setBudgetItems(data);
      } else {
        console.error("Failed to fetch budget items");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreate = () => {
    setCurrentAllocation({
      amount: "",
      
      description: "",
      item: "",
    });
    setShowModal(true);
  };

  const handleEdit = (allocation) => {
    setCurrentAllocation(allocation);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const method = currentAllocation.id ? "PATCH" : "POST";
      const url = currentAllocation.id
        ? `/api/grants/funding/${userId}/allocations/${currentAllocation.id}/`
        : `/api/grants/funding/${userId}/allocations/`;

      const payload = {
        ...currentAllocation,
        user: userId, // Add the user field here
      };

      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchAllocations();
        setShowModal(false);
      } else {
        console.error("Failed to save allocation:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getBudgetItemName = (itemId) => {
    const item = budgetItems.find((item) => item.id === itemId);
    return item ? item.category.name : "Unknown";
  };

  const filteredAllocations = allocations.filter((allocation) => {
    const descriptionMatch = allocation.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const budgetItemMatch = getBudgetItemName(allocation.item)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return descriptionMatch || budgetItemMatch;
  });

  return (
    <div className="container mt-4">
      <h2>Funding Allocations</h2>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <InputGroup className="flex-grow-1">
          <FormControl
            placeholder="Search based on budget item"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Button variant="primary" onClick={handleCreate}>
          Allocate Funds
        </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Budget Item</th>
            <th>Description</th>
            <th>Reference Number</th>
            <th>Amount</th>
            <th>Allocation Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAllocations.length > 0 ? (
            filteredAllocations.map((allocation) => (
              <tr key={allocation.id}>
                <td>{getBudgetItemName(allocation.item)}</td>
                <td>{allocation.description}</td>
                <td>{allocation.reference_number}</td>
                    <td>{allocation.amount}</td>
                    <td>{allocation.allocation_date}</td>
               
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(allocation)}
                  >
                    <AiFillEdit />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No allocations found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAllocation?.id ? "Edit" : "Add"} Allocation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={currentAllocation?.amount || ""}
                onChange={(e) =>
                  setCurrentAllocation({
                    ...currentAllocation,
                    amount: e.target.value,
                  })
                }
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={currentAllocation?.description || ""}
                onChange={(e) =>
                  setCurrentAllocation({
                    ...currentAllocation,
                    description: e.target.value,
                  })
                }
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group controlId="formBudgetItem">
              <Form.Label>Budget Item</Form.Label>
              <Form.Control
                as="select"
                value={currentAllocation?.item || ""}
                onChange={(e) =>
                  setCurrentAllocation({
                    ...currentAllocation,
                    item: e.target.value,
                  })
                }
              >
                <option value="">Select a budget item</option>
                {budgetItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.category.name} - {item.description}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FundingAllocation;
