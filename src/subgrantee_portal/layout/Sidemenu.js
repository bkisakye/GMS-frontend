import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, BarChart2, Settings } from "lucide-react";

const Sidemenu = () => {
  return (
    <div
      className="bg-white h-100 border-end shadow-sm"
      style={{ width: "250px", paddingTop: "20px", borderRadius: "8px" }}
    >
      <div className="list-group list-group-flush">
        <NavLink
          to="/"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <Home size={20} className="me-3" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/grants"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <FileText size={20} className="me-3" />
          <span>My Grants</span>
        </NavLink>
        <NavLink
          to="/reports"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <BarChart2 size={20} className="me-3" />
          <span>Reports</span>
        </NavLink>
        <NavLink
          to="/settings"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <Settings size={20} className="me-3" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidemenu;
