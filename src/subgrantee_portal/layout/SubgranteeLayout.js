import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../subgrantee_portal/layout/Header";
import Footer from "../../subgrantee_portal/layout/Footer";
import Sidemenu from "../../subgrantee_portal/layout/Sidemenu";

const SubgranteeLayout = () => (
  <div className="d-flex flex-column vh-100">
    {/* Header - Fixed at the top */}
    <div className="fixed-top shadow-sm">
      <Header />
    </div>

    {/* Main Content Area */}
    <div className="d-flex flex-grow-1" style={{ marginTop: "56px" }}>
      {" "}
      {/* Adjust based on your actual header height */}
      {/* Sidebar - Fixed on the left, non-scrollable */}
      <div
        className="position-fixed h-100 shadow-sm"
        style={{ top: "56px", width: "250px", zIndex: 1000 }}
      >
        <Sidemenu />
      </div>
      {/* Page Content - Scrollable */}
      <div
        className="flex-grow-1 p-4 bg-light"
        style={{
          marginLeft: "250px",
          overflowY: "auto",
          height: "calc(100vh - 56px - 56px)",
        }}
      >
        {" "}
        {/* Adjust based on your header and footer heights */}
        <Outlet />
      </div>
    </div>

    {/* Footer - Fixed at the bottom */}
    <div className="fixed-bottom shadow-lg">
      <Footer />
    </div>
  </div>
);

export default SubgranteeLayout;
