import React, { useEffect, useState } from "react";
import Logout from "../../subgrantee_portal/components/login/Logout";
import { fetchWithAuth } from "../../utils/helpers";

function Header({ toggleSidebar }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [toastMessages, setToastMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchNotificationCount = async () => {
    if (!authToken) return;

    try {
      const response = await fetchWithAuth("/api/notifications/count/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

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
      const response = await fetchWithAuth("/api/notifications/unread/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setToastMessages((prevMessages) => [
          ...prevMessages,
          ...data.map((notification) => ({
            id: notification.id,
            message: notification.text,
            timestamp: new Date(notification.timestamp).toLocaleTimeString(),
          })),
        ]);
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
  }, [authToken, refreshToken]);

  useEffect(() => {
    const timers = toastMessages.map((toast) =>
      setTimeout(() => {
        setToastMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== toast.id)
        );
      }, 5000)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toastMessages]);

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      fetchNotifications();
    }
  };

  const closeToast = (id) => {
    setToastMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== id)
    );
  };

  return (
    <div className="navbar navbar-expand-lg navbar-light">
      <div className="navbar-header d-flex align-items-center">
        <div className="navbar-brand">
          <a
            href="https://hrmis.mrcuganda.org/admin"
            className="d-inline-block"
          >
            <h4 className="font-weight-bold text-white">GMS ADMIN</h4>
          </a>
        </div>
        <div className="navbar-brand-xs d-md-none">
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
      <div className="d-flex flex-1 d-lg-none">
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
          className="navbar-toggler"
          type="button"
          onClick={toggleSidebar}
        >
          <i className="icon-paragraph-justify3" />
        </button>
      </div>
      <div className="collapse navbar-collapse" id="navbar-mobile">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              className="navbar-nav-link sidebar-control sidebar-main-toggle d-none d-md-block"
              onClick={toggleSidebar}
            >
              <i className="icon-paragraph-justify3" />
            </button>
          </li>
          <li className="nav-item dropdown">
            <a
              href="#"
              className="navbar-nav-link dropdown-toggle caret-0"
              data-toggle="dropdown"
              onClick={handleNotificationsClick}
            >
              <i className="icon-people" />
              <span className="d-md-none ml-2">Users</span>
              <span className="badge badge-mark border-pink-400 ml-auto ml-md-0" />
            </a>
            <div className="dropdown-menu dropdown-content wmin-md-300">
              <div className="dropdown-content-header">
                <span className="font-weight-semibold">Users online</span>
                <a href="#" className="text-default">
                  <i className="icon-search4 font-size-base" />
                </a>
              </div>
              <div className="dropdown-content-body dropdown-scrollable">
                <ul className="media-list">
                  <li className="media">
                    <div className="mr-3">
                      <img
                        src="global_assets/images/placeholders/placeholder.jpg"
                        width={36}
                        height={36}
                        className="rounded-circle"
                        alt="User"
                      />
                    </div>
                    <div className="media-body">
                      <a href="/#" className="media-title font-weight-semibold">
                        Jordana Ansley
                      </a>
                      <span className="d-block text-muted font-size-sm">
                        Lead web developer
                      </span>
                    </div>
                    <div className="ml-3 align-self-center">
                      <span className="badge badge-mark border-success" />
                    </div>
                  </li>
                </ul>
              </div>
              <div className="dropdown-content-footer bg-light">
                <a href="/#" className="text-grey mr-auto">
                  All users
                </a>
                <a href="/#" className="text-grey">
                  <i className="icon-gear" />
                </a>
              </div>
            </div>
          </li>
        </ul>
        <span className="badge bg-pink-400 badge-pill ml-md-3 mr-md-auto">
          {notificationCount}
        </span>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a href="/root" target="_blank" className="navbar-nav-link">
              <i className="icon-help" />
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              href="#"
              className="navbar-nav-link dropdown-toggle"
              data-toggle="dropdown"
              onClick={handleNotificationsClick}
            >
              <i className="icon-bell2" />
              <span className="badge badge-warning badge-pill">
                {notificationCount}
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <div className="dropdown-content-header">
                <h6 className="font-weight-semibold mb-0">Notifications</h6>
                <a href="#" className="text-body">
                  <i className="icon-gear" />
                </a>
              </div>
              <div className="dropdown-content-body">
                <ul className="media-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <li key={notification.id} className="media">
                        <div className="mr-3 position-relative">
                          <img
                            src="global_assets/images/placeholders/placeholder.jpg"
                            width={36}
                            height={36}
                            className="rounded-circle"
                            alt="Notification"
                          />
                        </div>
                        <div className="media-body">
                          <div className="media-title">
                            <a href="/#">
                              <span className="font-weight-semibold">
                                {notification.text}
                              </span>
                              <span className="text-muted float-right font-size-sm">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleTimeString()}
                              </span>
                            </a>
                          </div>
                          <span className="text-muted">
                            {notification.text}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="media">
                      <div className="media-body text-center">
                        No notifications
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="dropdown-content-footer justify-content-center p-0">
                <a href="/admin/notifications" className="text-grey mr-auto">
                  All notifications
                </a>
              </div>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a
              href="#"
              className="navbar-nav-link dropdown-toggle"
              data-toggle="dropdown"
            >
              <i className="icon-user" />
              <span className="d-md-none ml-2">Profile</span>
              <span className="d-none d-md-inline-block ml-2">
                {user ? user.email : "Unknown User"}
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a href="#" className="dropdown-item">
                <i className="icon-user"></i> My profile
              </a>
              <a href="#" className="dropdown-item">
                <i className="icon-cog"></i> Settings
              </a>
              <a href="#" className="dropdown-item">
                <i className="icon-switch2"></i> Logout
              </a>
            </div>
          </li>
        </ul>
      </div>
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1050 }}
      >
        {toastMessages.map((toast) => (
          <div
            key={toast.id}
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ minWidth: "300px" }}
          >
            <div className="toast-header">
              <strong className="mr-auto">Notification</strong>
              <small>{toast.timestamp}</small>
              <button
                type="button"
                className="ml-2 mb-1 close"
                data-dismiss="toast"
                aria-label="Close"
                onClick={() => closeToast(toast.id)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="toast-body">{toast.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Header;
