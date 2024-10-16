import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchWithAuth } from "../../utils/helpers";
import { Toast, ToastContainer } from "react-bootstrap";
import { FaEnvelopeOpenText } from "react-icons/fa";

function Header({ toggleSidebar }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const authToken = localStorage.getItem("accessToken");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
}

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
            <button
              className="btn nav-link dropdown-toggle"
              id="notificationsDropdown"
              onClick={() => navigate('/admin/notifications')} // Use onClick to navigate
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="icon-bell2"></i>
              {notificationCount > 0 && (
                <span className="badge badge-warning ml-2">
                  {notificationCount}
                </span>
              )}
            </button>
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
                {user ? user.username : "Unknown User"}
              </span>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="profileDropdown"
            >
              <a className="dropdown-item" href="/admin/profile">
                <i className="icon-user-plus"></i> My Profile
              </a>
              <a className="dropdown-item" href="/admin/messages">
                <i className="icon-bubbles4"></i> Messages
              </a>
              <a className="dropdown-item" href="/admin/settings">
                <i className="icon-cog5"></i> Settings
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="" onClick={handleLogout}>
                <i className="icon-switch2"></i>
                Logout
                </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
