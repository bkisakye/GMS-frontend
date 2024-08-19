import React, { Component } from "react";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import SubgranteeModal from "./SubgranteeModal";

class Subgrantees extends Component {
  state = {
    subgrantees_list: [],
    selectedSubgrantee: null,
    showModal: false,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchSubgrantees();
  }

  fetchSubgrantees() {
    fetch("http://127.0.0.1:8000/api/profiles/")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => this.setState({ subgrantees_list: data, loading: false }))
      .catch((error) => this.setState({ error, loading: false }));
  }

  handleViewProfile = (subgranteeId) => {
    fetch(`http://127.0.0.1:8000/api/profiles/${subgranteeId}/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch subgrantee details.");
      })
      .then((data) => {
        this.setState({ selectedSubgrantee: data, showModal: true });
      })
      .catch((error) => {
        console.error("Error fetching subgrantee details:", error);
        this.setState({ error });
      });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedSubgrantee: null });
  };

  render() {
    const { loading, error, subgrantees_list, showModal, selectedSubgrantee } =
      this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Subgrantees List</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Organization Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">District</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Contact Person</th>
                    <th scope="col">Secondary Contact</th>
                    <th scope="col">Category</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subgrantees_list.map((subgrantee) => (
                    <tr key={subgrantee.id}>
                      <td>{subgrantee.organizationName}</td>
                      <td>{subgrantee.organizationAddress}</td>
                      <td>{subgrantee.district}</td>
                      <td>{subgrantee.organizationPhoneNumber}</td>
                      <td>{subgrantee.contactPerson}</td>
                      <td>{subgrantee.secondaryContact}</td>
                      <td>{subgrantee.category}</td>
                      <td className="text-nowrap">
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <AiFillEdit /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => this.handleViewProfile(subgrantee.id)}
                        >
                          <AiFillEye /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Render the modal */}
        {selectedSubgrantee && (
          <SubgranteeModal
            show={showModal}
            onHide={this.handleCloseModal}
            subgrantee={selectedSubgrantee}
          />
        )}
      </div>
    );
  }
}

export default Subgrantees;
