import React, { Component } from "react";
import { fetchWithAuth } from "../../../../utils/helpers"; // Ensure this path is correct

class ReviewApplicationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: "",
      status: "",
      comments: "",
      submitting: false,
      error: null,
    };
  }

  handleClickOutside = (event) => {
    if (event.target.id === "modal-backdrop") {
      this.props.onClose();
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { score, status, comments } = this.state;
    const { applicationId, reviewId, reviewerId } = this.props; // Ensure applicationId, reviewId, and reviewerId are passed as props

    if (!score || !status) {
      this.setState({ error: "Please fill out all required fields." });
      return;
    }

    this.setState({ submitting: true, error: null });

    const reviewData = {
      score,
      status,
      comments,
      application: applicationId,
      reviewer: reviewerId, // Add the reviewer ID here
    };

    const url = reviewId
      ? `/api/grants/reviews/${reviewId}/`
      : `/api/grants/reviews/`;
    const method = reviewId ? "PUT" : "POST";

    console.log("Review Data:", reviewData);
    console.log("Request URL:", url);

    await fetchWithAuth(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || "Failed to submit review.");
        }
      })
      .then((data) => {
        this.props.onSubmit(data);
        this.props.onClose();
      })
      .catch((error) => this.setState({ error: error.message }))
      .finally(() => this.setState({ submitting: false }));
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { isOpen } = this.props;
    const { score, status, comments, submitting, error } = this.state;

    if (!isOpen) return null;

    return (
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        id="modal-backdrop"
        onClick={this.handleClickOutside}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Review Grant Application</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={this.props.onClose}
              ></button>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    className="form-select"
                    value={status}
                    onChange={this.handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="score" className="form-label">
                    Score
                  </label>
                  <input
                    name="score"
                    id="score"
                    type="number"
                    placeholder="Score"
                    className="form-control"
                    value={score}
                    onChange={this.handleChange}
                    required
                    min="0"
                    max="100"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="comments" className="form-label">
                    Comments
                  </label>
                  <textarea
                    name="comments"
                    id="comments"
                    placeholder="Comments"
                    className="form-control"
                    value={comments}
                    onChange={this.handleChange}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.props.onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewApplicationModal;
