import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const ProfileCreation = () => {
  // Inline styles
  const containerStyle = {
    width: "90%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  };

  const navContainerStyle = {
    marginBottom: "20px",
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-around",
    listStyleType: "none",
    padding: 0,
    margin: 0,
    borderBottom: "2px solid #ddd",
  };

  const navItemStyle = {
    flex: 1,
    textAlign: "center",
  };

  const navLinkStyle = {
    display: "block",
    padding: "10px 15px",
    textDecoration: "none",
    color: "#007bff",
    borderBottom: "3px solid transparent",
  };

  const activeNavLinkStyle = {
    borderBottom: "3px solid #007bff",
    fontWeight: "bold",
    color: "#0056b3",
  };

  const contentContainerStyle = {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={containerStyle}>
      <div style={navContainerStyle}>
        <ul style={navStyle}>
          <li style={navItemStyle}>
            <NavLink
              to="generalinfo"
              style={navLinkStyle}
              activeStyle={activeNavLinkStyle}
            >
              GENERAL ORGANIZATION INFORMATION
            </NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink
              to="organizationdescription"
              style={navLinkStyle}
              activeStyle={activeNavLinkStyle}
            >
              MANAGEMENT CAPACITY OF THE APPLICANT
            </NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink
              to="financial"
              style={navLinkStyle}
              activeStyle={activeNavLinkStyle}
            >
              FINANCIAL MANAGEMENT AND ADMINISTRATION
            </NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink
              to="technicalskills"
              style={navLinkStyle}
              activeStyle={activeNavLinkStyle}
            >
              TECHNICAL SKILLS/CAPACITY
            </NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink
              to="staff"
              style={navLinkStyle}
              activeStyle={activeNavLinkStyle}
            >
              HUMAN RESOURCE CAPACITY
            </NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink
              to="implementation"
              style={navLinkStyle}
              activeStyle={activeNavLinkStyle}
            >
              IMPLEMENTATION EXPERIENCE
            </NavLink>
          </li>
          <li style={navItemStyle}>
            <NavLink
              to="partnership"
              style={navLinkStyle}
              activeStyle={activeNavLinkStyle}
            >
              ORGANIZATIONS WORKED/PARTNERED WITH
            </NavLink>
          </li>
        </ul>
      </div>
      <div style={contentContainerStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileCreation;
