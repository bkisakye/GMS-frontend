import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidemenu from "./Sidemenu";
import Footer from "./Footer";
// import "./AdminLayout.css"; // Import custom CSS if needed

const AdminLayout = () => (
  <div className="d flex flex-column vh-100">
    <div className="fixed-top shadow-sm">
      <Header />
    </div>
    
    <div className="d-flex flex-grow-1" style={{ marginTop: "56px" }}>
      {" "}
      <div className="position-fixed h-100 shadow-sm" style={{ top: "56px", width: "250px", zIndex: 1000 }}>
        <Sidemenu />
      </div>
      
      <div className="flex-grow-1 p-4 bg-light" style={{ marginLeft: "250px", overflowY: "auto", height: "calc(100vh - 56px - 56px)" }}>
        {" "}
        <Outlet />
        </div>
    </div>

    <div className="fixed-bottom shadow-lg">
      <Footer />
    </div>
    </div>
);

export default AdminLayout;

