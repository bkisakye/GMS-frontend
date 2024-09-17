import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

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
  color: "#fff",
};

const buttonHoverStyle = {
  backgroundColor: "#0056b3",
};

const GrantsForm = ({ grant, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    category: "",
    donor: "",
    selectedDistricts: [],
    amount: "",
    numberOfAwards: "",
    eligibilityDetails: "",
    kpis: "",
    reporting_time: "",
  });

  const [grantTypes, setGrantTypes] = useState([]);
  const [donors, setDonors] = useState([]);
  const [districts, setDistricts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const grantTypeResponse = await fetchWithAuth(
          "/api/grants/grant-types/"
        );
        const grantTypeData = await grantTypeResponse.json();
        setGrantTypes(
          Array.isArray(grantTypeData.results)
            ? grantTypeData.results
            : grantTypeData
        );

        const donorResponse = await fetchWithAuth("/api/grants/donors/");
        const donorData = await donorResponse.json();
        setDonors(
          Array.isArray(donorData.results) ? donorData.results : donorData
        );

        const districtResponse = await fetchWithAuth(
          "/api/subgrantees/districts/"
        );
        const districtData = await districtResponse.json();
        setDistricts(
          Array.isArray(districtData.results)
            ? districtData.results
            : districtData[0]?.districts || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (grant && districts.length > 0) {
      console.log(grant); 
      setFormData({
        name: grant.name || "",
        description: grant.description || "",
        startDate: grant.start_date || "",
        endDate: grant.end_date || "",
        applicationDeadline: grant.application_deadline || "",
        category: grant.category_detail?.id || "",
        donor: grant.donor_detail?.id || "",
        selectedDistricts: grant.district_detail
          ? grant.district_detail.map((district) => ({
              value: district.id,
              label: district.name,
            }))
          : [],
        amount: grant.amount || "",
        numberOfAwards: grant.number_of_awards?.toString() || "",
        eligibilityDetails: grant.eligibility_details || "",
        kpis: grant.kpis || "",
        reporting_time: grant.reporting_time || "",
      });
    }
  }, [grant, districts]);
 

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

  const validateForm = () => {
    const {
      name,
      description,
      startDate,
      endDate,
      applicationDeadline,
      category,
      donor,
      amount,
      numberOfAwards,
      eligibilityDetails,
      reporting_time,
    } = formData;
    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !applicationDeadline ||
      !category ||
      !donor ||
      !amount ||
      !numberOfAwards ||
      !eligibilityDetails ||
      !reporting_time
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      number_of_awards: parseInt(numberOfAwards, 10),
      eligibility_details: eligibilityDetails,
      reporting_time,
    };

    try {
      const url = grant
        ? `/api/grants/update-grant/${grant.id}/`
        : "/api/grants/grants/";
      const method = grant ? "PATCH" : "POST";

      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(grantData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit grant data");
      }

      const result = await response.json();
      toast.success(
        grant ? "Grant updated successfully!" : "Grant created successfully!"
      );
      window.location.reload();
      if (onSubmit) {
        onSubmit(result);
      } else {
        setFormData({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          applicationDeadline: "",
          category: "",
          kpis: "",
          donor: "",
          selectedDistricts: [],
          amount: "",
          numberOfAwards: "",
          eligibilityDetails: "",
          reporting_time: "",
        });
      }
    } catch (error) {
      console.error("Error submitting grant data:", error);
      toast.error("Failed to submit grant data. Please try again.");
    }
  };

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
          <h5 className="mb-0">
            {grant
              ? "Edit Funding Opportunity"
              : "Add a New Funding Opportunity"}
          </h5>
        </div>
        <div className="card-body" style={cardBodyStyle}>
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
                    value={formData.name}
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
                    value={formData.category}
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
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  Description:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter grant description"
                  rows="4"
                />
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label" style={labelStyle}>
                    Start Date:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
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
                    value={formData.endDate}
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
                    value={formData.applicationDeadline}
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
                    value={formData.donor}
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
                  Amount:
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter grant amount"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  Number of Awards:
                </label>
                <input
                  type="number"
                  name="numberOfAwards"
                  value={formData.numberOfAwards}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter number of awards"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  Eligibility Details:
                </label>
                <textarea
                  name="eligibilityDetails"
                  value={formData.eligibilityDetails}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter eligibility details"
                  rows="4"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  KPIs:
                </label>
                <textarea
                  name="kpis"
                  value={formData.kpis}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter KPIs"
                  rows="4"
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={labelStyle}>
                  Reporting Time:
                </label>
                <select
                  name="reporting_time"
                  value={formData.reporting_time}
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
                  Districts:
                </label>
                <MultiSelect
                  options={districtOptions}
                  value={formData.selectedDistricts}
                  onChange={handleMultiSelectChange}
                  labelledBy="Select Districts"
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor =
                    buttonHoverStyle.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = buttonStyle.backgroundColor)
                }
              >
                {grant ? "Update Grant" : "Create Grant"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GrantsForm;
