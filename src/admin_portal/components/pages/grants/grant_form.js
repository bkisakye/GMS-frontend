import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const containerStyle = {
  maxWidth: "800px",
  margin: "auto",
  padding: "2rem",
};

const cardStyle = {
  border: "1px solid #dee2e6",
  borderRadius: "0.375rem",
  boxShadow: "0 0 0.125rem rgba(0,0,0,0.075)",
};

const cardHeaderStyle = {
  backgroundColor: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
};

const cardBodyStyle = {
  padding: "2rem",
};

const labelStyle = {
  fontWeight: "bold",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  border: "none",
};

const buttonHoverStyle = {
  backgroundColor: "#0056b3",
};

const Subgrantees = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    selectedGrantTypes: [],
    selectedDonors: [],
    selectedDistricts: [],
    amount: "",
    numberOfAwards: "",
    eligibilityDetails: "",
    grantTypes: [],
    donors: [],
    districts: [],
    kpis: [],
    reporting_time: "",
    errorMessage: "",
    successMessage: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const grantTypeResponse = await fetchWithAuth(
          "/api/grants/grant-types/"
        );
        const grantTypeData = await grantTypeResponse.json();
        if (Array.isArray(grantTypeData)) {
          // Case where the response is an array
          setFormData((prevState) => ({
            ...prevState,
            grantTypes: grantTypeData,
          }));
        } else if (
          grantTypeData.results &&
          Array.isArray(grantTypeData.results)
        ) {
          // Case where the response is an object with a results array
          setFormData((prevState) => ({
            ...prevState,
            grantTypes: grantTypeData.results,
          }));
        } else {
          console.error("Invalid grantTypes data format:", grantTypeData);
          setFormData((prevState) => ({
            ...prevState,
            errorMessage: "Invalid grant types data format.",
          }));
        }

        const donorResponse = await fetchWithAuth("/api/grants/donors/");
        const donorData = await donorResponse.json();
        if (Array.isArray(donorData)) {
          // Case where the response is an array
          setFormData((prevState) => ({
            ...prevState,
            donors: donorData,
          }));
        } else if (donorData.results && Array.isArray(donorData.results)) {
          // Case where the response is an object with a results array
          setFormData((prevState) => ({
            ...prevState,
            donors: donorData.results,
          }));
        } else {
          console.error("Invalid donor data format:", donorData);
          setFormData((prevState) => ({
            ...prevState,
            errorMessage: "Invalid donor data format.",
          }));
        }

        const districtResponse = await fetchWithAuth(
          "/api/subgrantees/districts/"
        );
        const districtData = await districtResponse.json();
        if (
          Array.isArray(districtData) &&
          districtData.length > 0 &&
          Array.isArray(districtData[0].districts)
        ) {
          // Case where the response is an array of objects containing districts
          setFormData((prevState) => ({
            ...prevState,
            districts: districtData[0].districts,
          }));
        } else if (
          districtData.results &&
          Array.isArray(districtData.results)
        ) {
          // Case where the response is an object with a results array
          setFormData((prevState) => ({
            ...prevState,
            districts: districtData.results,
          }));
        } else {
          console.error("Invalid districts data format:", districtData);
          setFormData((prevState) => ({
            ...prevState,
            errorMessage: "Invalid districts data format.",
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFormData((prevState) => ({
          ...prevState,
          errorMessage: "Error fetching data. Please try again.",
        }));
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedDistricts: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      description,
      startDate,
      endDate,
      applicationDeadline,
      category,
      donor,
      selectedDistricts,
      amount,
      numberOfAwards,
      kpis,
      eligibilityDetails,
      reporting_time,
    } = formData;

    const grantData = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      application_deadline: applicationDeadline,
      category,
      kpis,
      donor,
      district: selectedDistricts.map((option) => option.value),
      amount,
      number_of_awards: numberOfAwards,
      eligibility_details: eligibilityDetails,
      reporting_time,
    };

    console.log("grant data", grantData);

    try {
      const response = await fetchWithAuth("/api/grants/grants/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(grantData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Grant created successfully:", result);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        applicationDeadline: "",
        category: "",
        kpis: [],
        donor: "",
        selectedDistricts: [],
        amount: "",
        numberOfAwards: "",
        eligibilityDetails: "",
        reporting_time: "",
        grantTypes: formData.grantTypes,
        donors: formData.donors,
        districts: formData.districts,
        successMessage: "Grant created successfully!",
        errorMessage: "",
      });

      window.location.reload();
    } catch (error) {
      console.error("Error creating grant:", error);
      setFormData((prevState) => ({
        ...prevState,
        errorMessage: "Error creating grant. Please try again.",
      }));
    }
  };

  const {
    name,
    description,
    startDate,
    endDate,
    applicationDeadline,
    category,
    donor,
    selectedDistricts,
    grantTypes,
    donors,
    kpis,
    reporting_time,
    districts,
    amount,
    numberOfAwards,
    eligibilityDetails,
    errorMessage,
    successMessage,
  } = formData;

  const grantTypeOptions = grantTypes.map((type) => ({
    label: type.name,
    value: type.id,
  }));

  const donorOptions = donors.map((donor) => ({
    label: donor.name,
    value: donor.id,
  }));

  const districtOptions = districts.map((district) => ({
    label: district.name,
    value: district.id,
  }));

    const reportingTimeOptions = [
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
      { value: "annually", label: "Annually" },
      { value: "weekly", label: "Weekly" },
    ];

  return (
    <div className="container" style={containerStyle}>
      <div className="card" style={cardStyle}>
        <div className="card-header" style={cardHeaderStyle}>
          <h5 className="mb-0">Add a New Grant</h5>
        </div>
        <div className="card-body" style={cardBodyStyle}>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <fieldset
              style={{
                border: "0",
                padding: "0",
                margin: "0",
                boxShadow: "none",
              }}
            >
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter grant name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Category:
                  </label>
                  <select
                    name="category"
                    value={category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    {grantTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label" style={labelStyle}>
                    Description:
                  </label>
                  <textarea
                    name="description"
                    value={description}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Enter grant description"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Start Date:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={startDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    End Date:
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={endDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Application Deadline:
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={applicationDeadline}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Donor:
                  </label>
                  <select
                    name="donor"
                    value={donor}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Donor</option>
                    {donorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  Districts:
                </label>
                <MultiSelect
                  options={districtOptions}
                  value={selectedDistricts}
                  onChange={handleMultiSelectChange}
                  labelledBy="Select"
                />
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Amount:
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Number of Awards:
                  </label>
                  <input
                    type="number"
                    name="numberOfAwards"
                    value={numberOfAwards}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter number of awards"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Reporting Time:</label>
                <select
                  name="reporting_time"
                  value={reporting_time}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Reporting Time</option>
                  {reportingTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  Key Performance Indicators:
                </label>
                <textarea
                  name="kpis"
                  value={kpis}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter Key Performance Indicators"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  Eligibility Details:
                </label>
                <textarea
                  name="eligibilityDetails"
                  value={eligibilityDetails}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter eligibility details"
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{ ...buttonStyle, color: "#fff" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    buttonHoverStyle.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    buttonStyle.backgroundColor)
                }
              >
                Submit
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Subgrantees;
