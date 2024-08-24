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
  const [grants, setGrants] = useState(null); // Renamed to grants, containing single grant object

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
          console.log("Fetched grant:", data); // Log to check the data structure
          setGrants(data); // Set the single grant object
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
    </div>
  );
};

export default Budget;
