import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Card,
  Alert,
  Form,
  InputGroup,
  Button,
  Modal,

} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { fetchWithAuth } from "../../../../utils/helpers";

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [newDonor, setNewDonor] = useState({ name: "" });

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    setFilteredDonors(
      donors.filter((donor) =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, donors]);

  const fetchDonors = async () => {
    try {
      const response = await fetchWithAuth("/api/grants/donors/");
      if (!response.ok) {
        throw new Error("Failed to fetch donor data");
      }
      const data = await response.json();
      setDonors(data || []); 
    } catch (error) {
      console.error("Error fetching donor data:", error);
      setError("Failed to load donor data");
      setDonors([]);
    }
  };

  const handleEditClick = (donor) => {
    setSelectedDonor(donor);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (donorId) => {
    try {
      const response = await fetchWithAuth(`/api/grants/donors/${donorId}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete donor");
      }
      setDonors(donors.filter((donor) => donor.id !== donorId));
      setFilteredDonors(filteredDonors.filter((donor) => donor.id !== donorId));
    } catch (error) {
      console.error("Error deleting donor:", error);
      setError("Failed to delete donor");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedDonor(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/donors/${selectedDonor.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedDonor),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update donor");
      }
      const data = await response.json();
      setDonors(donors.map((donor) => (donor.id === data.id ? data : donor)));
      setFilteredDonors(
        filteredDonors.map((donor) => (donor.id === data.id ? data : donor))
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating donor:", error);
      setError("Failed to update donor");
    }
  };

  const handleAddDonor = async () => {
    try {
      const response = await fetchWithAuth(`/api/grants/donors/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDonor),
      });
      if (!response.ok) {
        throw new Error("Failed to add donor");
      }
      const data = await response.json();
      setDonors([...donors, data]);
      setFilteredDonors([...filteredDonors, data]);
      setNewDonor({ name: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding donor:", error);
      setError("Failed to add donor");
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewDonor({ name: "" });
  };

  return (
    <Container className="my-4">
      <Button
        style={{ textAlign: "right" }}
        variant="primary"
        onClick={() => setShowAddModal(true)}
        className="mb-3"
      >
        Add New Donor
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Header>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search donors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setSearchTerm("")}
            >
              Clear
            </Button>
          </InputGroup>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive variant="light">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor) => (
                  <tr key={donor.id}>
                    <td>{donor.id}</td>
                    <td>{donor.name}</td>
                    <td>{donor.details}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEditClick(donor)}
                        className="me-2"
                      >
                        <AiFillEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(donor.id)}
                      >
                        <AiFillDelete />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No donors available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Donor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDonor && (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedDonor.name}
                  onChange={(e) =>
                    setSelectedDonor({ ...selectedDonor, name: e.target.value })
                  }
                />
                <Form.Label>Details</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedDonor.details}
                  onChange={(e) =>
                    setSelectedDonor({ ...selectedDonor, details: e.target.value })
                  }
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

     
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Donor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newDonor.name}
              onChange={(e) =>
                setNewDonor({ ...newDonor, name: e.target.value })
              }
            />
            <Form.Label>Details</Form.Label>
            <Form.Control
              type="text"
              value={newDonor.details}
              onChange={(e) =>
                setNewDonor({ ...newDonor, details: e.target.value })
            }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddDonor}>
            Add Donor
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DonorsPage;
