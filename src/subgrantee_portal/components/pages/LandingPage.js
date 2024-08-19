import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { fetchWithAuth } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [grantOpportunities, setGrantOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrantOpportunities = async () => {
      try {
        const response = await fetchWithAuth("/api/grants/grants/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Get today's date in ISO format
        const today = new Date().toISOString().split("T")[0];

        // Filter grants where application_deadline is in the future or is null
        // and end_date is today or in the future
        const filteredGrants = data.filter(
          (grant) =>
            (!grant.application_deadline ||
              grant.application_deadline >= today) &&
            grant.end_date >= today
        );

        setGrantOpportunities(filteredGrants);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrantOpportunities();
  }, []);

  const handleShow = (grant) => {
    setSelectedGrant(grant);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleApplyNow = async () => {
    setLoading(true);
    try {
      const profileResponse = await fetchWithAuth(
        "/api/subgrantees/check-profile/"
      );
      const profileData = await profileResponse.json();

      if (!profileData.has_profile) {
        alert("Please complete your profile before applying for a grant.");
        navigate("/profile");
        return;
      }

      const grantId = selectedGrant.id;
      const grantName = encodeURIComponent(selectedGrant.name);

      navigate(`/application/${grantName}`, { state: { grantId } });
    } catch (error) {
      console.error("Error handling application:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h3>Error: {error}</h3>
      </div>
    );
  }

  return (
    <div
      className="container mt-5"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "2rem",
        borderRadius: "0.5rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          backgroundColor: "#e9ecef",
          padding: "3rem 1rem",
          borderRadius: "0.5rem",
        }}
      >
        <h1
          style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#007bff" }}
        >
          Discover Our Grant Opportunities
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#6c757d" }}>
          Explore and apply for grants that align with your mission.
        </p>
      </div>

      <div className="row">
        {grantOpportunities.map((grant) => (
          <div key={grant.id} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card"
              style={{
                borderColor: "#ced4da",
                maxWidth: "28rem",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <div className="card-body" style={{ padding: "1.5rem" }}>
                <h5 className="card-title" style={{ fontSize: "1.25rem" }}>
                  {grant.name}
                </h5>
                <ul className="list-unstyled mb-4">
                  <li>
                    <strong>Start Date:</strong> {grant.start_date}
                  </li>
                  <li>
                    <strong>End Date:</strong> {grant.end_date}
                  </li>
                </ul>
                <Button
                  style={{
                    fontSize: "1.1rem",
                    borderRadius: "0.25rem",
                    transition: "background-color 0.2s, transform 0.2s",
                  }}
                  variant="primary"
                  className="mt-3"
                  onClick={() => handleShow(grant)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  }
                >
                  More Details
                </Button>
              </div>
              <div
                className="card-footer"
                style={{ backgroundColor: "#007bff", color: "#fff" }}
              >
                Open
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          style={{
            borderBottom: "2px solid #dee2e6",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Modal.Title style={{ fontWeight: "bold", color: "#007bff" }}>
            {selectedGrant?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8f9fa", padding: "2rem" }}>
          <p>
            <strong>Description:</strong> {selectedGrant?.description}
          </p>
          <p>
            <strong>Category:</strong> {selectedGrant?.category?.name}
          </p>
          <p>
            <strong>Donor:</strong> {selectedGrant?.donor?.name}
          </p>
          <p>
            <strong>Amount:</strong> ${selectedGrant?.amount}
          </p>
          <p>
            <strong>Start Date:</strong> {selectedGrant?.start_date}
          </p>
          <p>
            <strong>End Date:</strong> {selectedGrant?.end_date}
          </p>
          <p>
            <strong>Application Deadline:</strong>{" "}
            {selectedGrant?.application_deadline}
          </p>
        </Modal.Body>
        <Modal.Footer
          style={{ borderTop: "2px solid #dee2e6", backgroundColor: "#f8f9fa" }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              borderRadius: "0.25rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#6c757d")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#e9ecef")
            }
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleApplyNow}
            disabled={loading}
            style={{
              borderRadius: "0.25rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
          >
            {loading ? "Checking..." : "Apply Now"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LandingPage;
