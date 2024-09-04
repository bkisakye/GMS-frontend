import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, BarChart2, Settings } from "lucide-react";

const Sidemenu = () => {
  return (
    <div className="bg-white h-100 border-end" style={{ width: "250px" }}>
      <div className="list-group list-group-flush">
        <NavLink
          to="/"
          className="list-group-item list-group-item-action border-0 py-3"
          activeClassName="active bg-light"
        >
          <Home size={18} className="me-3 text-primary" />
          <span className="fw-medium">Dashboard</span>
        </NavLink>
        <NavLink
          to="/grants"
          className="list-group-item list-group-item-action border-0 py-3"
          activeClassName="active bg-light"
        >
          <FileText size={18} className="me-3 text-primary" />
          <span className="fw-medium">My Grants</span>
        </NavLink>
        <NavLink
          to="/reports"
          className="list-group-item list-group-item-action border-0 py-3"
          activeClassName="active bg-light"
        >
          <BarChart2 size={18} className="me-3 text-primary" />
          <span className="fw-medium">Reports</span>
        </NavLink>
        <NavLink
          to="/settings"
          className="list-group-item list-group-item-action border-0 py-3"
          activeClassName="active bg-light"
        >
          <Settings size={18} className="me-3 text-primary" />
          <span className="fw-medium">Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidemenu;
