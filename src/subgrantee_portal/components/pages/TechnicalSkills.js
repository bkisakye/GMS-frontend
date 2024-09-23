import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";
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

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box",
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

const TechnicalSkills = () => {
  const [formData, setFormData] = useState({
    technical_skills: "",
    technical_skills_comparative_advantage: "",
    technical_skills_monitoring_and_evaluation_capacity: "",
    technical_skills_impact_determination: "",
    technical_skills_external_evaluation_conducted: "",
    technical_skills_external_evaluation_details: "",
    technical_skills_external_evaluation_details_not: "",
    technical_skills_evaluation_use: "",
  });
  const { loadingStates, handleLoading } = useLoadingHandler();
  const navigate = useNavigate();

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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
        
        navigate("/profile/staff");
      } else {
        console.error("Failed to update profile");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="technical_skills" style={labelStyle}>
          Describe your organization’s technical skills / capacity in relation
          to the proposed intervention areas
        </label>
        <textarea
          id="technical_skills"
          name="technical_skills"
          value={formData.technical_skills}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <label>Demonstrated comparative advantage</label>
      <div style={fieldStyle}>
        <label
          htmlFor="technical_skills_comparative_advantage"
          style={labelStyle}
        >
          Describe your “competitive/comparative advantage”. What is your niche?
        </label>
        <textarea
          id="technical_skills_comparative_advantage"
          name="technical_skills_comparative_advantage"
          value={formData.technical_skills_comparative_advantage}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label
          htmlFor="technical_skills_monitoring_and_evaluation_capacity"
          style={labelStyle}
        >
          Describe your organization’s M&E capacity including information on the
          M&E systems (M&E unit, evaluation plan, data collection, data
          management, data storage and retrieval etc.) you use.
        </label>
        <textarea
          id="technical_skills_monitoring_and_evaluation_capacity"
          name="technical_skills_monitoring_and_evaluation_capacity"
          value={formData.technical_skills_monitoring_and_evaluation_capacity}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label
          htmlFor="technical_skills_impact_determination"
          style={labelStyle}
        >
          How do you determine what is working or having an impact from your
          work and what is not working or having no impact?
        </label>
        <textarea
          id="technical_skills_impact_determination"
          name="technical_skills_impact_determination"
          value={formData.technical_skills_impact_determination}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>
          Have you conducted an external programmatic evaluation of your work in
          the last 1 year?
        </label>
        <div>
          <label>
            <input
              type="radio"
              name="technical_skills_external_evaluation_conducted"
              value="yes"
              checked={formData.technical_skills_external_evaluation_conducted}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technical_skills_external_evaluation_conducted:
                    e.target.value,
                })
              }
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="technical_skills_external_evaluation_conducted"
              value="no"
              checked={!formData.technical_skills_external_evaluation_conducted}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technical_skills_external_evaluation_conducted:
                    !e.target.value,
                })
              }
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>

      {formData.technical_skills_external_evaluation_conducted && (
        <div style={fieldStyle}>
          <label
            htmlFor="technical_skills_external_evaluation_details"
            style={labelStyle}
          >
            How was it conducted?
          </label>
          <textarea
            id="technical_skills_external_evaluation_details"
            name="technical_skills_external_evaluation_details"
            value={formData.technical_skills_external_evaluation_details}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
      )}

      {!formData.technical_skills_external_evaluation_conducted && (
        <div style={fieldStyle}>
          <label
            htmlFor="technical_skills_external_evaluation_details_not"
            style={labelStyle}
          >
            Why not?
          </label>
          <textarea
            id="technical_skills_external_evaluation_details_not"
            name="technical_skills_external_evaluation_details_not"
            value={formData.technical_skills_external_evaluation_details_not}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
      )}

      <div style={fieldStyle}>
        <label htmlFor="technical_skills_evaluation_use" style={labelStyle}>
          How do you use/apply what you have learned from evaluations (internal
          or external) of your work?
        </label>
        <textarea
          id="technical_skills_evaluation_use"
          name="technical_skills_evaluation_use"
          value={formData.technical_skills_evaluation_use}
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

export default TechnicalSkills;
