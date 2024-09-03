import React, { Component } from "react";
import Logout from "../components/login/Logout";
import { fetchWithAuth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast, ToastContainer } from "react-bootstrap";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebarOpen: false,
      activeGrantsCount: 0,
      notificationsCount: 0,
      notifications: [],
      visibleNotifications: [],
    };
  }

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }));
  };

  fetchGrants = async () => {
    try {
      const response = await fetchWithAuth("/api/grants/active-count/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ activeGrantsCount: data });
    } catch (error) {
      console.error("Error fetching grants:", error);
    }
  };

  fetchNotifications = async () => {
    try {
      const response = await fetchWithAuth("/api/notifications/unread/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ notifications: data }, () => {
        this.showNotifications(data);
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  fetchNotificationsCount = async () => {
    try {
      const response = await fetchWithAuth("/api/notifications/count/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ notificationsCount: data.count });
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };

  showNotifications = (notifications) => {
    this.setState({ visibleNotifications: notifications });

    notifications.forEach((notification) => {
      setTimeout(() => {
        this.setState((prevState) => ({
          visibleNotifications: prevState.visibleNotifications.filter(
            (n) => n.id !== notification.id
          ),
        }));
      }, 5000);
    });
  };

  handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
  };

  componentDidMount() {
    this.fetchGrants();
    this.fetchNotifications();
    this.fetchNotificationsCount();
  }

  render() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const { activeGrantsCount, notificationsCount, visibleNotifications } =
      this.state;

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
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
              <h4 className="mb-0 text-primary">Grants Opportunities</h4>
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

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {/* Additional navigation items can be added here */}
              </ul>
              <span className="badge bg-primary badge-pill me-3">
                {activeGrantsCount === 0
                  ? "Loading..."
                  : `${activeGrantsCount} Active Grants`}
              </span>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <a
                    href="#"
                    className="nav-link position-relative"
                    onClick={() => this.fetchNotifications()}
                  >
                    <i className="icon-bell2" style={{ fontSize: "18px" }}></i>
                    {notificationsCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {notificationsCount}
                      </span>
                    )}
                  </a>
                </li>
                <li className="nav-item">
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
                        <i className="icon-user-plus me-2"></i> My profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/settings">
                        <i className="icon-cog5 me-2"></i> Account settings
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="icon-switch2 me-2"></i>
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
              onClose={() => this.handleNotificationClick(notification)}
              bg="light"
            >
              <Toast.Header>
                <strong className="me-auto">{notification.type}</strong>
                <small>
                  {new Date(notification.timestamp).toLocaleString()}
                </small>
              </Toast.Header>
              <Toast.Body>{notification.text}</Toast.Body>
            </Toast>
          ))}
        </ToastContainer>
      </div>
    );
  }
}
