import React, { Component } from "react";
import { AiFillEye, AiFillSafetyCertificate, AiFillStar } from "react-icons/ai";
import ViewApplicationModal from "./ViewApplicationModal";
import ReviewApplicationModal from "./ReviewApplicationModal";
import { fetchWithAuth } from "../../../../utils/helpers";

export default class GrantsApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isViewModalOpen: false,
      isModalOpen: false,
      granteeId: null,
      selectedApplicationId: null,
      existingReviewId: null,
      grantId: null,
      subgranteeId: null,
      applications: [],
      loading: true,
      error: null,
    };
  }

  handleOpenViewModal = (applicationId, grantId, subgranteeId) => {
    this.setState({
      isViewModalOpen: true,
      selectedApplicationId: applicationId,
      grantId,
      subgranteeId,
    });
  };

  handleCloseViewModal = () => {
    this.setState({
      isViewModalOpen: false,
      selectedApplicationId: null,
      grantId: null,
      subgranteeId: null,
    });
  };

  handleOpenModal = (applicationId) => {
    const selectedApplication = this.state.applications.find(
      (app) => app.id === applicationId
    );
    const existingReviewId = selectedApplication?.review?.id || null; // Get the existing review ID if available
    const grantId = selectedApplication?.grant?.id || null;
    const subgranteeId = selectedApplication?.subgrantee?.id || null;

    this.setState({
      isModalOpen: true,
      selectedApplicationId: applicationId,
      existingReviewId,
      grantId,
      subgranteeId,
    });
  };

  handleCloseModal = () => {
    this.setState({
      isModalOpen: false,
      selectedApplicationId: null,
      existingReviewId: null,
      grantId: null,
      subgranteeId: null,
    });
  };

  handleReviewSubmit = (reviewData) => {
    console.log("Review submitted:", reviewData);

    this.fetchApplications(); // Refresh applications if needed

    this.handleCloseModal();
  };

  componentDidMount() {
    this.fetchApplications();
  }

  fetchApplications() {
    fetchWithAuth("/api/grants/grant-applications/")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => this.setState({ applications: data, loading: false }))
      .catch((error) => this.setState({ error, loading: false }));
  }

  render() {
    const {
      isModalOpen,
      loading,
      isViewModalOpen,
      error,
      applications,
      selectedApplicationId,
      grantId,
      subgranteeId,
      existingReviewId,
    } = this.state;

    const currentUserId = this.props.currentUserId || 1;

    if (loading) return <div className="text-center">Loading...</div>;
    if (error)
      return <div className="alert alert-danger">Error: {error.message}</div>;

    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Grant Applications List</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Subgrantee Name</th>
                    <th scope="col">Grant</th>
                    <th scope="col">Application Deadline</th>
                    <th scope="col">Donor</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td>
                        {application.subgrantee?.organisation_name || "N/A"}
                      </td>
                      <td>{application.grant?.name || "N/A"}</td>
                      <td>{application.grant?.application_deadline}</td>
                      <td>{application.grant?.donor?.name}</td>
                      <td>{application.status}</td>
                      <td className="text-nowrap">
                        <button
                          onClick={() =>
                            this.handleOpenViewModal(
                              application.id,
                              application.grant?.id,
                              application.subgrantee?.id
                            )
                          }
                          className="btn btn-sm btn-outline-primary"
                        >
                          <AiFillEye />
                        </button>
                        <button
                          onClick={() => this.handleOpenModal(application.id)}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <AiFillStar />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ViewApplicationModal
          isOpen={isViewModalOpen}
          onClose={this.handleCloseViewModal}
          applicationId={selectedApplicationId}
          grantId={grantId}
          subgranteeId={subgranteeId}
        />

        <ReviewApplicationModal
          isOpen={isModalOpen}
          onClose={this.handleCloseModal}
          applicationId={selectedApplicationId}
          reviewId={existingReviewId}
          reviewerId={currentUserId}
          onSubmit={this.handleReviewSubmit}
        />
      </div>
    );
  }
}
