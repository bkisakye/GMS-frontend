import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  User,
  Check,
  X,
  MessageSquare,
  Upload,
  FileText,
  DollarSign,
  Clipboard,
  Calendar,
} from "lucide-react";
import { fetchWithAuth } from "../../../utils/helpers";
import "react-toastify/dist/ReactToastify.css";

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
        toast.error("Failed to fetch notifications");
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
          default:
            break;
        }
        window.location.reload();
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
    switch (category) {
      case "financial_report":
        return <FileText size={24} className="text-primary" />;
      case "messages":
        return <MessageSquare size={24} className="text-info" />;
      case "new_grant":
        return <Clipboard size={24} className="text-success" />;
      case "disbursement_received":
        return <DollarSign size={24} className="text-warning" />;
      case "grant_submission":
        return <Upload size={24} className="text-secondary" />;
      case "status_report_reviewed":
        return <Check size={24} className="text-success" />;
      case "request_review":
        return <Clipboard size={24} className="text-primary" />;
      case "status_report_due":
        return <Calendar size={24} className="text-danger" />;
      default:
        return <Bell size={24} className="text-secondary" />;
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Notifications</h2>
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
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle p-2 me-3 bg-primary bg-opacity-10">
                      {getNotificationIcon(notification.notification_category)}
                    </div>
                    <div>
                      <h5 className="mb-0">
                        {notification.user[0].fname}{" "}
                        {notification.user[0].lname}
                      </h5>
                      <small className="text-muted">
                        {notification.user[0].organisation_name}
                      </small>
                    </div>
                  </div>
                  <span className="text-muted">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="card-text lead">{notification.text}</p>
                {notification.review?.comments && (
                  <div className="d-flex align-items-center text-muted mb-3">
                    <MessageSquare size={16} className="me-2" />
                    <span>{notification.review.comments}</span>
                  </div>
                )}
                {notification.uploads?.uploads && (
                  <div className="d-flex align-items-center text-muted mb-3">
                    <Upload size={16} className="me-2" />
                    <span>{notification.uploads.uploads}</span>
                  </div>
                )}

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
