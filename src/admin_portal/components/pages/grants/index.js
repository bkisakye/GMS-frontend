import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import GrantDetailsModal from "./grantdetails";
import GrantsForm from "./grant_form";
import { AiFillEye, AiFillEdit } from "react-icons/ai";
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
import { toast } from "react-toastify";
import useLoadingHandler from "../../../hooks/useLoadingHandler";

const GrantsTable = () => {
  const [grants, setGrants] = useState([]);
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { loadingStates, handleLoading } = useLoadingHandler();

  useEffect(() => {
    fetchGrants();
  }, [currentPage]);

  useEffect(() => {
    setFilteredGrants(
      grants.filter((grant) =>
        grant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, grants]);

  const fetchGrants = async () => {
    await handleLoading("fetchGrants", async () => {
      const response = await fetchWithAuth(
        `/api/grants/list/?page=${currentPage}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGrants(data.results);
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
      setFilteredGrants(data.results);
    });
  };

  const handleAddGrant = () => {
    setIsEditing(false);
    setSelectedGrant(null);
    setIsFormModalOpen(true);
  };

  const handleEditGrant = (grant) => {
    setIsEditing(true);
    setSelectedGrant(grant);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedGrant(null);
    setIsEditing(false);
  };

  const handleViewDetails = (grant) => {
    setSelectedGrant(grant);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedGrant(null);
  };

  const handleGrantSubmit = async (updatedGrant) => {
    await handleLoading("handleGrantSubmit", async () => {
      if (isEditing) {
        // Update existing grant
        const response = await fetchWithAuth(
          `/api/grants/update-grant/${updatedGrant.id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGrant),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedGrantData = await response.json();
        setGrants(
          grants.map((grant) =>
            grant.id === updatedGrantData.id ? updatedGrantData : grant
          )
        );
        setFilteredGrants(
          filteredGrants.map((grant) =>
            grant.id === updatedGrantData.id ? updatedGrantData : grant
          )
        );
        toast.success("Grant updated successfully!");
      } else {
        // Add new grant
        const response = await fetchWithAuth("/api/grants/grants/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedGrant),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newGrantData = await response.json();
        setGrants([...grants, newGrantData]);
        setFilteredGrants([...filteredGrants, newGrantData]);
        toast.success("Grant created successfully!");
      }

      handleCloseFormModal();
      fetchGrants(); // Refresh the grants list
    });
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
          Add Funding Opportunity
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
            <th>Open</th>
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
                <td>{grant.is_open ? "✓" : "✗"}</td>

                <td>
                  <Button
                    variant="info"
                    onClick={() => handleViewDetails(grant)}
                    className="me-2"
                  >
                    <AiFillEye />
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => handleEditGrant(grant)}
                  >
                    <AiFillEdit />
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

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Button
          variant="outline-primary"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </Button>
        <span className="mx-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline-primary"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </Button>
      </div>

      {/* Grant Details Modal */}
      {isDetailsModalOpen && (
        <GrantDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          grant={selectedGrant}
        />
      )}

      {/* Grant Form Modal */}
      <Modal show={isFormModalOpen} onHide={handleCloseFormModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GrantsForm grant={selectedGrant} onSubmit={handleGrantSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GrantsTable;
