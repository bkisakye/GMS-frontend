import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState([]);
  const authToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        const response = await fetchWithAuth("/api/notifications/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch notifications", response);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error("Unexpected data format:", data);
          setError("Unexpected data format");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Error fetching notifications");
      }
    };
    fetchNotifications();
  }, []);

  const handleApprove = async (id, email) => {
    try {
      console.log("Approving notification with ID and email:", id, email);
      const response = await fetchWithAuth(
        `/api/notifications/${id}/approve/`,
        {
          method: "PATCH",
          body: { email },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        console.error("Failed to approve notification", responseData);
        throw new Error(responseData.error || "Failed to approve notification");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, status: "approved", is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error approving notification:", error);
      setError("Error approving notification");
    }
  };

  const handleDecline = async (id, email) => {
    try {
      const response = await fetchWithAuth(
        `/api/notifications/${id}/decline/`,
        {
          method: "PATCH",
          body: { email },
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        console.error("Failed to decline notification", responseData);
        throw new Error(responseData.error || "Failed to decline notification");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, status: "declined", is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error declining notification:", error);
      setError("Error declining notification");
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <p>{notification.text}</p>
            {notification.notification_type === "admin" &&
              notification.status === "pending" && (
                <>
                  <button
                    onClick={() =>
                      handleApprove(notification.id, notification.user.email)
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleDecline(notification.id, notification.user.email)
                    }
                  >
                    Decline
                  </button>
                </>
              )}
            {notification.notification_type === "admin" &&
              notification.status !== "pending" && (
                <p>
                  Status:{" "}
                  {notification.status.charAt(0).toUpperCase() +
                    notification.status.slice(1)}
                </p>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
