import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils/helpers";
import Logout from "../components/login/Logout";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  PersonFill,
  GearFill,
  BoxArrowRight,
  QuestionCircleFill,
} from "react-bootstrap-icons";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeGrantsCount, setActiveGrantsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

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
      setUnreadNotifications(data.filter((notif) => !notif.is_read));
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
  try {
    switch (notification.notification_category) {
      case "new_grant":
        navigate("/"); 
        break;
      case "grant_review":
        navigate('/budget'); 
        break;
      case "reminder":
        navigate("/reminders"); 
        break;
      case "profile_update":
        navigate("/profile"); 
        break;
      default:
        console.error(
          "Unknown notification category:",
          notification.notification_category
        );
        break;
    }

    // Close the modal after navigation
    toggleModal();

    // Mark notification as read
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
      // Update local state to mark notification as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notification.id ? { ...notif, is_read: true } : notif
        )
      );
      // Fetch the updated notifications count
      fetchNotificationsCount();
    } else {
      console.error("Failed to mark notification as read:", response.status);
    }
  } catch (error) {
    console.error("Error handling notification click:", error);
  }
};


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetchGrants();
    fetchNotifications();
    fetchNotificationsCount();
  }, []);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
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
                  onClick={toggleModal}
                >
                  <Bell className="text-secondary" size={20} />
                  {notificationsCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notificationsCount}
                    </span>
                  )}
                </a>
              </li>
              <li className="nav-item me-3">
                <a href="/help" className="nav-link">
                  <QuestionCircleFill className="text-secondary" size={20} />
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
                      <PersonFill className="me-2" /> My profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/settings">
                      <GearFill className="me-2" /> Account settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <BoxArrowRight className="me-2" /> <Logout />
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal for Notifications */}
      {isModalOpen && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-top">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Unread Notifications</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={toggleModal}
                ></button>
              </div>
              <div className="modal-body">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="card mb-3 notification-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{notification.text}</h5>
                        <p className="card-text">
                          <small className="text-muted">
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString()}
                          </small>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No unread notifications</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
