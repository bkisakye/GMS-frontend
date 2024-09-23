import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import useLoadingHandler from "../../hooks/useLoadingHandler";

const formStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
};

const fieldStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "5px",
};

const textareaStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box",
  minHeight: "100px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
};

const CapacityForm = () => {
  const [formData, setFormData] = useState({
    organization_description: "",
    role_on_board: "",
    meeting_frequency_of_board: "",
    last_three_meetings_of_board: "",
  });
  const navigate = useNavigate();
  const { loadingStates, handleLoading } = useLoadingHandler();

  useEffect(() => {
    const fetchData = async () => {
      await handleLoading("fetchData", async () => {
        const profileResponse = await fetchWithAuth(
          "/api/subgrantees/profiles/me/"
        );
        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData);
        setFormData((prevData) => ({
          ...prevData,
          ...profileData,
        }));
      });
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    await handleLoading("SubmitData", async () => {
      const response = await fetchWithAuth("/api/subgrantees/profiles/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Profile updated successfully");
        navigate("/profile/financial");
      } else {
        console.error("Failed to update profile");
      }
      e.preventDefault();
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="organization_description" style={labelStyle}>
          Provide a brief description of your organization and its programmatic
          and financial/administrative management capacity to implement the
          proposed interventions.
        </label>
        <textarea
          id="organization_description"
          name="organization_description"
          value={formData.organization_description}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <label>
        Please provide the following information about your Board of Directors:
      </label>

      <div style={fieldStyle}>
        <label htmlFor="role_on_board" style={labelStyle}>
          Role of the Board
        </label>
        <textarea
          id="role_on_board"
          name="role_on_board"
          value={formData.role_on_board}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="meeting_frequency_of_board" style={labelStyle}>
          How often does the Board meet?
        </label>
        <input
          type="text"
          id="meeting_frequency_of_board"
          name="meeting_frequency_of_board"
          value={formData.meeting_frequency_of_board}
          onChange={handleChange}
          // style={textStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="last_three_meetings_of_board" style={labelStyle}>
          Provide the dates of the last 3 Board meetings
        </label>
        <textarea
          id="last_three_meetings_of_board"
          name="last_three_meetings_of_board"
          value={formData.last_three_meetings_of_board}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <button type="submit" style={buttonStyle} disabled={loadingStates.SubmitData}>
        {loadingStates.SubmitData ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CapacityForm;
