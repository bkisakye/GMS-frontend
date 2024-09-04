import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faCheck,
  faTimes,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const SubgranteeReg = () => {
  const [subgrantees, setSubgrantees] = useState([]);
  const [filteredSubgrantees, setFilteredSubgrantees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubgrantees = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/authentication/subgrantees/`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setSubgrantees(data);
        setFilteredSubgrantees(data);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubgrantees();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredSubgrantees(
        subgrantees.filter(
          (subgrantee) =>
            subgrantee.organisation_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            `${subgrantee.fname} ${subgrantee.lname}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredSubgrantees(subgrantees);
    }
  }, [searchQuery, subgrantees]);

  const handleApproval = async (id) => {
    try {
      const subgrantee = subgrantees.find((sg) => sg.id === id);
      const response = await fetchWithAuth(
        `/api/authentication/admin/approve/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: subgrantee.email, approve: true }),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedSubgrantees = subgrantees.map((subgrantee) =>
        subgrantee.id === id ? { ...subgrantee, is_approved: true } : subgrantee
      );
      setSubgrantees(updatedSubgrantees);
      setFilteredSubgrantees(updatedSubgrantees);
      toast.success("Subgrantee approved successfully");
    } catch (error) {
      toast.error("Error approving subgrantee");
    }
  };

  const handleDecline = async (id) => {
    try {
      const subgrantee = subgrantees.find((sg) => sg.id === id);
      const response = await fetchWithAuth(
        `/api/authentication/admin/approve/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: subgrantee.email, approve: false }),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedSubgrantees = subgrantees.map((subgrantee) =>
        subgrantee.id === id
          ? { ...subgrantee, is_approved: false }
          : subgrantee
      );
      setSubgrantees(updatedSubgrantees);
      setFilteredSubgrantees(updatedSubgrantees);
      toast.success("Subgrantee declined successfully");
    } catch (error) {
      toast.error("Error declining subgrantee");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchWithAuth(
        `/api/authentication/subgrantees/${id}/delete/`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const updatedSubgrantees = subgrantees.filter(
        (subgrantee) => subgrantee.id !== id
      );
      setSubgrantees(updatedSubgrantees);
      setFilteredSubgrantees(updatedSubgrantees);
      toast.success("Subgrantee deleted successfully");
    } catch (error) {
      toast.error("Error deleting subgrantee");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Organisation Name</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubgrantees.map((subgrantee) => (
              <tr key={subgrantee.id}>
                <td>{subgrantee.organisation_name}</td>
                <td>
                  {subgrantee.fname} {subgrantee.lname}
                </td>
                <td>{subgrantee.email}</td>
                <td>{subgrantee.phone_number || "N/A"}</td>
                <td>
                  {subgrantee.is_approved === null ? (
                    <span style={{ color: "orange" }}>Not Approved</span>
                  ) : subgrantee.is_approved ? (
                    <span style={{ color: "green" }}>Approved</span>
                  ) : (
                    <span style={{ color: "red" }}>Declined</span>
                  )}
                </td>
                <td>
                  {subgrantee.is_approved === null ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApproval(subgrantee.id)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDecline(subgrantee.id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(subgrantee.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubgranteeReg;
