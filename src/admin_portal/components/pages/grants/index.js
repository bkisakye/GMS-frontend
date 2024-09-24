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
  const { handleLoading } = useLoadingHandler();

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
        setFilteredGrants(data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
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
      try {
        let response;
        if (isEditing) {
          // Update existing grant
          response = await fetchWithAuth(
            `/api/grants/update-grant/${updatedGrant.id}/`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedGrant),
            }
          );
        } else {
          // Add new grant
          response = await fetchWithAuth("/api/grants/grants/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGrant),
          });
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newGrantData = await response.json();
        if (isEditing) {
          setGrants((prevGrants) =>
            prevGrants.map((grant) =>
              grant.id === newGrantData.id ? newGrantData : grant
            )
          );
          setFilteredGrants((prevFilteredGrants) =>
            prevFilteredGrants.map((grant) =>
              grant.id === newGrantData.id ? newGrantData : grant
            )
          );
          toast.success("Grant updated successfully!");
        } else {
          setGrants((prevGrants) => [...prevGrants, newGrantData]);
          setFilteredGrants((prevFilteredGrants) => [
            ...prevFilteredGrants,
            newGrantData,
          ]);
          toast.success("Grant created successfully!");
        }

        handleCloseFormModal();
        fetchGrants(); // Refresh the grants list
      } catch (error) {
        toast.error(error.message);
      }
    });
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
              <td colSpan="7" className="text-center">
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
          <Modal.Title>{isEditing ? "Edit Grant" : "Add Grant"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GrantsForm grant={selectedGrant} onSubmit={handleGrantSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GrantsTable;
