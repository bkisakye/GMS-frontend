import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Container, Row, Col } from "react-bootstrap";
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

        // Filter grants
        const filteredGrants = data.results.filter(
          (grant) =>
            (!grant.application_deadline ||
              grant.application_deadline >= today) &&
            grant.end_date >= today &&
            grant.is_open
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
      <Container className="text-center mt-5">
        <h3>Loading...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <h3>Error: {error}</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="text-center mb-4">
        <h1 className="display-4 text-primary">
          Discover Our Grant Opportunities
        </h1>
        <p className="lead text-muted">
          Explore and apply for grants that align with your mission.
        </p>
      </div>

      <Row>
        {grantOpportunities.length === 0 ? (
          <Col className="text-center">
            <p>No available grants at this time.</p>
          </Col>
        ) : (
          grantOpportunities.map((grant) => (
            <Col key={grant.id} md={6} lg={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{grant.name}</Card.Title>
                  <Card.Text>
                    <strong>Start Date:</strong> {grant.start_date}
                    <br />
                    <strong>End Date:</strong> {grant.end_date}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleShow(grant)}>
                    More Details
                  </Button>
                </Card.Body>
                <Card.Footer className="text-white bg-primary">
                  Open
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedGrant?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Description:</strong> {selectedGrant?.description}
          </p>
          <p>
            <strong>Category:</strong> {selectedGrant?.category_detail?.name}
          </p>
          <p>
            <strong>Donor:</strong> {selectedGrant?.donor_detail?.name}
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
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleApplyNow} disabled={loading}>
            {loading ? "Checking..." : "Apply Now"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LandingPage;
