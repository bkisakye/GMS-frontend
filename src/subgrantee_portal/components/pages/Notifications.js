import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bell, User, Check, X, MessageSquare, Upload } from "lucide-react";
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
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleDecision = async (notificationId, action) => {
    try {
      // Send the action to the backend
      const response = await fetchWithAuth(
        `/api/notifications/${notificationId}/review-action/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, is_read: true, text: action }), // Mark as read in the request body
        }
      );

      if (response.ok) {
        // Update the local state to remove the notification
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


  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Notifications</h2>
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
                      <small>{notification.user[0].organisation_name}</small>
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

                {isNegotiating && (
                  <div className="mt-4">
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-success me-2 d-flex align-items-center"
                        onClick={() =>
                          handleDecision(notification.id, "approve")
                        }
                        aria-label="Approve"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        className="btn btn-danger d-flex align-items-center"
                        onClick={() =>
                          handleDecision(notification.id, "decline")
                        }
                        aria-label="Decline"
                      >
                        <X size={20} />
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
