import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './Dashboard.css'; 
import { fetchWithAuth } from '../../../utils/helpers';

const Dashboard = () => {
  const [grantCount, setGrantCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [subgranteeCount, setSubgranteeCount] = useState(0);
  const [activeSubgranteeCount, setActiveSubgranteeCount] = useState(0);

 useEffect(() => {
 
   fetchWithAuth(`/api/grants/grant-applications/count/`)
     .then((response) => response.json())
     .then((data) => {
       setGrantCount(data.count); 
     })
     .catch((error) => {
       console.error("Error fetching grant count:", error);
     });


   fetchWithAuth(`/api/grants/grant-applications/approve/count/`)
     .then((response) => response.json())
     .then((data) => {
       setApprovedCount(data.count);
     })
     .catch((error) => {
       console.error("Error fetching approved count:", error);
     });
   
   fetchWithAuth(`/api/grants/grant-applications/pending/count/`)
     .then((response) => response.json())
   .then((data) => {
       setPendingCount(data.count);
     })
     .catch((error) => {
       console.error("Error fetching pending count:", error);
     })
   
   fetchWithAuth(`/api/grants/grant-applications/rejected/count/`)
     .then((response) => response.json())
   .then((data) => {
       setRejectedCount(data.count);
     })
     .catch((error) => {
       console.error("Error fetching rejected count:", error);
     })
   
   fetchWithAuth(`/api/authentication/subgrantees/count/`)
     .then((response) => response.json())
   .then((data) => {
       setSubgranteeCount(data.count);
     })
     .catch((error) => {
       console.error("Error fetching subgrantee count:", error);
     })
   
   fetchWithAuth(`/api/authentication/active-subgrantees/count/`)
     .then((response) => response.json())
   .then((data) => {
       setActiveSubgranteeCount(data.count);
     })
     .catch((error) => {
       console.error("Error fetching active subgrantee count:", error);
     })
   
 }, []);
  
  
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Metrics Cards */}
        <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
              <div className="media">
                <div className="mr-3 align-self-center">
                  <i className="fas fa-file-alt fa-3x text-success"></i> {/* FontAwesome icon */}
                </div>
                <div className="media-body text-right">
                  <h3 className="font-weight-semibold mb-0">{grantCount}</h3>
                  <span className="text-uppercase font-size-sm text-muted">Grants Applied</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
              <div className="media">
                <div className="mr-3 align-self-center">
                  <i className="fas fa-check-circle fa-3x text-indigo"></i> {/* FontAwesome icon */}
                </div>
                <div className="media-body text-right">
                <h3 className="font-weight-semibold mb-0">{approvedCount}</h3>
                  <span className="text-uppercase font-size-sm text-muted">Grants Approved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
              <div className="media">
                <div className="mr-3 align-self-center">
                  <i className="fas fa-spinner fa-3x text-primary"></i> {/* FontAwesome icon */}
                </div>
                <div className="media-body text-right">
                <h3 className="font-weight-semibold mb-0">{pendingCount}</h3>
                  <span className="text-uppercase font-size-sm text-muted">Pending Approval</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
              <div className="media">
                <div className="mr-3 align-self-center">
                  <i className="fas fa-times-circle fa-3x text-danger"></i> {/* FontAwesome icon */}
                </div>
                <div className="media-body text-right">
                <h3 className="font-weight-semibold mb-0">{rejectedCount}</h3>
                  <span className="text-uppercase font-size-sm text-muted">Grants Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
            {/* Subgrantees Metrics */}
         <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
              <div className="media">
                <div className="media-body">
                <h3 className="font-weight-semibold mb-0">{subgranteeCount}</h3>
                  <span className="text-uppercase font-size-sm text-muted">Total Subgrantees</span>
                </div>
                <div className="ml-3 align-self-center">
                  <i className="fas fa-users fa-3x text-success"></i> {/* FontAwesome icon */}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
              <div className="media">
                <div className="media-body">
                <h3 className="font-weight-semibold mb-0">{activeSubgranteeCount}</h3>
                  <span className="text-uppercase font-size-sm text-muted">Active Subgrantees</span>
                </div>
                <div className="ml-3 align-self-center">
                  <i className="fas fa-user-check fa-3x text-indigo"></i> {/* FontAwesome icon */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
              <div className="media">
                <div className="media-body">
                  <h3 className="font-weight-semibold mb-0">95%</h3>
                  <span className="text-uppercase font-size-sm text-muted">Compliance Rate</span>
                </div>
                <div className="ml-3 align-self-center">
                  <i className="fas fa-chart-line fa-3x text-primary"></i> {/* FontAwesome icon */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card card-body">
            <div className="media">
                <div className="media-body">
                    <h3 className="font-weight-semibold mb-0">$3M</h3>
                    <span className="text-uppercase font-size-sm text-muted">Funds Disbursed</span>
                </div>
                <div className="ml-3 align-self-center">
                    <i className="fas fa-piggy-bank fa-3x text-danger"></i> {/* FontAwesome icon */}
                </div>
                </div>
                </div>
                </div>
        </div>       

        <div className="row">
          <div className="col-sm-6 col-xl-6">
            <div className="card card-body">
              <div className="media">
                <div className="media-body">
                  <h3 className="font-weight-semibold mb-0">$5M</h3>
                  <span className="text-uppercase font-size-sm text-muted">Funding Received</span>
                </div>
                <div className="ml-3 align-self-center">
                  <i className="fas fa-dollar-sign fa-3x text-success"></i> {/* FontAwesome icon */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-6">
            <div className="card card-body">
              <div className="media">
                <div className="mr-3 align-self-center">
                  <i className="fas fa-chart-bar fa-3x text-indigo"></i> {/* FontAwesome icon */}
                </div>
                <div className="media-body text-right">
                  <h3 className="font-weight-semibold mb-0">75%</h3>
                  <span className="text-uppercase font-size-sm text-muted">Funding Utilization</span>
                </div>
              </div>
            </div>
          </div>
        </div>   
    </div>
  );
};

export default Dashboard;
