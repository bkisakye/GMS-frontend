import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";

const MetricCard = ({ icon, value, label }) => (
  <div className="card h-100">
    <div className="card-body d-flex justify-content-between align-items-center">
      <div>
        <h5 className="card-title">{value}</h5>
        <p className="card-text text-muted">{label}</p>
      </div>
      <div className="display-4 text-primary">{icon}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    grantCount: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    subgranteeCount: 0,
    activeSubgranteeCount: 0,
    complianceCheck: 0,
    disbursementAmount: 0,
    fundingReceived: 5, // Hardcoded as per original
    fundingUtilization: 75, // Hardcoded as per original
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const responses = await Promise.all([
          fetchWithAuth("/api/grants/grant-applications/count/"),
          fetchWithAuth("/api/grants/grant-applications/approve/count/"),
          fetchWithAuth("/api/grants/grant-applications/pending/count/"),
          fetchWithAuth("/api/grants/grant-applications/rejected/count/"),
          fetchWithAuth("/api/authentication/subgrantees/count/"),
          fetchWithAuth("/api/authentication/active-subgrantees/count/"),
          fetchWithAuth("/api/grants/signed-applications-percentage/"),
          fetchWithAuth("/api/grants/total-disbursements/"),
        ]);

        const [
          grantCount,
          approvedCount,
          pendingCount,
          rejectedCount,
          subgranteeCount,
          activeSubgranteeCount,
          complianceCheck,
          disbursementAmount,
        ] = await Promise.all(responses.map((r) => r.json()));

        setMetrics({
          ...metrics,
          grantCount: grantCount.count,
          approvedCount: approvedCount.count,
          pendingCount: pendingCount.count,
          rejectedCount: rejectedCount.count,
          subgranteeCount: subgranteeCount.count,
          activeSubgranteeCount: activeSubgranteeCount.count,
          complianceCheck: complianceCheck.signed_percentage,
          disbursementAmount: disbursementAmount.total_disbursements,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="container py-5">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div className="col">
          <MetricCard
            icon="📄"
            value={metrics.grantCount}
            label="Grants Applied"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="✅"
            value={metrics.approvedCount}
            label="Grants Approved"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="⏳"
            value={metrics.pendingCount}
            label="Pending Approval"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="❌"
            value={metrics.rejectedCount}
            label="Grants Rejected"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="👥"
            value={metrics.subgranteeCount}
            label="Total Subgrantees"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="🏃"
            value={metrics.activeSubgranteeCount}
            label="Active Subgrantees"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="📊"
            value={`${metrics.complianceCheck}%`}
            label="Compliance Rate"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="💰"
            value={`$${metrics.disbursementAmount}M`}
            label="Funds Disbursed"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="💵"
            value={`$${metrics.fundingReceived}M`}
            label="Funding Received"
          />
        </div>
        <div className="col">
          <MetricCard
            icon="📈"
            value={`${metrics.fundingUtilization}%`}
            label="Funding Utilization"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
