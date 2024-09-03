import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, BarChart2, Settings } from "lucide-react";

const Sidemenu = () => {
  return (
    <div
      className="d-flex flex-column bg-light border-end vh-100"
      style={{ width: "250px" }}
    >
      <div className="list-group list-group-flush">
        <NavLink
          to="/dashboard"
          className="list-group-item list-group-item-action d-flex align-items-center"
          activeClassName="active"
          style={{ padding: "15px 20px" }}
        >
          <Home size={18} className="me-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/grants"
          className="list-group-item list-group-item-action d-flex align-items-center"
          activeClassName="active"
          style={{ padding: "15px 20px" }}
        >
          <FileText size={18} className="me-3" />
          My Grants
        </NavLink>
        <NavLink
          to="/reports"
          className="list-group-item list-group-item-action d-flex align-items-center"
          activeClassName="active"
          style={{ padding: "15px 20px" }}
        >
          <BarChart2 size={18} className="me-3" />
          Reports
        </NavLink>
        <NavLink
          to="/settings"
          className="list-group-item list-group-item-action d-flex align-items-center"
          activeClassName="active"
          style={{ padding: "15px 20px" }}
        >
          <Settings size={18} className="me-3" />
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidemenu;
