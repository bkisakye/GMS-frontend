import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './Dashboard.css'; 

const Dashboard = () => {
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
                  <h3 className="font-weight-semibold mb-0">150</h3>
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
                  <h3 className="font-weight-semibold mb-0">100</h3>
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
                  <h3 className="font-weight-semibold mb-0">35</h3>
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
                  <h3 className="font-weight-semibold mb-0">15</h3>
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
                  <h3 className="font-weight-semibold mb-0">200</h3>
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
                  <h3 className="font-weight-semibold mb-0">180</h3>
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
