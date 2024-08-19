import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";

const Implementation = () => {
  const [formData, setFormData] = useState({
    past_project_name: "",
    past_project_timeframe: "",
    past_project_budget: "",
    past_project_outcomes: "",
    past_project_contact_info: "",
    current_project_donor: "",
    current_project_timeframe: "",
    current_project_budget: "",
    current_project_description: "",
    current_project_contact_info: "",
    current_work_emphasizes: "",
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

  const tbodyTrStyle = (isEven) => ({
    backgroundColor: isEven ? "#f9f9f9" : "#fff",
  });

  const hoverStyle = {
    backgroundColor: "#f1f1f1",
  };

  const textareaContainerStyle = {
    margin: "20px 0",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const textareaStyle = {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    resize: "vertical",
  };

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

  const buttonHoverStyle = {
    backgroundColor: "#45a049",
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
      <label style={labelStyle}>
        List of past (completed) projects and contact information [most recent
        5]
      </label>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Project Name</th>
            <th style={thStyle}>Timeframe</th>
            <th style={thStyle}>Budget</th>
            <th style={thStyle}>Outcomes</th>
            <th style={thStyle}>Contact Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={thTdStyle}>
              <input
                type="text"
                name="past_project_name"
                value={formData.past_project_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <input
                type="text"
                name="past_project_timeframe"
                value={formData.past_project_timeframe}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <input
                type="number"
                name="past_project_budget"
                value={formData.past_project_budget}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <textarea
                name="past_project_outcomes"
                value={formData.past_project_outcomes}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <textarea
                name="past_project_contact_info"
                value={formData.past_project_contact_info}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <label style={labelStyle}>
        List of current projects and contact information [all current]
      </label>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Donor</th>
            <th style={thStyle}>Timeframe</th>
            <th style={thStyle}>Budget</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Contact Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={thTdStyle}>
              <input
                type="text"
                name="current_project_donor"
                value={formData.current_project_donor}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <input
                type="text"
                name="current_project_timeframe"
                value={formData.current_project_timeframe}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <input
                type="number"
                name="current_project_budget"
                value={formData.current_project_budget}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <textarea
                name="current_project_description"
                value={formData.current_project_description}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
            <td style={thTdStyle}>
              <textarea
                name="current_project_contact_info"
                value={formData.current_project_contact_info}
                onChange={handleChange}
                style={inputStyle}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={textareaContainerStyle}>
        <label htmlFor="current_work_emphasizes" style={labelStyle}>
          Please describe how your current work includes or emphasizes gender,
          women, or youth
        </label>
        <textarea
          id="current_work_emphasizes"
          name="current_work_emphasizes"
          value={formData.current_work_emphasizes}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <button
        type="submit"
        style={buttonStyle}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = buttonStyle.backgroundColor)
        }
      >
        Save Projects
      </button>
    </form>
  );
};

export default Implementation;
