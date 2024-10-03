import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bell, User, Check, X, MessageSquare, Upload } from "lucide-react";

import "react-toastify/dist/ReactToastify.css";
import { fetchWithAuth } from "../../../../utils/helpers";

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
      }
    };

    fetchNotifications();
  }, [userId]);

const handleNotificationClick = async (notification) => {
  try {
    // Mark the notification as read
    const response = await fetchWithAuth(
      `/api/notifications/${notification.id}/read/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }), // Mark as read
      }
    );

    if (response.ok) {
      // After marking as read, remove the notification from the state
      setNotifications(notifications.filter((n) => n.id !== notification.id));

      // Navigate based on notification category
      switch (notification.notification_category) {
        case "requests":
          navigate("/admin/reports");
          break;
        case "messages":
          navigate("/admin/messages");
          break;
        case "status_report_submitted":
          navigate("/admin/progress-reports");
          break;
        case "grant_application":
          navigate("/admin/applications-list");
          break;
        case "new_subgrantee":
          navigate("/admin/subgrantee-registration");
          break;
        case "requests":
          navigate("/admin/closeout-requests");
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


  return (
    <div className="container py-5">
      {notifications.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <Bell className="me-2" />
          No unread notifications to display.
        </div>
      ) : (
        notifications.map((notification) => {
          const isNegotiating =
            notification.notification_category === "grant_review" &&
            notification.review?.status === "negotiate";

          return (
            <div
              key={notification.id}
              className={`card mb-4 shadow ${isNegotiating ? "bg-light" : ""}`}
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="bg-white rounded-circle p-2 me-3">
                      <User size={24} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="mb-0">
                        {notification.user[0].fname}{" "}
                        {notification.user[0].lname}
                      </h5>
                      <small>{notification.user[0].email}</small>
                    </div>
                  </div>
                  <span>
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="card-text lead">
                  <b>{notification.text}</b>
                </p>
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
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notifications;
