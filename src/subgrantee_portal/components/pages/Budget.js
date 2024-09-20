import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchWithAuth } from "../../../utils/helpers";

const Budget = () => {
  const [budgetItems, setBudgetItems] = useState([]);
  const [filteredBudgetItems, setFilteredBudgetItems] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [grants, setGrants] = useState(null);
  const [newItem, setNewItem] = useState({
    grant_account: "",
    category: "",
    amount: "",
    description: "",
    fiscal_year: new Date().getFullYear(),
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    const fetchBudgetItems = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/budget_item/${userId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBudgetItems(data);
          setFilteredBudgetItems(data);
        } else {
          console.error("Failed to fetch budget items");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchGrants = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/grant-account/${userId}/`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched grant:", data);
          setGrants(data);
        } else {
          console.error("Failed to fetch grant");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/budget_category/${userId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (userId) {
      fetchBudgetItems();
      fetchCategories();
      fetchGrants();
    }
  }, [userId]);

  useEffect(() => {
    setFilteredBudgetItems(
      budgetItems.filter(
        (item) =>
          (item.grant_account?.grant?.name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (item.description?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          )
      )
    );
  }, [searchQuery, budgetItems]);

  const handleEditClick = (item) => {
    setEditItemId(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditItemId(null);
    setShowModal(false);
  };

  const handleSaveEdit = async () => {
    if (!editItemId) return;

    const updatedData = {
      grant_account: editItemId.grant_account?.id,
      category: editItemId.category?.id,
      amount: editItemId.amount,
      description: editItemId.description,
    };

    try {
      const response = await fetchWithAuth(
        `/api/grants/budget_item/${editItemId.id}/${userId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update budget item: ${response.statusText}`);
      }

      const result = await response.json();
      setBudgetItems((prevItems) =>
        prevItems.map((item) => (item.id === editItemId.id ? result : item))
      );
      setFilteredBudgetItems((prevItems) =>
        prevItems.map((item) => (item.id === editItemId.id ? result : item))
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteClick = async (id) => {
    const previousItems = [...budgetItems];
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
    setFilteredBudgetItems(
      filteredBudgetItems.filter((item) => item.id !== id)
    );

    try {
      const response = await fetchWithAuth(
        `/api/grants/budget_item/${id}/${userId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        setBudgetItems(previousItems);
        setFilteredBudgetItems(previousItems);
        console.error("Failed to delete budget item");
      }
    } catch (error) {
      setBudgetItems(previousItems);
      setFilteredBudgetItems(previousItems);
      console.error("Error:", error);
    }
  };

  const handleCreateItem = async () => {
    setError("");
    const formattedData = {
      grant_account: parseInt(newItem.grant_account),
      category: parseInt(newItem.category),
      amount: parseFloat(newItem.amount),
      fiscal_year: parseInt(newItem.fiscal_year),
      description: newItem.description,
    };

    try {
      const selectedGrantAccount = grants.find(grant => grant.id === formattedData.grant_account);

      if (!selecteGrantAccount) {
        throw new Error("Selected grant account not found");
      }
      
      const currentAmount = selectedGrantAccount.current_amount;

      const exixtingTotal = budgetItems
        .filter((item) => item.grant_account?.id === formattedData.grant_account)
        .reduce((total, item) => total + parseFloat(item.amount), 0);
      
      if (exixtingTotal + formattedData.amount > currentAmount) {
        setError("The total amount for this grant exceeds the amount on your account")
        return;
      }

      const response = await fetchWithAuth(
        `/api/grants/budget_item/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create budget item: ${response.statusText}`);
      }

      const result = await response.json();
      setBudgetItems([...budgetItems, result]);
      setFilteredBudgetItems([...filteredBudgetItems, result]);
      setShowCreateModal(false);
      setNewItem({
        grant_account: "",
        category: "",
        amount: "",
        description: "",
        fiscal_year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Budget Items</h2>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Search by grant or description"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="btn btn-primary ms-2"
          onClick={() => setShowCreateModal(true)}
        >
          Add Budget Item
        </button>
      </div>
      {filteredBudgetItems.length > 0 ? (
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Grant</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBudgetItems.map((item) => (
              <tr key={item.id}>
                <td>{item.grant_account?.grant?.name}</td>
                <td>{item.category?.name}</td>
                <td>{item.amount}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No budget items found.</p>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Budget Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItemId && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Grant</Form.Label>
                <Form.Control
                  as="select"
                  value={editItemId.grant_account?.grant?.id || ""}
                  onChange={(e) =>
                    setEditItemId({
                      ...editItemId,
                      grant_account: grants?.grant?.id
                        ? { id: grants.grant.id }
                        : null,
                    })
                  }
                >
                  <option value="">Select a grant</option>
                  {grants && (
                    <option key={grants.grant.id} value={grants.grant.id}>
                      {grants.grant.name}
                    </option>
                  )}
                </Form.Control>

                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={editItemId.category?.id || ""}
                  onChange={(e) =>
                    setEditItemId({
                      ...editItemId,
                      category: categories.find(
                        (cat) => cat.id === parseInt(e.target.value)
                      ),
                    })
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>

                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={editItemId.amount || ""}
                  onChange={(e) =>
                    setEditItemId({
                      ...editItemId,
                      amount: e.target.value,
                    })
                  }
                />

                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editItemId.description || ""}
                  onChange={(e) =>
                    setEditItemId({
                      ...editItemId,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Budget Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Grant</Form.Label>
              <Form.Control
                as="select"
                value={newItem.grant_account}
                onChange={(e) =>
                  setNewItem({ ...newItem, grant_account: e.target.value })
                }
              >
                <option value="">Select a grant</option>
                {grants && (
                  <option key={grants.id} value={grants.id}>
                    {grants.grant.name}
                  </option>
                )}
              </Form.Control>

              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>

              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={newItem.amount}
                onChange={(e) =>
                  setNewItem({ ...newItem, amount: e.target.value })
                }
              />

              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />

              <Form.Label>Fiscal Year</Form.Label>
              <Form.Control
                type="number"
                value={newItem.fiscal_year}
                onChange={(e) =>
                  setNewItem({ ...newItem, fiscal_year: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateItem}>
            Create Budget Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Budget;
