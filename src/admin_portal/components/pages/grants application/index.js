import React, { Component } from "react";
import PropTypes from "prop-types";
import { AiFillEye, AiFillStar } from "react-icons/ai";
import ViewApplicationModal from "./ViewApplicationModal";
import ReviewApplicationModal from "./ReviewApplicationModal";
import { fetchWithAuth } from "../../../../utils/helpers";
import { Spinner, Button, Table, Form } from "react-bootstrap";
import { format } from "date-fns";
import useLoadingHandler from "../../../hooks/useLoadingHandler";

export default class GrantsApplication extends Component {
  static propTypes = {
    currentUserId: PropTypes.number,
  };

  state = {
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
    searchQuery: "",
  };

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
    const existingReviewId = selectedApplication?.review?.id || null;
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

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  fetchApplications = () => {
    fetchWithAuth("/api/grants/all-applications/")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => this.setState({ applications: data, loading: false }))
      .catch((error) => this.setState({ error, loading: false }));
  };

  getFilteredApplications = () => {
    const { applications, searchQuery } = this.state;
    const searchLower = searchQuery.toLowerCase();

    return applications.filter((application) => {
      const organisationName = application.subgrantee?.organisation_name || "";
      const grantName = application.grant?.name || "";
      const status = application.status || "";

      return (
        organisationName.toLowerCase().includes(searchLower) ||
        grantName.toLowerCase().includes(searchLower) ||
        status.toLowerCase().includes(searchLower)
      );
    });
  };

  render() {
    const {
      isModalOpen,
      loading,
      isViewModalOpen,
      error,
      selectedApplicationId,
      grantId,
      subgranteeId,
      existingReviewId,
      searchQuery,
    } = this.state;

    const currentUserId = this.props.currentUserId || 1;
    const filteredApplications = this.getFilteredApplications();

    if (loading)
      return (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      );
    if (error)
      return <div className="alert alert-danger">Error: {error.message}</div>;

    return (
      <div className="container mt-4">
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search by Subgrantee Name, Grant Name, or Status"
            value={searchQuery}
            onChange={this.handleSearchChange}
          />
        </Form.Group>
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Grant Applications List</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>Subgrantee </th>
                    <th>Grant</th>
                    <th>Application Deadline</th>
                    <th>Submission Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <tr key={application.id}>
                        <td>
                          {application.subgrantee?.organisation_name || "N/A"}
                        </td>
                        <td>{application.grant?.name || "N/A"}</td>
                        <td>
                          {format(
                            new Date(application.grant?.application_deadline),
                            "dd MMM yyyy"
                          )}
                        </td>
                        <td>
                          {format(
                            new Date(application.date_submitted),
                            "dd MMM yyyy"
                          )}
                        </td>
                        <td>{application.status}</td>
                        <td className="text-nowrap">
                          <Button
                            variant="outline-primary"
                            className="me-2"
                            onClick={() =>
                              this.handleOpenViewModal(
                                application.id,
                                application.grant?.id,
                                application.subgrantee?.id
                              )
                            }
                            title="View Application"
                          >
                            <AiFillEye />
                          </Button>
                          {application.status === "under_review" && (
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                this.handleOpenModal(application.id)
                              }
                              title="Review Application"
                            >
                              <AiFillStar />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
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
