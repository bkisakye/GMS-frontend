import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Card,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { fetchWithAuth } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useLoadingHandler from "../../hooks/useLoadingHandler";

const LandingPage = () => {
  const [grantOpportunities, setGrantOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  const [applications, setApplications] = useState([]);

useEffect(() => {
  const fetchGrantOpportunities = async () => {
    try {
      const response = await fetchWithAuth(`/api/grants/grants/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const today = new Date().toISOString().split("T")[0];

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

  const fetchApplications = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/grant-applications/${userId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      setError(error.message);
    }
  };

  fetchGrantOpportunities();
  fetchApplications();
}, [userId]);
  
  const unappliedGrants = grantOpportunities.filter(
    (grant) => !applications.some((app) => app.grant.id === grant.id)
    
  );


  const handleShow = (grant) => {
    setSelectedGrant(grant);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleApplyNow = async () => {
    setLoading(true);
    try {
      const profileResponse = await fetchWithAuth(
        `/api/subgrantees/check-profile/${userId}/`
      );
      const profileData = await profileResponse.json();

      if (!profileData.has_profile) {
        toast.error(
          "Please complete your profile before applying for a grant."
        );
        navigate("/profile");
        return;
      }

      const grantId = selectedGrant.id;
      const grantName = encodeURIComponent(selectedGrant.name);

      navigate(`/application/${grantName}`, { state: { grantId } });
    } catch (error) {
      console.error("Error handling application:", error);
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
      <div className="text-center mb-4" style={{ padding: "20px" }}>
        <h1 className="display-4 text-primary">
          Discover Our Funding Opportunities
        </h1>
        <p className="lead text-muted">
          Explore and apply for opportunities that align with your mission.
        </p>
      </div>

      <Row>
        {unappliedGrants.length === 0 ? (
          <Col className="text-center">
            <p>No available opportunities at this time.</p>
          </Col>
        ) : (
          unappliedGrants.map((grant) => (
            <Col key={grant.id} md={6} lg={4} className="mb-4">
              <Card
                className="h-100 shadow-sm"
                style={{ borderRadius: "10px" }}
              >
                <Card.Header
                  className="bg-primary text-white text-center"
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <h5 className="mb-0">{grant.name}</h5>
                </Card.Header>
                <Card.Body>
                  <Card.Text style={{ minHeight: "80px", fontSize: "1.1rem" }}>
                    {grant.description}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    style={{ borderRadius: "5px" }}
                    onClick={() => handleShow(grant)}
                  >
                    More Details
                  </Button>
                </Card.Body>
                <Card.Footer className="text-center">
                  <Badge bg="success" style={{ fontSize: "0.9rem" }}>
                    {grant.is_open ? "Open" : "Closed"}
                  </Badge>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Modal for grant details */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="shadow-lg"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="text-primary">
            {selectedGrant?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-3">
                <strong className="text-secondary">Description:</strong>
                <br />
                <span className="text-muted">{selectedGrant?.description}</span>
              </p>
              <p className="mb-3">
                <strong className="text-secondary">Category:</strong>
                <br />
                <span className="text-muted">
                  {selectedGrant?.category_detail?.name}
                </span>
              </p>
              <p className="mb-3">
                <strong className="text-secondary">Donor:</strong>
                <br />
                <span className="text-muted">
                  {selectedGrant?.donor_detail?.name}
                </span>
              </p>
              <p className="mb-3">
                <strong className="text-secondary">Amount:</strong>
                <br />
                <span className="text-muted font-weight-bold">
                  ${selectedGrant?.amount}
                </span>
              </p>
              <p className="mb-3">
                <strong className="text-secondary">Reporting Time</strong>
                <br />
                <span className="text-muted">
                  {selectedGrant?.reporting_time}
                </span>
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-3">
                <strong className="text-secondary">Start Date:</strong>
                <br />
                <span className="text-muted">{selectedGrant?.start_date}</span>
              </p>
              <p className="mb-3">
                <strong className="text-secondary">End Date:</strong>
                <br />
                <span className="text-muted">{selectedGrant?.end_date}</span>
              </p>
              <p className="mb-3">
                <strong className="text-secondary">
                  Application Deadline:
                </strong>
                <br />
                <span className="text-muted">
                  {selectedGrant?.application_deadline}
                </span>
              </p>
              <p className="mb-3">
                <strong className="text-secondary">Eligibility Criteria</strong>
                <br />
                <span className="text-muted">
                  {selectedGrant?.eligibility_details ? (
                    <ul className="list-unstyled">
                      {selectedGrant.eligibility_details
                        .split(";")
                        .map((detail, index) => (
                          <li key={index}>- {detail.trim()}</li>
                        ))}
                    </ul>
                  ) : (
                    "No eligibility criteria available."
                  )}
                </span>
              </p>

              <p className="mb-3">
                <strong className="text-secondary">
                  Key Performance Indicators
                </strong>
                <br />
                <span className="text-muted">
                  {selectedGrant?.kpis ? (
                    <ul className="list-unstyled">
                      {selectedGrant.kpis.split(";").map((kpi, index) => (
                        <li key={index}>- {kpi.trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    "No KPIs available."
                  )}
                </span>
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="primary"
            onClick={handleApplyNow}
            disabled={loading}
            className="px-4 py-2 rounded-pill"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Checking...
              </>
            ) : (
              "Apply Now"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LandingPage;
