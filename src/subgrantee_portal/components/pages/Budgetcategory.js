import React, { useState } from "react";
import { fetchWithAuth } from "./utils/fetchWithAuth"; // Adjust the import path as needed

const Budgetcategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth(
        "http://localhost:8000/api/budget_category/", // Your API endpoint
        {
          method: "POST",
          body: JSON.stringify({ name, description }),
        }
      );

      setSuccess("Category added successfully!");
      setName("");
      setDescription("");
      setError("");
    } catch (err) {
      setError("Failed to add category. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Add Budget Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Category Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Budgetcategory;
