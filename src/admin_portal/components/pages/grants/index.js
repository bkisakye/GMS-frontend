import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import QuestionModal from "./specificquestions"; // Ensure this path is correct
import GrantDetailsModal from "./grantdetails"; // Ensure this path is correct

const GrantsTable = () => {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGrantId, setSelectedGrantId] = useState(null);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const response = await fetchWithAuth("/api/grants/list/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGrants(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, []);

  const handleAddQuestion = (grantId) => {
    setSelectedGrantId(grantId);
    setIsQuestionModalOpen(true);
  };

  const handleViewDetails = (grant) => {
    setSelectedGrant(grant);
    setIsDetailsModalOpen(true);
  };

  const handleCloseQuestionModal = () => {
    setIsQuestionModalOpen(false);
    setSelectedGrantId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedGrant(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={tableStyles.th}>Name</th>
            <th style={tableStyles.th}>Description</th>
            <th style={tableStyles.th}>Start Date</th>
            <th style={tableStyles.th}>End Date</th>
            <th style={tableStyles.th}>Amount</th>
            <th style={tableStyles.th}>Specific Questions</th>
            <th style={tableStyles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grants.length > 0 ? (
            grants.map((grant) => (
              <tr key={grant.id}>
                <td style={tableStyles.td}>{grant.name}</td>
                <td style={tableStyles.td}>{grant.description}</td>
                <td style={tableStyles.td}>{grant.start_date}</td>
                <td style={tableStyles.td}>{grant.end_date}</td>
                <td style={tableStyles.td}>{grant.amount}</td>
                <td style={tableStyles.td}>
                  <button
                    onClick={() => handleAddQuestion(grant.id)}
                    style={buttonStyles}
                  >
                    Add Specific Question
                  </button>
                </td>
                <td style={tableStyles.td}>
                  <button
                    onClick={() => handleViewDetails(grant)}
                    style={buttonStyles}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={tableStyles.td}>
                No grants available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isQuestionModalOpen && (
        <QuestionModal
          isOpen={isQuestionModalOpen}
          onClose={handleCloseQuestionModal}
          grantId={selectedGrantId}
        />
      )}
      {isDetailsModalOpen && (
        <GrantDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          grant={selectedGrant}
        />
      )}
    </div>
  );
};

const tableStyles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

const buttonStyles = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
};

export default GrantsTable;
