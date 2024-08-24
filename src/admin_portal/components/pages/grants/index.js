import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import GrantDetailsModal from "./grantdetails";
import GrantsForm from "./grant_form";
import { AiFillEye } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const GrantsTable = () => {
  const [grants, setGrants] = useState([]);
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrantId, setSelectedGrantId] = useState(null);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(false);

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/list/?page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGrants(data.results);
        setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
        setFilteredGrants(data.results); // Initialize filteredGrants
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, [currentPage]);

  useEffect(() => {
    setFilteredGrants(
      grants.filter((grant) =>
        grant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, grants]);

  const handleAddGrant = () => {
    setIsAddGrantModalOpen(true);
  };

  const handleCloseAddGrantModal = () => {
    setIsAddGrantModalOpen(false);
  };

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

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Inline styles
  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    margin: "0 5px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  };

  const disabledButtonStyle = {
    backgroundColor: "#c0c0c0",
    color: "#6c757d",
    cursor: "not-allowed",
  };

  const paginationNumbersStyle = {
    display: "flex",
    alignItems: "center",
    margin: "0 10px",
  };

  const paginationNumberStyle = (isActive) => ({
    backgroundColor: isActive ? "#0056b3" : "#e9ecef",
    color: isActive ? "white" : "#495057",
    border: isActive ? "1px solid #0056b3" : "1px solid #dee2e6",
    padding: "5px 15px",
    margin: "0 5px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: isActive ? "bold" : "normal",
  });

  const arrowStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "50%",
    margin: "0 5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  };

  const disabledArrowStyle = {
    backgroundColor: "#c0c0c0",
    color: "#6c757d",
    cursor: "not-allowed",
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={handleAddGrant}>
          Add New Grant
        </Button>
        <InputGroup style={{ width: "300px" }}>
          <Form.Control
            type="text"
            placeholder="Search grants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table striped bordered hover responsive variant="light">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGrants.length > 0 ? (
            filteredGrants.map((grant) => (
              <tr key={grant.id}>
                <td>{grant.name}</td>
                <td>{grant.description}</td>
                <td>{grant.start_date}</td>
                <td>{grant.end_date}</td>
                <td>{grant.amount}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => handleViewDetails(grant)}
                    style={buttonStyle}
                  >
                    <AiFillEye />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No grants available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <button
          style={{
            ...arrowStyle,
            ...(currentPage === 1 ? disabledArrowStyle : {}),
          }}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        <div style={paginationNumbersStyle}>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              style={paginationNumberStyle(currentPage === page + 1)}
              onClick={() => goToPage(page + 1)}
            >
              {page + 1}
            </button>
          ))}
        </div>
        <button
          style={{
            ...arrowStyle,
            ...(currentPage === totalPages ? disabledArrowStyle : {}),
          }}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>

      {isDetailsModalOpen && (
        <GrantDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          grant={selectedGrant}
        />
      )}
      <Modal
        show={isAddGrantModalOpen}
        onHide={handleCloseAddGrantModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Grant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GrantsForm />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GrantsTable;
