import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";

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

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

const hoverStyle = {
  backgroundColor: "#f1f1f1",
};

const FinancialAdmin = () => {
  const [formData, setFormData] = useState({
    accounting_system: "",
    finance_and_admin_dtl_finance_admin_manual: "",
    finance_and_admin_dtl_finance_admin_manual_updated_date: "",
    finance_and_admin_dtl_finance_admin_manual_reason: "",
    finance_and_admin_dtl_hr_manual: "",
    finance_and_admin_dtl_hr_manual_updated_date: "",
    finance_and_admin_dtl_hr_manual_reason: "",
    finance_and_admin_dtl_anti_corruption_policy: "",
    finance_and_admin_dtl_audits_in_last_three_years: "",
    audit_name: "",
    audit_description: "",
    audit_date: "",
    audit_issue_raised: "",
    audit_action_taken: "",
    finance_and_admin_dtl_audit_details_not: "",
    finance_and_admin_dtl_forensic_audit: "",
    finance_and_admin_dtl_forensic_audit_details: "",
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
    e.preventDefault();
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
      navigate('/profile/technicalskills');
    } else {
      console.error("Failed to update profile");
    }
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="accounting_system" style={labelStyle}>
          What accounting system do you use?
        </label>
        <input
          type="text"
          id="accounting_system"
          name="accounting_system"
          value={formData.accounting_system}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>
          Do you have a Finance/ Administration Manual?
        </label>
        <div>
          <label>
            <input
              type="radio"
              name="finance_and_admin_dtl_finance_admin_manual"
              value="yes"
              checked={formData.finance_and_admin_dtl_finance_admin_manual}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_finance_admin_manual: e.target.value})}
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="finance_and_admin_dtl_finance_admin_manual"
              value="no"
              checked={!formData.finance_and_admin_dtl_finance_admin_manual}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_finance_admin_manual: !e.target.value})}
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>
      {formData.finance_and_admin_dtl_finance_admin_manual && (
        <>
          <div style={fieldStyle}>
            <label
              htmlFor="finance_and_admin_dtl_finance_admin_manual_updated_date"
              style={labelStyle}
            >
              When was it last updated?
            </label>
            <input
              type="date"
              id="finance_and_admin_dtl_finance_admin_manual_updated_date"
              name="finance_and_admin_dtl_finance_admin_manual_updated_date"
              value={
                formData.finance_and_admin_dtl_finance_admin_manual_updated_date
              }
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </>
      )}
      {!formData.finance_and_admin_dtl_finance_admin_manual && (
        <>
          <div style={fieldStyle}>
            <label
              htmlFor="finance_and_admin_dtl_finance_admin_manual_reason"
              style={labelStyle}
            >
              Why not? Please also describe how you diagnose and respond to
              needs for improvement within your organization. Please provide a
              few examples of this.
            </label>
            <textarea
              id="finance_and_admin_dtl_finance_admin_manual_reason"
              name="finance_and_admin_dtl_finance_admin_manual_reason"
              value={formData.finance_and_admin_dtl_finance_admin_manual_reason}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>
        </>
      )}
      <div style={fieldStyle}>
        <label style={labelStyle}>Do you have a Human Resource Manual?</label>
        <div>
          <label>
            <input
              type="radio"
              name="finance_and_admin_dtl_hr_manual"
              value="yes"
              checked={formData.finance_and_admin_dtl_hr_manual}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_hr_manual: e.target.value})}
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="finance_and_admin_dtl_hr_manual"
              value="no"
              checked={!formData.finance_and_admin_dtl_hr_manual}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_hr_manual: !e.target.value})}
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>
      {formData.finance_and_admin_dtl_hr_manual && (
        <>
          <div style={fieldStyle}>
            <label
              htmlFor="finance_and_admin_dtl_hr_manual_updated_date"
              style={labelStyle}
            >
              When was it last updated?
            </label>
            <input
              type="date"
              id="finance_and_admin_dtl_hr_manual_updated_date"
              name="finance_and_admin_dtl_hr_manual_updated_date"
              value={formData.finance_and_admin_dtl_hr_manual_updated_date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </>
      )}
      {!formData.finance_and_admin_dtl_hr_manual && (
        <>
          <div style={fieldStyle}>
            <label
              htmlFor="finance_and_admin_dtl_hr_manual_reason"
              style={labelStyle}
            >
              Why not?
            </label>
            <textarea
              id="finance_and_admin_dtl_hr_manual_reason"
              name="finance_and_admin_dtl_hr_manual_reason"
              value={formData.finance_and_admin_dtl_hr_manual_reason}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>
        </>
      )}
      <div style={fieldStyle}>
        <label style={labelStyle}>
          Do you have an anti-corruption and/or whistleblower policy?
        </label>
        <div>
          <label>
            <input
              type="radio"
              name="finance_and_admin_dtl_anti_corruption_policy"
              value="yes"
              checked={formData.finance_and_admin_dtl_anti_corruption_policy}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_anti_corruption_policy: e.target.value})}
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="finance_and_admin_dtl_anti_corruption_policy"
              value="no"
              checked={!formData.finance_and_admin_dtl_anti_corruption_policy}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_anti_corruption_policy: !e.target.value})}
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>
          Have you had one or more audits within the last three years?
        </label>
        <div>
          <label>
            <input
              type="radio"
              name="finance_and_admin_dtl_audits_in_last_three_years"
              value="yes"
              checked={
                formData.finance_and_admin_dtl_audits_in_last_three_years
              }
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_audits_in_last_three_years: e.target.value})}
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="finance_and_admin_dtl_audits_in_last_three_years"
              value="no"
              checked={
                !formData.finance_and_admin_dtl_audits_in_last_three_years
              }
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_audits_in_last_three_years: !e.target.value})}
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>
      {formData.finance_and_admin_dtl_audits_in_last_three_years && (
        <>
          <div style={fieldStyle}>
            <label htmlFor="audit_name" style={labelStyle}>
              What kind of audit? (e.g., external, institutional, project,
              forensic, other – please describe)
            </label>
            <textarea
              id="audit_name"
              name="audit_name"
              value={formData.audit_name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <label htmlFor="audit_description" style={labelStyle}>
            Did you receive a qualified opinion? Please list any issues raised
            in the audits and what you did to correct them 
          </label>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Audit Date</th>
                <th style={thStyle}>Issues Raised</th>
                <th style={thStyle}>Actions Taken</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="audit_date"
                      value={formData.audit_date}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="audit_issue_raised"
                      value={formData.audit_issue_raised}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="audit_action_taken"
                      value={formData.audit_action_taken}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </td>
                </tr>
            </tbody>
          </table>
        </>
      )}
      {!formData.finance_and_admin_dtl_audits_in_last_three_years && (
        <div style={fieldStyle}>
          <label
            htmlFor="finance_and_admin_dtl_audit_details_not"
            style={labelStyle}
          >
            If no, please describe how you diagnose and respond to needs for
            improvement within your organization. Include examples.
          </label>
          <textarea
            id="finance_and_admin_dtl_audit_details_not"
            name="finance_and_admin_dtl_audit_details_not"
            value={formData.finance_and_admin_dtl_audit_details_not}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
      )}
      <div style={fieldStyle}>
        <label style={labelStyle}>Have you undergone a forensic audit?</label>
        <div>
          <label>
            <input
              type="radio"
              name="finance_and_admin_dtl_forensic_audit"
              value="yes"
              checked={formData.finance_and_admin_dtl_forensic_audit}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_forensic_audit: e.target.value})}
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="finance_and_admin_dtl_forensic_audit"
              value="no"
              checked={!formData.finance_and_admin_dtl_forensic_audit}
              onChange={(e) => setFormData({...formData, finance_and_admin_dtl_forensic_audit: !e.target.value})}
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>
      {formData.finance_and_admin_dtl_forensic_audit && (
        <div style={fieldStyle}>
          <label
            htmlFor="finance_and_admin_dtl_forensic_audit_details"
            style={labelStyle}
          >
            Please provide details of the forensic audit
          </label>
          <textarea
            id="finance_and_admin_dtl_forensic_audit_details"
            name="finance_and_admin_dtl_forensic_audit_details"
            value={formData.finance_and_admin_dtl_forensic_audit_details}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
      )}
      <button type="submit" style={buttonStyle}>
        Submit
      </button>
    </form>
  );
};

export default FinancialAdmin;
