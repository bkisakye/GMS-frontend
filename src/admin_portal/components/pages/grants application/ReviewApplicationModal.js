import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { toast } from "react-toastify";
import useLoadingHandler from "../../../hooks/useLoadingHandler";

const ReviewApplicationModal = ({
  isOpen,
  applicationId,
  reviewerId,
  reviewId: initialReviewId,
  onClose,
}) => {
  const [score, setScore] = useState("");
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reviewId, setReviewId] = useState(initialReviewId || null);
  const [files, setFiles] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  const { loadingStates, handleLoading } = useLoadingHandler();

  const handleClickOutside = (event) => {
    if (event.target.id === "modal-backdrop") {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!score || !status) {
      setError("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const reviewData = {
      score,
      status,
      comments,
      application: applicationId,
      reviewer: reviewerId,
    };

    const url = reviewId
      ? `/api/grants/reviews/${reviewId}/`
      : `/api/grants/reviews/`;
    const method = reviewId ? "PATCH" : "POST";

    await handleLoading("handleSubmit", async () => {
      const response = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || "Failed to submit review.");
      }

      const data = await response.json();
      console.log("API response data:", data);

   

      if (!reviewId) {
        await fetchReview();
      }

      if (window.confirm("Would you like to upload supporting files?")) {
        setShowUploadModal(true);
      } else {
        toast.success("Review submitted successfully!");
        onClose();
        window.location.reload();
      }
    });
  };

  const fetchReview = async () => {
    await handleLoading("fetchReview", async () => {
      const response = await fetchWithAuth(
        `/api/grants/review-application/${applicationId}/`
      );
      const data = await response.json();
      setReviewId(data.id);
      setScore(data.score !== null ? data.score.toString() : "");
      setStatus(data.status || "");
      setComments(data.comments || "");
    });
  };

  useEffect(() => {
    if (isOpen && applicationId && reviewId === null) {
      fetchReview();
    }
  }, [isOpen, applicationId, reviewId]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    console.log("Files selected:", e.target.files);
  };

  const handleFileUpload = async () => {
    if (!reviewId) {
      toast.error(
        "Review ID is missing. Please try submitting the review again."
      );
      return;
    }

    await handleLoading("handleFileUpload", async () => {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("uploads", file));
      console.log("FormData contents:", Array.from(formData.entries()));

      const url = `http://127.0.0.1:8000/api/grants/review-upload/${reviewId}/`;
      const token = localStorage.getItem("accessToken");
      const uploadResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Don't set Content-Type here; FormData will handle it
      });

      if (uploadResponse.ok) {
        toast.success("Review Submitted Successfully");
        setShowUploadModal(false);
        window.location.reload();
      } else {
        console.error("Error uploading files:", await uploadResponse.json());
        toast.error("Error uploading files");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      id="modal-backdrop"
      onClick={handleClickOutside}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg rounded">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title">
              {showUploadModal
                ? "Upload Supporting Files"
                : "Review Grant Application"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          {showUploadModal ? (
            <>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label htmlFor="files" className="form-label">
                    Select Files
                  </label>
                  <input
                    type="file"
                    id="files"
                    name="files"
                    className="form-control"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
                {files.length > 0 && (
                  <div className="mb-3">
                    <p>Selected files:</p>
                    <ul>
                      {Array.from(files).map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-footer border-top-0">
                <button className="btn btn-success" onClick={handleFileUpload} disabled={loadingStates.handleFileUpload}>
                  {loadingStates.handleFileUpload ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    "Upload Files"
                  )}
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
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
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                    <option value="negotiate">Negotiate</option>
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
                    placeholder="Score (0-10)"
                    className="form-control"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    required
                    min="0"
                    max="10"
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
                    onChange={(e) => setComments(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loadingStates.handleSubmit}
                  >
                    {loadingStates.handleSubmit ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      "Submit"
                    )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewApplicationModal;
