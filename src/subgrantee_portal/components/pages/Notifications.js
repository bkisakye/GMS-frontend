import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  MessageSquare,
  Upload,
  Check,
  FileText,
  DollarSign,
  Clipboard,
  Calendar,
  X,
} from "lucide-react";
import { fetchWithAuth } from "../../../utils/helpers";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaComment } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetchWithAuth(`/api/notifications/${userId}/`);
        if (!response.ok) {
          throw new Error("Error fetching notifications");
        }
        const data = await response.json();
        const unreadNotifications = data.filter(
          (notification) => !notification.is_read
        );
        setNotifications(unreadNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // toast.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleDecision = async (notificationId, action) => {
    try {
      const response = await fetchWithAuth(
        `/api/notifications/${notificationId}/review-action/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, is_read: true }),
        }
      );

      if (response.ok) {
        setNotifications(notifications.filter((n) => n.id !== notificationId));

        if (action === "approve") {
          toast.success("Please go ahead and update your application form");
          navigate("/applications");
        } else {
          toast.info("The notification has been declined");
        }
      } else {
        console.error("Failed to submit decision");
        toast.error("Error submitting decision");
      }
    } catch (error) {
      console.error("Error submitting decision:", error);
      toast.error("Error submitting decision");
    }
  };

  const handleUploadClick = (e, uploadPath) => {
    e.stopPropagation();
    // Assuming the backend server is running on the same host but different port
    const backendUrl = `${window.location.protocol}//${window.location.hostname}:8000`;
    const fullUrl = `${backendUrl}${uploadPath}`;
    window.open(fullUrl, "_blank");
  };

  const handleNotificationClick = async (notification) => {
    try {
      const response = await fetchWithAuth(
        `/api/notifications/${notification.id}/read/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_read: true }),
        }
      );

      if (response.ok) {
        setNotifications(notifications.filter((n) => n.id !== notification.id));

        switch (notification.notification_category) {
          case "financial_report":
            navigate("/reports");
            break;
          case "messages":
            navigate("/messages");
            break;
          case "new_grant":
            navigate("");
            break;
          case "disbursement_received":
            navigate("/budget");
            break;
          case "grant_submission":
            navigate("/applications");
            break;
          case "status_report_reviewed":
            navigate("/reports");
            break;
          case "request_review":
            navigate("/requests");
            break;
          case "status_report_due":
            navigate("/grant-accounts");
            break;
          case "grant_review":
            navigate("/budget");
            break;
          default:
            break;
        }
      } else {
        console.error("Failed to mark notification as read");
        toast.error("Error marking notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error marking notification as read");
    }
  };

  const getNotificationIcon = (category) => {
    const iconClasses = "me-2";
    switch (category) {
      case "financial_report":
        return <FileText size={24} className={`${iconClasses} text-primary`} />;
      case "messages":
        return (
          <MessageSquare size={24} className={`${iconClasses} text-info`} />
        );
      case "new_grant":
        return (
          <Clipboard size={24} className={`${iconClasses} text-success`} />
        );
      case "disbursement_received":
        return (
          <DollarSign size={24} className={`${iconClasses} text-warning`} />
        );
      case "grant_submission":
        return <Upload size={24} className={`${iconClasses} text-secondary`} />;
      case "status_report_reviewed":
        return <Check size={24} className={`${iconClasses} text-success`} />;
      case "request_review":
        return (
          <Clipboard size={24} className={`${iconClasses} text-primary`} />
        );
      case "status_report_due":
        return <Calendar size={24} className={`${iconClasses} text-danger`} />;
      default:
        return <Bell size={24} className={`${iconClasses} text-secondary`} />;
    }
  };

  const getCategory = (notification) => {
    switch (notification.notification_category) {
      case "financial_report":
        return "Financial Report";
      case "messages":
        return "Messages";
      case "new_grant":
        return "New Funding Opportunity";
      case "disbursement_received":
        return "Disbursement Received";
      case "grant_submission":
        return "Funding Opportunity Application Submission";
      case "status_report_reviewed":
        return "Progress Report Review";
      case "request_review":
        return "Request Review";
      case "status_report_due":
        return "Status Report Due";
      case "grant_review":
        return "Funding Opportunity Application Review";
      default:
        return "Notification";
    }
  };

  const getComments = (notification) => {
    if (notification.review?.comments) {
      return notification.review.comments;
    } else if (notification.requests?.comments) {
      return notification.requests.comments;
    }
    return notification.progress_report?.review_comments || null;
  };

  return (
    <div className="container py-5">
      {notifications.length === 0 ? (
        <div
          className="alert alert-info d-flex align-items-center"
          role="alert"
        >
          <Bell className="me-2" />
          <span>No unread notifications to display.</span>
        </div>
      ) : (
        notifications.map((notification) => {
          const isNegotiating =
            notification.notification_category === "grant_review" &&
            notification.review?.status === "negotiate";
          return (
            <div
              key={notification.id}
              className={`card mb-4 shadow-sm ${
                isNegotiating ? "border-warning" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-header d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                  <div className="icon-container p-2 me-3 rounded-circle bg-primary bg-opacity-10">
                    {getNotificationIcon(notification.notification_category)}
                  </div>
                  <div>
                    <h5 className="mb-0">{getCategory(notification)}</h5>
                  </div>
                </div>
                <span className="text-muted">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <strong>Notification:</strong> {notification.text}
                </p>
                {getComments(notification) && (
                  <div className="d-flex align-items-center text-muted mb-3">
                    <FaComment size={16} className="me-2" />
                    <span>
                      <strong>Comments:</strong> {getComments(notification)}
                    </span>
                  </div>
                )}
                {notification.uploads?.uploads && (
                  <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center"
                    onClick={(e) =>
                      handleUploadClick(e, notification.uploads.uploads)
                    }
                    aria-label={`Download ${notification.uploads.uploads}`}
                  >
                    <Upload size={16} className="me-2" />
                    <span>
                      {notification.uploads.uploads.length > 20
                        ? `${notification.uploads.uploads.slice(0, 17)}...`
                        : notification.uploads.uploads}
                    </span>
                  </button>
                )}
                {/* Add more fields as needed */}
                {isNegotiating && (
                  <div className="mt-4">
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-outline-success me-2 d-flex align-items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecision(notification.id, "approve");
                        }}
                        aria-label="Approve"
                      >
                        <Check size={20} className="me-2" />
                        Approve
                      </button>
                      <button
                        className="btn btn-outline-danger d-flex align-items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecision(notification.id, "decline");
                        }}
                        aria-label="Decline"
                      >
                        <X size={20} className="me-2" />
                        Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notifications;
