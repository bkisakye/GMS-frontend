import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";

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

const errorStyle = {
  color: "red",
  fontSize: "14px",
  marginBottom: "15px",
};

const Staff = () => {
  const [formData, setFormData] = useState({
    staff_male: "",
    staff_female: "",
    volunteers_male: "",
    volunteers_female: "",
    staff_dedicated_to_me: "",
    me_responsibilities: "",
    me_coverage: "",
    gender_inclusion: "",
    finance_manager: "",
    finance_manager_details: "",
  });

  const [errors, setErrors] = useState({});
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
      navigate('/profile/implementation');
    } else {
      console.error("Failed to update profile");
    }
    
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label>In your organization, how many staff are on contract?</label>
      <div style={fieldStyle}>
        <label htmlFor="staff_male" style={labelStyle}>
          Male
        </label>
        <input
          type="number"
          id="staff_male"
          name="staff_male"
          value={formData.staff_male}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="staff_female" style={labelStyle}>
          Female
        </label>
        <input
          type="number"
          id="staff_female"
          name="staff_female"
          value={formData.staff_female}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <label>Number of volunteers</label>
      <div style={fieldStyle}>
        <label htmlFor="volunteers_male" style={labelStyle}>
          Male
        </label>
        <input
          type="number"
          id="volunteers_male"
          name="volunteers_male"
          value={formData.volunteers_male}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="volunteers_female" style={labelStyle}>
          Female
        </label>
        <input
          type="number"
          id="volunteers_female"
          name="volunteers_female"
          value={formData.volunteers_female}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Do you have staff dedicated to M&E?</label>
        <div>
          <label>
            <input
              type="radio"
              name="staff_dedicated_to_me"
              value="yes"
              checked={formData.staff_dedicated_to_me}
              onChange={(e) => setFormData({
               ...formData,
                staff_dedicated_to_me: e.target.value,
              })}
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="staff_dedicated_to_me"
              value="no"
              checked={!formData.staff_dedicated_to_me}
              onChange={(e) => setFormData({
               ...formData,
                staff_dedicated_to_me: !e.target.value,
              })}
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>
      {formData.staff_dedicated_to_me && (
        <div style={fieldStyle}>
          <label htmlFor="me_responsibilities" style={labelStyle}>
            What are their main responsibilities?
          </label>
          <textarea
            id="me_responsibilities"
            name="me_responsibilities"
            value={formData.me_responsibilities}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
      )}
      {!formData.staff_dedicated_to_me && (
        <div style={fieldStyle}>
          <label htmlFor="me_coverage" style={labelStyle}>
            Within the organization, how do you cover the M&E functions (who
            does what)?
          </label>
          <textarea
            id="me_coverage"
            name="me_coverage"
            value={formData.me_coverage}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
      )}
      <div style={fieldStyle}>
        <label htmlFor="gender_inclusion" style={labelStyle}>
          How are gender and/or social inclusion and rights mainstreamed into
          your programming?
        </label>
        <textarea
          id="gender_inclusion"
          name="gender_inclusion"
          value={formData.gender_inclusion}
          onChange={handleChange}
          style={textareaStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>
          Do you have a full-time finance manager or equivalent position?
        </label>
        <div>
          <label>
            <input
              type="radio"
              name="finance_manager"
              value="yes"
              checked={formData.finance_manager}
              onChange={(e) => setFormData({
               ...formData,
                finance_manager: e.target.value,
              })}
              style={{ marginRight: "5px" }}
            />
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="finance_manager"
              value="no"
              checked={!formData.finance_manager}
              onChange={(e) => setFormData({
               ...formData,
                finance_manager: !e.target.value,
              })}
              style={{ marginRight: "5px" }}
            />
            No
          </label>
        </div>
      </div>
      {!formData.finance_manager && (
        <div style={fieldStyle}>
          <label htmlFor="finance_manager_details" style={labelStyle}>
            Who handles the finance? How would you manage the financial
            operations if awarded an agreement/contract by BAYLOR-UGANDA?
          </label>
          <textarea
            id="finance_manager_details"
            name="finance_manager_details"
            value={formData.finance_manager_details}
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

export default Staff;
