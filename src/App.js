// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  RouterProvider,
} from "react-router-dom";
import SubgranteeLayout from "./subgrantee_portal/layout/SubgranteeLayout";
import AdminLayout from "./admin_portal/layout/AdminLayout";
import ProtectedRoute from "./subgrantee_portal/AuthenticatedRoute";
import Login from "./admin_portal/components/login/Login";
import Dashboard from "./admin_portal/components/pages/Dashboard";
import Subgrantees from "./admin_portal/components/pages/subgrantees";
import Grants from "./admin_portal/components/pages/grants";
import GrantsApplication from "../src/admin_portal/components/pages/grants_application";
import LandingPage from "./subgrantee_portal/components/pages/LandingPage";
import LoginPage from "./subgrantee_portal/components/login/Login";
import { UserProvider } from "./UserContext";
import { BrowserRouter } from "react-router-dom";
import GrantsForm from "./admin_portal/components/pages/grants/grant_form";
import Signup from "./subgrantee_portal/components/login/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import Notifications from "./admin_portal/components/pages/Notifications";
// import grant_form from './admin_portal/components/pages/grants/grant_form';
import GrantApplication from "./subgrantee_portal/components/pages/GrantApplication";
import ProfileCreation from "./subgrantee_portal/components/pages/ProfileCreation";
import ProfileGuard from "./subgrantee_portal/components/pages/ProfileGuard";
import Staff from "./subgrantee_portal/components/pages/Staff";
import TechnicalSkills from "./subgrantee_portal/components/pages/TechnicalSkills";
import GeneralInfo from "./subgrantee_portal/components/pages/Generalinfo";
import FinancialAdmin from "./subgrantee_portal/components/pages/FinancialAdmin";
import OrganizationDescription from "./subgrantee_portal/components/pages/OrganizationDescription";
import Partnership from "./subgrantee_portal/components/pages/Partnership";
import Implementation from "./subgrantee_portal/components/pages/Implementation";
import Index from "./admin_portal/components/pages/grants/index";
import SpecificQuestions from "./admin_portal/components/pages/grants/specificquestions";
import Donors from "./admin_portal/components/pages/donors/donors";
import Types from "./admin_portal/components/pages/grants/types";
import Budget from "./subgrantee_portal/components/pages/Budget";
import FundingAllocation from "./subgrantee_portal/components/pages/FundingAllocation";
import Accounts from "./subgrantee_portal/components/pages/Accounts";
import ProgressReports from "./admin_portal/components/pages/reports/ProgressReports";
import GrantAccounts from "./admin_portal/components/pages/grant_accounts/Accounts";
import Requests from "./subgrantee_portal/components/pages/Requests";
import GrantCloseOut from "./admin_portal/components/pages/requests/GrantCloseOut";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="" element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="subgrantees_list" element={<Subgrantees />} />
          <Route path="grants_list" element={<Grants />} />
          <Route path="applications_list" element={<GrantsApplication />} />
          <Route path="grants_form" element={<GrantsForm />} />
          <Route path="index" element={<Index />} />
          <Route path="specificquestions" element={<SpecificQuestions />} />
          <Route path="donors" element={<Donors />} />
          <Route path="types" element={<Types />} />
          <Route path="progress-reports" element={<ProgressReports />} />
          <Route path="grant-accounts" element={<GrantAccounts />} />
          <Route path="closeout-requests" element={<GrantCloseOut />} />
        </Route>

        {/* Subgrantee routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SubgranteeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LandingPage />} />
          <Route path="application/:grantName" element={<GrantApplication />} />
          <Route path="application" element={<GrantApplication />} />
          <Route path="budget" element={<Budget />} />
          <Route path="funding-allocation" element={<FundingAllocation />} />
          <Route path="grant-accounts" element={<Accounts />} />
          <Route path="requests" element={<Requests />} />
          <Route path="profile" element={<ProfileCreation />}>
            <Route index element={<GeneralInfo />} />
            <Route path="generalinfo" element={<GeneralInfo />} />
            <Route path="generalinfo/edit/:id" element={<GeneralInfo />} />
            <Route path="staff" element={<Staff />} />
            <Route path="staff/edit/:id" element={<Staff />} />
            <Route path="technicalskills" element={<TechnicalSkills />} />
            <Route
              path="technicalskills/edit/:id"
              element={<TechnicalSkills />}
            />
            <Route path="financial" element={<FinancialAdmin />} />
            <Route path="financial/edit/:id" element={<FinancialAdmin />} />
            <Route
              path="organizationdescription"
              element={<OrganizationDescription />}
            />
            <Route
              path="organizationdescription/edit/:id"
              element={<OrganizationDescription />}
            />
            <Route path="partnership" element={<Partnership />} />
            <Route path="partnership/edit/:id" element={<Partnership />} />
            <Route path="implementation" element={<Implementation />} />
            <Route
              path="implementation/edit/:id"
              element={<Implementation />}
            />
          </Route>

          {/* Define more subgrantee routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
