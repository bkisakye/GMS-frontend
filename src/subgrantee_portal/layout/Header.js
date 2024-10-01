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

  useEffect(() => {
    fetchGrants();
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
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    navigate("/notifications"); // Navigate to the notifications page
                  }}
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
    </div>
  );
};

export default Header;
