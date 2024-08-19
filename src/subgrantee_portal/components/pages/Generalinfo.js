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

const fieldContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
};

const fieldStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "5px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box",
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
  gridColumn: "1 / span 2", // Span across both columns
};



const SubgranteeForm = () => {
  const [formData, setFormData] = useState({
    organisation_name: "",
    organisation_address: "",
    contact_person: "",
    secondary_contact: "",
    district: "",
    category: "",
    acronym: "",
    website: "",
    executive_director_name: "",
    executive_director_contact: "",
    board_chair_name: "",
    board_chair_contact: "",
    created_date: "",
    most_recent_registration_date: "",
    registration_number: "",
    has_mission_vision_values: false,
    mission: "",
    vision: "",
    core_values: "",
  });

  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);

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

        // Fetch districts
        const districtResponse = await fetchWithAuth(
          "/api/subgrantees/districts/"
        );
        const districtData = await districtResponse.json();
        console.log("Fetched Districts Data:", districtData);

        // Access the nested districts array
        if (
          Array.isArray(districtData) &&
          districtData.length > 0 &&
          Array.isArray(districtData[0].districts)
        ) {
          setDistricts(districtData[0].districts);
        } else {
          console.error("Invalid districts data format:", districtData);
        }

        // Fetch categories
        const categoryResponse = await fetchWithAuth(
          "/api/subgrantees/category/"
        );
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
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
      navigate('/organizationdescription')
    } else {
      console.error("Failed to update profile");
    }
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldContainerStyle}>
        <div style={fieldStyle}>
          <label htmlFor="organisation_name" style={labelStyle}>
            Name of Organization (please spell out)
          </label>
          <input
            type="text"
            id="organisation_name"
            name="organisation_name"
            value={formData.user?.organisation_name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="acronym" style={labelStyle}>
            Acronym for the Organization
          </label>
          <input
            type="text"
            id="acronym"
            name="acronym"
            value={formData.acronym}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="organisation_address" style={labelStyle}>
            Organisation Address:
          </label>
          <input
            type="text"
            id="organisation_address"
            name="organisation_address"
            value={formData.organisation_address}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="contact_person" style={labelStyle}>
            Contact Person (if other than the Executive Director)
          </label>
          <input
            type="text"
            id="contact_person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="secondary_contact" style={labelStyle}>
            Secondary Contact:
          </label>
          <input
            type="text"
            id="secondary_contact"
            name="secondary_contact"
            value={formData.secondary_contact}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="district" style={labelStyle}>
            District:
          </label>
          <select
            id="district"
            name="district"
            value={formData.district.id}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value={formData.district.id} key={formData.district.id}>
              {formData.district.name}
            </option>
            {/* Add more options here with the current one excluded */}
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="category" style={labelStyle}>
            Subgrantee Category:
          </label>
          <select
            id="category"
            name="category"
            value={formData.category.id}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value={formData.category.id} key={formData.category.id}>
              {formData.category.name}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="website" style={labelStyle}>
            Website (if applicable)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="executive_director_name" style={labelStyle}>
            Executive Director(Head) Name:
          </label>
          <input
            type="text"
            id="executive_director_name"
            name="executive_director_name"
            value={formData.executive_director_name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="executive_director_contact" style={labelStyle}>
            Executive Director(Head) Contact:
          </label>
          <input
            type="text"
            id="executive_director_contact"
            name="executive_director_contact"
            value={formData.executive_director_contact}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="board_chair_name" style={labelStyle}>
            Board Chair Name:
          </label>
          <input
            type="text"
            id="board_chair_name"
            name="board_chair_name"
            value={formData.board_chair_name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="board_chair_contact" style={labelStyle}>
            Board Chair Contact:
          </label>
          <input
            type="text"
            id="board_chair_contact"
            name="board_chair_contact"
            value={formData.board_chair_contact}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="created_date" style={labelStyle}>
            Date organization formed
          </label>
          <input
            type="date"
            id="created_date"
            name="created_date"
            value={formData.created_date}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="most_recent_registration_date" style={labelStyle}>
            Date of most recent registration
          </label>
          <input
            type="date"
            id="most_recent_registration_date"
            name="most_recent_registration_date"
            value={formData.most_recent_registration_date}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="registration_number" style={labelStyle}>
            Registration number
          </label>
          <input
            type="text"
            id="registration_number"
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            DO YOU HAVE A MISSION, VISION AND CORE VALUES FOR THE ORGANIZATION?
          </label>
          <div>
            <label>
              <input
                type="checkbox"
                name="has_mission_vision_values"
                checked={formData.has_mission_vision_values}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    has_mission_vision_values: e.target.checked,
                  })
                }
                style={{ marginRight: "5px" }}
              />
              Yes
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input
                type="checkbox"
                name="has_mission_vision_values"
                checked={!formData.has_mission_vision_values}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    has_mission_vision_values: !e.target.checked,
                  })
                }
                style={{ marginRight: "5px" }}
              />
              No
            </label>
          </div>
        </div>
      </div>

      {formData.has_mission_vision_values && (
        <>
          <div style={fieldStyle}>
            <label htmlFor="mission" style={labelStyle}>
              Mission:
            </label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="vision" style={labelStyle}>
              Vision:
            </label>
            <textarea
              id="vision"
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="core_values" style={labelStyle}>
              Core Values:
            </label>
            <textarea
              id="core_values"
              name="core_values"
              value={formData.core_values}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>
        </>
      )}

      <button type="submit" style={buttonStyle}>
        Submit
      </button>
    </form>
  );
};

export default SubgranteeForm;
