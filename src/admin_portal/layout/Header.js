import React, { useEffect, useState } from "react";
import Logout from "../../subgrantee_portal/components/login/Logout";
import { fetchWithAuth } from "../../utils/helpers";
import { Toast, ToastContainer } from "react-bootstrap";

function Header({ toggleSidebar }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const authToken = localStorage.getItem("accessToken");

  const fetchNotificationCount = async () => {
    if (!authToken) return;

    try {
      const response = await fetchWithAuth("/api/notifications/count/");
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.count);
      } else {
        console.error("Failed to fetch notification count:", response.status);
      }
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!authToken) return;

    try {
      const response = await fetchWithAuth("/api/notifications/unread/");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setShowNotifications(true);
      } else {
        console.error("Failed to fetch notifications:", response.status);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClose = (id) => {
    setVisibleNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotificationCount();
    fetchNotifications();
  }, [authToken]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <a
        className="navbar-brand d-flex align-items-center"
        href="https://hrmis.mrcuganda.org/admin"
      >
        <img
          src="https://hrmis.mrcuganda.org/global_assets/images/logo_icon_light.png"
          alt="Logo"
          className="d-inline-block align-top"
          width="30"
          height="30"
        />
        <span className="ml-2 font-weight-bold">GMS ADMIN</span>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <button
              className="btn btn-outline-secondary"
              onClick={toggleSidebar}
            >
              <i className="icon-paragraph-justify3"></i>
            </button>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="notificationsDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={handleNotificationsClick}
            >
              <i className="icon-bell2"></i>
              {notificationCount > 0 && (
                <span className="badge badge-warning ml-2">
                  {notificationCount}
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
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <a key={notification.id} className="dropdown-item">
                      <div className="media">
                        <img
                          src="global_assets/images/placeholders/placeholder.jpg"
                          className="mr-3 rounded-circle"
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
              <a
                className="dropdown-item text-center"
                href="/admin/notifications"
              >
                View all notifications
              </a>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="profileDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="icon-user"></i>
              <span className="d-none d-md-inline ml-2">
                {user ? user.email : "Unknown User"}
              </span>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="profileDropdown"
            >
              <a className="dropdown-item" href="/admin/profile">
                <i className="icon-user-plus"></i> My Profile
              </a>
              <a className="dropdown-item" href="/admin/notifications">
                <i className="icon-bubbles4"></i> Messages
              </a>
              <a className="dropdown-item" href="/admin/settings">
                <i className="icon-cog5"></i> Settings
              </a>
              <div className="dropdown-divider"></div>
              <Logout />
            </div>
          </li>
        </ul>
      </div>
      <ToastContainer position="top-end" className="p-3">
        {visibleNotifications.map((notification) => (
          <Toast
            key={notification.id}
            onClose={() => handleNotificationClose(notification.id)}
            bg="light"
            delay={5000}
            autohide
          >
            <Toast.Body>{notification.text}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </nav>
  );
}

export default Header;
