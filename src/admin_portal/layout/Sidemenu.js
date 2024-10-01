import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  Gift,
  GitPullRequest,
} from "lucide-react";
import { FaFacebookMessenger, FaInbox } from "react-icons/fa";

const Sidemenu = () => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSubMenu = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className={`bg-dark text-light h-100 ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
      style={{
        width: isSidebarOpen ? "250px" : "60px",
        transition: "width 0.3s ease",
      }}
    >
      <div className="d-flex flex-column h-100">
        <div className="nav flex-column py-3">
          <NavLink
            to=""
            className="nav-link d-flex align-items-center py-3  text-light"
            activeClassName="active bg-primary"
          >
            <Home size={20} className="me-3" />
            <span className={isSidebarOpen ? "" : "d-none"}>Dashboard</span>
          </NavLink>

          {/* Subgrantee Management */}
          <div className="nav-item">
            <button
              className="nav-link d-flex align-items-center py-3  text-light w-100 border-0 bg-transparent"
              onClick={() => toggleSubMenu("subgrantee")}
            >
              <Users size={20} className="me-3" />
              <span className={isSidebarOpen ? "" : "d-none"}>
                Subgrantee Management
              </span>
              {isSidebarOpen &&
                (activeSubMenu === "subgrantee" ? (
                  <ChevronUp size={20} className="ms-auto" />
                ) : (
                  <ChevronDown size={20} className="ms-auto" />
                ))}
            </button>
            {activeSubMenu === "subgrantee" && isSidebarOpen && (
              <div className="nav flex-column ms-4 mt-2">
                <NavLink
                  to="subgrantees_list"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Subgrantees List
                </NavLink>
                <NavLink
                  to="subgrantee-registration-request"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Registration Request
                </NavLink>
              </div>
            )}
          </div>

          {/* Grants Management */}
          <div className="nav-item">
            <button
              className="nav-link d-flex align-items-center py-3  text-light w-100 border-0 bg-transparent"
              onClick={() => toggleSubMenu("grants")}
            >
              <Calendar size={20} className="me-3" />
              <span className={isSidebarOpen ? "" : "d-none"}>
                Grants Management
              </span>
              {isSidebarOpen &&
                (activeSubMenu === "grants" ? (
                  <ChevronUp size={20} className="ms-auto" />
                ) : (
                  <ChevronDown size={20} className="ms-auto" />
                ))}
            </button>
            {activeSubMenu === "grants" && isSidebarOpen && (
              <div className="nav flex-column ms-4 mt-2">
                <NavLink
                  to="index"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Grants
                </NavLink>
                <NavLink
                  to="applications_list"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Applications
                </NavLink>
                <NavLink
                  to="donors"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Donors
                </NavLink>
                <NavLink
                  to="types"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Grant Types
                </NavLink>
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="nav-item">
            <button
              className="nav-link d-flex align-items-center py-3  text-light w-100 border-0 bg-transparent"
              onClick={() => toggleSubMenu("reports")}
            >
              <Briefcase size={20} className="me-3" />
              <span className={isSidebarOpen ? "" : "d-none"}>Reports</span>
              {isSidebarOpen &&
                (activeSubMenu === "reports" ? (
                  <ChevronUp size={20} className="ms-auto" />
                ) : (
                  <ChevronDown size={20} className="ms-auto" />
                ))}
            </button>
            {activeSubMenu === "reports" && isSidebarOpen && (
              <div className="nav flex-column ms-4 mt-2">
                <NavLink
                  to="progress-reports"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Progress Reports
                </NavLink>
                <NavLink
                  to="finance-reports"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Financial Reports
                </NavLink>
              </div>
            )}
          </div>

          {/* Financial Management */}
          <div className="nav-item">
            <button
              className="nav-link d-flex align-items-center py-3 text-light w-100 border-0 bg-transparent"
              onClick={() => toggleSubMenu("financials")}
            >
              <Gift size={20} className="me-3" />
              <span className={isSidebarOpen ? "" : "d-none"}>
                Financial Management
              </span>
              {isSidebarOpen &&
                (activeSubMenu === "financials" ? (
                  <ChevronUp size={20} className="ms-auto" />
                ) : (
                  <ChevronDown size={20} className="ms-auto" />
                ))}
            </button>
            {activeSubMenu === "financials" && isSidebarOpen && (
              <div className="nav flex-column ms-4 mt-2">
                <NavLink
                  to="grant-accounts"
                  className="nav-link py-3 text-light"
                  activeClassName="active bg-primary"
                >
                  Accounts
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="closeout-requests"
            className="nav-link d-flex align-items-center py-3 text-light"
            activeClassName="active bg-primary"
          >
            <FaInbox size={20} className="me-3" />
            <span className={isSidebarOpen ? "" : "d-none"}>Requests</span>
          </NavLink>
          <NavLink
            to=""
            className="nav-link d-flex align-items-center py-3 text-light"
            activeClassName="active bg-primary"
          >
            <FaFacebookMessenger size={20} className="me-3" />
            <span className={isSidebarOpen ? "" : "d-none"}>Messages</span>
            </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
