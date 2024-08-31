import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { AiFillEye } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const GrantCloseOut = () => {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/grants/all-requests/`
        );
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          console.error(
            "Error fetching grant closeout requests:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching grant closeout requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getFilteredRequests = () => {
    const query = searchQuery.toLowerCase();
    return requests.filter(
      (request) =>
        request.request_type
          .toLowerCase()
          .includes(query) 
    );
  };


  const filteredRequests = getFilteredRequests();

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Grant Closeout Requests</h1>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by request"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Requests</th>
                  <th>Account Holder</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.request_type}</td>
                      <td>{ request.grant_closeout?.grant_account?.account_holder?.organisation_name || request.modifications?.grant_account?.account_holder?.organisation_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GrantCloseOut;
