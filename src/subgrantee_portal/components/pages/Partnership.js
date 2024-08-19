import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";

const PartnershipAndSubgrants = () => {
 const [formData, setFormData] = useState({
   partnership_name: "",
   partnership_period: "",
   partnership_description: "",
   subgrant_donor: "",
   subgrant_amount: "",
   subgrant_duration: "",
   subgrant_description: "",
 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await fetchWithAuth(
          "/api/subgrantees/profiles/me/"
        );
        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData);
        setFormData((prevData) => ({
          ...prevData,
          ...profileData,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("Form Data:", formData);
    const response = await fetchWithAuth("/api/subgrantees/profiles/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      console.log("Profile updated successfully");
      navigate("/technicalskills");
    } else {
      console.error("Failed to update profile");
    }
    e.preventDefault();
  };

  const formStyle = {
    width: "80%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "25px 0",
    fontSize: "16px",
    textAlign: "left",
  };

  const thTdStyle = {
    padding: "12px 15px",
    border: "1px solid #ddd",
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#f2f2f2",
    color: "#333",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const tbodyTrStyle = (isEven) => ({
    backgroundColor: isEven ? "#f9f9f9" : "#fff",
  });

  const buttonStyle = {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* Partnership Table */}
      <label style={labelStyle}>
        Please list any organization or entity (government, national or
        international) with which your organization has had (or currently has) a
        working relationship that does not involve a contract or funding.
      </label>
      <p>
        Organizations from which you have received funding are included above
        and those you have funded are listed below [please add lines if needed]
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name of organization/ entity</th>
            <th style={thStyle}>
              Briefly describe the relationship/ engagement
            </th>
            <th style={thStyle}>When [period]</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={thTdStyle}>
              <input
                type="text"
                name="partnership_name"
                value={formData.partnership_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <textarea
                name="partnership_description"
                value={formData.partnership_description}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <input
                type="text"
                name="partnership_period"
                value={formData.partnership_period}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Subgrants Table */}
      <label style={labelStyle}>
        Have you ever sub-granted or sub-contracted to another organization in
        the past 3 years? Please list details
      </label>
      <p>[please add lines if needed]</p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name of organization</th>
            <th style={thStyle}>Period</th>
            <th style={thStyle}>Purpose</th>
            <th style={thStyle}>Amount (UGX)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={thTdStyle}>
              <input
                type="text"
                name="subgrant_donor"
                value={formData.subgrant_donor}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <input
                type="text"
                name="subgrant_duration"
                value={formData.subgrant_duration}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <textarea
                name="subgrant_description"
                value={formData.subgrant_description}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <input
                type="number"
                name="subgrant_amount"
                value={formData.subgrant_amount}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button type="submit" style={buttonStyle}>
        Save Partnerships & Subgrants
      </button>
    </form>
  );
};

export default PartnershipAndSubgrants;
