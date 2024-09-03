import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../subgrantee_portal/layout/Header";
import Footer from "../../subgrantee_portal/layout/Footer";
import Sidemenu from "../../subgrantee_portal/layout/Sidemenu";

const SubgranteeLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    {/* Header */}
    <Header />

    {/* Main Content Area */}
    <div className="flex-grow-1 d-flex">
      {/* Sidebar */}
      <Sidemenu />

      {/* Page Content */}
      <div className="flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>

    {/* Footer */}
    <Footer />
  </div>
);

export default SubgranteeLayout;
