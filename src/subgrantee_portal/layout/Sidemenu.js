import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, BarChart2, Settings } from "lucide-react";
import { AiFillMoneyCollect } from "react-icons/ai";
import { FaInbox, FaMoneyBill, FaMoneyBillWave } from "react-icons/fa";
import { CurrencyBitcoin, Folder } from "react-bootstrap-icons";

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
          to="/applications"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <Folder size={20} className="me-3" />
          <span>My Applications</span>
        </NavLink>
        <NavLink
          to="/grant-accounts"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <FileText size={20} className="me-3" />
          <span>My Opportunities</span>
        </NavLink>
        <NavLink
          to="/budget"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <CurrencyBitcoin size={20} className="me-3" />
          <span>Budgets</span>
        </NavLink>
        <NavLink
          to="/funding-allocation"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <FaMoneyBillWave size={20} className="me-3" />
          <span>Finances</span>
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
          to="/requests"
          className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center"
          activeClassName="active"
          style={({ isActive }) => ({
            backgroundColor: isActive ? "#f8f9fa" : "transparent",
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#007bff" : "#333",
          })}
        >
          <FaInbox size={20} className="me-3" /> <span>Requests</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidemenu;
