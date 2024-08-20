import React, { Component } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { MultiSelect } from "react-multi-select-component";

export default class Subgrantees extends Component {
  state = {
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
    errorMessage: "",
    successMessage: "",
  };

  async componentDidMount() {
    try {
      const grantTypeResponse = await fetchWithAuth("/api/grants/grant-types/");
      const grantTypes = await grantTypeResponse.json();
      this.setState({ grantTypes });

      const donorResponse = await fetchWithAuth("/api/grants/donors/");
      const donors = await donorResponse.json();
      this.setState({ donors });

      const districtResponse = await fetchWithAuth(
        "/api/subgrantees/districts/"
      );
      const districtData = await districtResponse.json();

      if (
        Array.isArray(districtData) &&
        districtData.length > 0 &&
        Array.isArray(districtData[0].districts)
      ) {
        this.setState({ districts: districtData[0].districts });
      } else {
        console.error("Invalid districts data format:", districtData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ errorMessage: "Error fetching data. Please try again." });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleMultiSelectChange = (selectedOptions) => {
    this.setState({ selectedDistricts: selectedOptions });
  };

  handleSubmit = async (e) => {
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
      eligibilityDetails,
    } = this.state;

    const grantData = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      application_deadline: applicationDeadline,
      category,
      donor,
      district: selectedDistricts.map((option) => option.value),
      amount,
      number_of_awards: numberOfAwards,
      eligibility_details: eligibilityDetails,
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
      this.setState({
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
        successMessage: "Grant created successfully!",
      });
    } catch (error) {
      console.error("Error creating grant:", error);
      this.setState({
        errorMessage: "Error creating grant. Please try again.",
      });
    }
  };

  render() {
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
      districts,
      amount,
      numberOfAwards,
      eligibilityDetails,
      errorMessage,
      successMessage,
    } = this.state;

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

    return (
      <div
        className="container py-4"
        style={{ maxWidth: "1000px", margin: "auto" }}
      >
        <div
          className="card"
          style={{
            border: "1px solid #dee2e6",
            borderRadius: "0.25rem",
            boxShadow: "0 0 0.125rem rgba(0,0,0,0.075)",
          }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #dee2e6",
            }}
          >
            <h5 className="mb-0">Setup new subgrant</h5>
          </div>
          <div className="card-body" style={{ padding: "1.25rem" }}>
            You can setup new subgrant details below.
          </div>
          <div
            className="card-body border-top"
            style={{ borderTop: "1px solid #dee2e6" }}
          >
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            <form onSubmit={this.handleSubmit}>
              <fieldset
                style={{
                  border: "0",
                  padding: "0",
                  margin: "0",
                  boxShadow: "none",
                }}
              >
                <legend
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    borderBottom: "2px solid #007bff",
                    paddingBottom: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  Grant details
                </legend>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Name:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Description:
                  </label>
                  <div className="col-lg-9">
                    <textarea
                      name="description"
                      value={description}
                      onChange={this.handleChange}
                      className="form-control"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Start Date:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="date"
                      name="startDate"
                      value={startDate}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    End Date:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="date"
                      name="endDate"
                      value={endDate}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Application Deadline:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={applicationDeadline}
                      onChange={this.handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Grant Category:
                  </label>
                  <div className="col-lg-9">
                    <select
                      className="form-control"
                      name="category"
                      value={category}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                      }}
                    >
                      <option value="">Select Category</option>
                      {grantTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Donor:
                  </label>
                  <div className="col-lg-9">
                    <select
                      className="form-control"
                      name="donor"
                      value={donor}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                      }}
                    >
                      <option value="">Select Donor</option>
                      {donors.map((donor) => (
                        <option key={donor.id} value={donor.id}>
                          {donor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Districts:
                  </label>
                  <div className="col-lg-9">
                    <MultiSelect
                      options={districtOptions}
                      value={selectedDistricts}
                      onChange={this.handleMultiSelectChange}
                      labelledBy="Select Districts"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Amount:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="number"
                      name="amount"
                      value={amount}
                      onChange={this.handleChange}
                      className="form-control"
                      min="0"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Number of Awards:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="number"
                      name="numberOfAwards"
                      value={numberOfAwards}
                      onChange={this.handleChange}
                      className="form-control"
                      min="0"
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Eligibility Details:
                  </label>
                  <div className="col-lg-9">
                    <textarea
                      name="eligibilityDetails"
                      value={eligibilityDetails}
                      onChange={this.handleChange}
                      className="form-control"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12 text-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
