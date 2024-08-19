import React, { Component } from "react";
import Logout from "../components/login/Logout";
import { fetchWithAuth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Toast, ToastContainer } from "react-bootstrap"; // Import Toast components from react-bootstrap

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebarOpen: false,
      activeGrantsCount: 0,
      notificationsCount: 0,
      notifications: [],
      visibleNotifications: [], // State for managing visible toasts
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
    // Update visible notifications
    this.setState({ visibleNotifications: notifications });

    // Set timeout to hide notifications after 5 seconds
    notifications.forEach((notification) => {
      setTimeout(() => {
        this.setState((prevState) => ({
          visibleNotifications: prevState.visibleNotifications.filter(
            (n) => n.id !== notification.id
          ),
        }));
      }, 5000); // 5 seconds
    });
  };

  handleNotificationClick = (notification) => {
    // Handle notification click if needed
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
        <div className="navbar navbar-expand-lg navbar-light navbar-static">
          <div className="navbar-header navbar-light d-none d-md-flex align-items-md-center">
            <div className="navbar-brand navbar-brand-md">
              <a
                href="https://hrmis.mrcuganda.org/admin"
                className="d-inline-block"
              >
                <h4 className="font-weight-bold text-purple">
                  Grants Opportunities
                </h4>
              </a>
            </div>
            <div className="navbar-brand navbar-brand-xs">
              <a
                href="https://hrmis.mrcuganda.org/admin"
                className="d-inline-block"
              >
                <img
                  src="https://hrmis.mrcuganda.org/global_assets/images/logo_icon_light.png"
                  alt="Logo"
                />
              </a>
            </div>
          </div>
          <div className="d-flex flex-1 d-md-none">
            <div className="navbar-brand mr-auto">
              <h4 className="font-weight-bold text-black">GMS ADMIN PORTAL</h4>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbar-mobile"
            >
              <i className="icon-tree5" />
            </button>
            <button
              className="navbar-toggler sidebar-mobile-main-toggle"
              type="button"
              onClick={this.toggleSidebar}
            >
              <i className="icon-paragraph-justify3" />
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbar-mobile">
            <ul className="navbar-nav">
              {/* Add any additional navigation items here */}
            </ul>
            <span className="badge bg-pink-400 badge-pill ml-md-3 mr-md-auto">
              {activeGrantsCount === 0 ? "Loading..." : activeGrantsCount}
            </span>
            <ul className="navbar-nav pull-right">
              <li className="nav-item">
                <a
                  href="#"
                  className="navbar-nav-link"
                  onClick={() => this.fetchNotifications()}
                >
                  <i className="icon-bell2" />
                  <span className="badge badge-warning badge-pill">
                    {notificationsCount || 0}
                  </span>
                </a>
              </li>
              <li>
                <a href="/root" target="_blank" className="navbar-nav-link">
                  <i className="icon-help" />
                </a>
              </li>
              <li className="nav-item dropdown dropdown-user">
                <a
                  href="/test"
                  className="navbar-nav-link d-flex align-items-center dropdown-toggle"
                  data-toggle="dropdown"
                >
                  <img
                    src="global_assets/images/placeholders/placeholder.jpg"
                    className="rounded-circle mr-2"
                    height={34}
                    alt="User"
                  />
                  <span>{user.organisation_name || "User"}</span>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <a href="/profile" className="dropdown-item">
                    <i className="icon-user-plus" /> My profile
                  </a>
                  <div className="dropdown-divider" />
                  <a href="#" className="dropdown-item">
                    <i className="icon-cog5" /> Account settings
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="icon-switch2" />
                    <Logout />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer position="top-end" className="p-3">
          {visibleNotifications.map((notification) => (
            <Toast
              key={notification.id}
              onClose={() => this.handleNotificationClick(notification)}
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
