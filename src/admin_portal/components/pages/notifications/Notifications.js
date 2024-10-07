import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell,
  MessageSquare,
  Upload,
  FileText,
  Users,
  CheckCircle,
} from "lucide-react";

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
        toast.error("Failed to fetch notifications");
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
          body: JSON.stringify({ is_read: true }),
        }
      );

      if (response.ok) {
        // Remove the notification from state
        setNotifications(notifications.filter((n) => n.id !== notification.id));

        // Check the notification category
        switch (notification.notification_category) {
          case "messages":
            // Extract room_id from the notification's chats object
            const roomId = notification.chats.room.id; // Accessing the room ID
            console.log("room", roomId);
            navigate(`/admin/messages/${roomId}`); // Navigate to the messages page with the room ID
            break;
          case "requests":
            navigate("/admin/closeout-requests");
            break;
          case "status_report_submitted":
            navigate("/admin/progress-reports");
            break;
          case "grant_application":
            navigate("/admin/applications-list");
            break;
          case "new_subgrantee":
            navigate("/admin/subgrantee-registration-request");
            break;
          case "closeout_requests":
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

  const getNotificationIcon = (category) => {
    switch (category) {
      case "messages":
        return <MessageSquare size={24} className="text-primary" />;
      case "status_report_submitted":
        return <FileText size={24} className="text-success" />;
      case "grant_application":
        return <CheckCircle size={24} className="text-info" />;
      case "new_subgrantee":
        return <Users size={24} className="text-warning" />;
      case "requests":
        return <Upload size={24} className="text-danger" />;
      default:
        return <Bell size={24} className="text-secondary" />;
    }
  };

  const getCategory = (notification) => {
    switch (notification.notification_category) {
      case "messages":
        return "Messages";
      case "status_report_submitted":
        return "Progress Report";
      case "grant_application":
        return "Grant Application";
      case "new_subgrantee":
        return "New Subgrantee";
      case "requests":
        return "Requests";
      default:
        return "Notification";
    }
  };

  return (
    <div className="container py-5">
      {notifications.length === 0 ? (
        <div
          className="alert alert-info d-flex align-items-center justify-content-center"
          role="alert"
        >
          <Bell className="me-2" />
          <span>No unread notifications to display.</span>
        </div>
      ) : (
        <div className="list-group">
          {notifications.map((notification) => {
            const isNegotiating =
              notification.notification_category === "grant_review" &&
              notification.review?.status === "negotiate";

            return (
              <div
                key={notification.id}
                className={`list-group-item list-group-item-action ${
                  isNegotiating ? "border-warning" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="rounded-circle p-2 bg-light">
                      {getNotificationIcon(notification.notification_category)}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{getCategory(notification)}</h5>
                    <p className="mb-1">{notification.text}</p>
                    <small className="text-muted">
                      {new Date(notification.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
