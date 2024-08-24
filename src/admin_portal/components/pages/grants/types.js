import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  InputGroup,
  FormControl,
  Modal,
  Alert,
  Form,
} from "react-bootstrap";
import { fetchWithAuth } from "../../../../utils/helpers";
import { AiFillEdit, AiFillDelete, AiOutlineSearch } from "react-icons/ai";

const GrantTypes = () => {
  const [grantTypes, setGrantTypes] = useState([]);
  const [filteredGrantTypes, setFilteredGrantTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGrantType, setSelectedGrantType] = useState(null);
  const [newGrantType, setNewGrantType] = useState({
    name: "",
    details: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGrantTypes();
  }, []);

  useEffect(() => {
    setFilteredGrantTypes(
      grantTypes.filter((gt) =>
        gt.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, grantTypes]);

  const fetchGrantTypes = async () => {
    try {
      const response = await fetchWithAuth(`/api/grants/grant-types/`);
      if (!response.ok) throw new Error("Failed to fetch Grant Types");
      const data = await response.json();
      setGrantTypes(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/grants/grant-types/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        setGrantTypes(grantTypes.filter((gt) => gt.id !== id));
      } else {
        throw new Error("Failed to delete Grant Type");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleOpenEditModal = (grantType) => {
    setSelectedGrantType(grantType);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleAddGrantType = async () => {
    try {
      const response = await fetchWithAuth("/api/grants/grant-types/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGrantType),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to add Grant Type");
      }
      const data = await response.json();
      setGrantTypes([...grantTypes, data]);
      handleCloseAddModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditGrantType = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/grants/grant-types/${selectedGrantType.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedGrantType),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setGrantTypes(
          grantTypes.map((gt) => (gt.id === data.id ? { ...gt, ...data } : gt))
        );
        handleCloseEditModal();
      } else {
        throw new Error("Failed to update Grant Type");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={handleOpenAddModal} style={{ "textAlign": "right" }}>
          Add New Grant Type
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Grant Types</h5>
          <InputGroup className="w-50">
            <FormControl
              placeholder="Search Grant Types"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <InputGroup.Text>
              <AiOutlineSearch />
            </InputGroup.Text>
          </InputGroup>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrantTypes.length > 0 ? (
                  filteredGrantTypes.map((gt) => (
                    <tr key={gt.id}>
                      <td>{gt.name}</td>
                      <td>{gt.details}</td>
                      <td className="text-nowrap">
                        <Button
                          variant="warning"
                          onClick={() => handleOpenEditModal(gt)}
                          className="me-2"
                        >
                          <AiFillEdit />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(gt.id)}
                        >
                          <AiFillDelete />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Grant Types found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Grant Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newGrantType.name}
                onChange={(e) =>
                  setNewGrantType({ ...newGrantType, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newGrantType.details}
                onChange={(e) =>
                  setNewGrantType({ ...newGrantType, details: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddGrantType}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Grant Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedGrantType?.name || ""}
                onChange={(e) =>
                  setSelectedGrantType({
                    ...selectedGrantType,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedGrantType?.details || ""}
                onChange={(e) =>
                  setSelectedGrantType({
                    ...selectedGrantType,
                    details: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditGrantType}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GrantTypes;
