import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { fetchWithAuth } from "../../utils/helpers";
import Logout from "../components/login/Logout";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeGrantsCount, setActiveGrantsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  const navigate = useNavigate(); // Use navigate hook

  const fetchGrants = async () => {
    try {
      const response = await fetchWithAuth("/api/grants/active-count/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActiveGrantsCount(data);
    } catch (error) {
      console.error("Error fetching grants:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetchWithAuth("/api/notifications/unread/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data);
      setVisibleNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchNotificationsCount = async () => {
    try {
      const response = await fetchWithAuth("/api/notifications/count/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotificationsCount(data.count);
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log("Notification Category:", notification.notification_category);
    try {
      if (notification.notification_category === "new_subgrantee") {
        navigate("/admin/subgrantee-registration-request");
      } else if (notification.notification_category === "new grant") {
        navigate("/admin/grant-requests");
      } else {
        console.error(
          "Unknown notification category:",
          notification.notification_category
        );
      }

      const response = await fetchWithAuth(
        `/api/notifications/${notification.id}/read/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.id === notification.id ? { ...notif, is_read: true } : notif
          )
        );
        fetchNotificationsCount(); // Ensure fetchNotificationsCount is called after state update
      } else {
        console.error("Failed to mark notification as read:", response.status);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchGrants();
    fetchNotifications();
    fetchNotificationsCount();
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container-fluid">
          <a
            className="navbar-brand d-flex align-items-center"
            href="/dashboard"
          >
            <img
              src="https://hrmis.mrcuganda.org/global_assets/images/logo_icon_light.png"
              alt="Logo"
              className="me-2"
              style={{ height: "34px" }}
            />
            <h4 className="mb-0 text-primary fw-bold">Grants Opportunities</h4>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item me-3">
                <span className="badge bg-primary rounded-pill">
                  {activeGrantsCount === 0
                    ? "Loading..."
                    : `${activeGrantsCount} Active Grants`}
                </span>
              </li>
              <li className="nav-item me-3">
                <a
                  href="#"
                  className="nav-link position-relative"
                  onClick={() => fetchNotifications()}
                >
                  <i className="icon-bell2" style={{ fontSize: "18px" }}></i>
                  {notificationsCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notificationsCount}
                    </span>
                  )}
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="notificationsDropdown"
                >
                  <h6 className="dropdown-header">Notifications</h6>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-menu-body">
                    {visibleNotifications.length > 0 ? (
                      visibleNotifications.map((notification) => (
                        <a
                          key={notification.id}
                          className="dropdown-item"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="media">
                            <img
                              src="global_assets/images/placeholders/placeholder.jpg"
                              className="me-3 rounded-circle"
                              width="36"
                              height="36"
                              alt="Notification"
                            />
                            <div className="media-body">
                              <h6 className="mt-0 font-weight-bold">
                                {notification.text}
                              </h6>
                              <small className="text-muted">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleTimeString()}
                              </small>
                            </div>
                          </div>
                        </a>
                      ))
                    ) : (
                      <a className="dropdown-item">No notifications</a>
                    )}
                  </div>
                  <div className="dropdown-divider"></div>
                </div>
              </li>
              <li className="nav-item me-3">
                <a href="/help" className="nav-link">
                  <i className="icon-help" style={{ fontSize: "18px" }}></i>
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="global_assets/images/placeholders/placeholder.jpg"
                    className="rounded-circle me-2"
                    height={34}
                    width={34}
                    alt="User"
                  />
                  <span>{user.organisation_name || "User"}</span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="/profile">
                      <i className="bi bi-person-fill me-2"></i> My profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/settings">
                      <i className="bi bi-gear-fill me-2"></i> Account settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      <Logout />
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ToastContainer position="top-end" className="p-3">
        {visibleNotifications.map((notification) => (
          <Toast
            key={notification.id}
            onClose={() => handleNotificationClick(notification)}
            bg="light"
          >
            <Toast.Header>
              <strong className="me-auto">{notification.type}</strong>
              <small>{new Date(notification.timestamp).toLocaleString()}</small>
            </Toast.Header>
            <Toast.Body>{notification.text}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default Header;
