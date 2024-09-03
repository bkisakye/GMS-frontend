import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidemenu from "./Sidemenu";
import Footer from "./Footer";
// import "./AdminLayout.css"; // Import custom CSS if needed

const AdminLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <div className="d-flex flex-grow-1">
      <Sidemenu />
      <main className="flex-grow-1 p-3">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

export default AdminLayout;
