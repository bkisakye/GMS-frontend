import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";
import { Spinner } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa"; // Importing arrow icon

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    // Fetch the applications of the user from the API
    fetchWithAuth(`/api/grants/grant-applications/${userId}/`)
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setLoading(false);
      });
  }, [userId]);

  const handleApplicationClick = (grantName, grantId) => {
    navigate(`/application/${encodeURIComponent(grantName)}`, {
      state: { grantId },
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const cardStyle = {
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    marginBottom: "1rem",
  };

  const cardHoverStyle = {
    ...cardStyle,
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  };

  // Filter applications based on the search query (by grant name)
  const filteredApplications = applications.filter(
    (application) =>
      (application.status === "under_review" ||
        application.status === "negotiate") &&
      application.grant.name.toLowerCase().includes(searchQuery.toLowerCase()) // Search by grant name
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Applications</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by opportunity..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
        />
      </div>
      <div className="row">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div className="col-md-6 col-lg-4" key={application.id}>
              <div
                style={cardStyle}
                onClick={() =>
                  handleApplicationClick(
                    application.grant.name,
                    application.grant.id
                  )
                }
                onMouseEnter={(e) => (e.currentTarget.style = cardHoverStyle)}
                onMouseLeave={(e) => (e.currentTarget.style = cardStyle)}
                className="card h-100 shadow-sm"
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">{application.grant.name}</h5>
                    <p className="card-text text-muted">
                      {application.grant.description ||
                        "No description available"}
                    </p>
                  </div>
                  <FaArrowRight
                    style={{
                      fontSize: "1.5rem",
                      color: "#007bff",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">
              No applications found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
