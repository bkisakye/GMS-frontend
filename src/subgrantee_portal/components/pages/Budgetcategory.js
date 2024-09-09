import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Eye, PlusCircle, Trash } from "react-bootstrap-icons"; 
import { Form, OverlayTrigger } from "react-bootstrap";
import { toast } from "react-toastify";
import { Tooltip } from "react-bootstrap";

const BudgetCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());
  const [grants, setGrants] = useState([]);
  const [selectedGrant, setSelectedGrant] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBudgetItemModalOpen, setIsBudgetItemModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isItemListModalOpen, setIsItemListModalOpen] = useState(false);
  const [budgetItems, setBudgetItems] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/budget_category/${userId}/`
        );
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
      }
    };

const fetchGrants = async () => {
  try {
    const response = await fetchWithAuth(
      `/api/grants/grant-account/${userId}/`
    );
    const data = await response.json();
    if (Array.isArray(data)) {
      setGrants(data);
      console.log("Array of grants:", data);
    } else if (data.grant) {
      setGrants([data]); 
    } else {
      console.error("Unexpected data format:", data);
      setError("Failed to load grants.");
    }
  } catch (error) {
    console.error("Error fetching grants:", error);
    setError("Failed to load grants.");
  }
};


    fetchCategories();
    fetchGrants();
  }, [userId]);

  

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth(
        `/api/grants/budget_category/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description }),
        }
      );

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]); 
        
        setName("");
        setDescription("");
        
        setIsCategoryModalOpen(false); 
toast.success("Budget Category added successfully!");
      } else {
        toast.error("Failed to add category. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to add category. Please try again.");
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/budget_item/${userId}/${selectedCategory}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setBudgetItems(data);
          console.log("Budget Items:", data);
          console.log("cartegoryId:", selectedCategory);
        } else {
          console.error("Failed to fetch budget items");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchItems();
  }, [selectedCategory, userId]);

  const handleBudgetItemSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth(
        `/api/grants/budget_item/${userId}/${selectedCategory}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_account: selectedGrant,
            amount,
            fiscal_year: fiscalYear,
            description,
          }),
        }
      );

      if (response.ok) {
        const newBudgetItem = await response.json();
       
        setAmount("");
        setFiscalYear(new Date().getFullYear()); 
        setDescription("");
        setSelectedGrant(""); 
       
        setIsBudgetItemModalOpen(false); 
        toast.success("Budget Item added successfully!");
        window.location.reload();
      } else {
toast.error("Failed to add budget item. Please try again.");
      }
    } catch (err) {
toast.error("Budget item exceeds the grant's total budget");
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/budget_category/${userId}/${categoryId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );
        toast.success("Category deleted successfully!");
      } else {
        toast.error("Failed to delete category. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to delete category. Please try again.");
    }
  };

  const toggleCategoryModal = () =>
    setIsCategoryModalOpen(!isCategoryModalOpen);
  const toggleBudgetItemModal = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsBudgetItemModalOpen(!isBudgetItemModalOpen);
  };
  const toggleItemListModal = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsItemListModalOpen(!isItemListModalOpen);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Search Categories"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="btn btn-primary" onClick={toggleCategoryModal}>
          Add Budget Category
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Add Budget Item</Tooltip>}
                  >
                    <button
                      onClick={() => toggleBudgetItemModal(category.id)}
                      className="btn btn-success btn-sm me-2"
                    >
                      <PlusCircle />
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>View Budget Items</Tooltip>}
                  >
                    <button
                      onClick={() => toggleItemListModal(category.id)}
                      className="btn btn-secondary btn-sm me-2"
                    >
                      <Eye />
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Delete Budget Category</Tooltip>}
                  >
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn btn-danger btn-sm me-2"
                    >
                      <Trash />
                    </button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isCategoryModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Budget Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleCategoryModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCategorySubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Category Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description:
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Add Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isItemListModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Budget Items</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleItemListModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Grant</th>
                      <th>Amount</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.grant_account?.grant?.name}</td>
                        <td>{item.amount}</td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBudgetItemModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Budget Item</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleBudgetItemModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleBudgetItemSubmit}>
                  <div className="mb-3">
                    <Form.Label>Grant</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedGrant}
                      onChange={(e) => setSelectedGrant(e.target.value)} 
                      required
                    >
                      <option value="">Select a grant</option>
                      {grants &&
                        grants.map((grantObj) => (
                          <option key={grantObj.id} value={grantObj.id}>
                            {grantObj.grant.name} 
                          </option>
                        ))}
                    </Form.Control>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount:
                    </label>
                    <input
                      type="number"
                      id="amount"
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fiscalYear" className="form-label">
                      Fiscal Year:
                    </label>
                    <input
                      type="text"
                      id="fiscalYear"
                      className="form-control"
                      value={fiscalYear}
                      onChange={(e) => setFiscalYear(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description:
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Add Budget Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCategory;
