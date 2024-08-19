import React, { Component } from "react";
import { AiFillEdit } from "react-icons/ai";
import { fetchWithAuth } from "../../../../utils/helpers";

export default class Subgrantees extends Component {
  state = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    category: "",
    donor: "",
    amount: "",
    numberOfAwards: "",
    eligibilityDetails: "",
    grantTypes: [],
    donors: [],
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
    } catch (error) {
      console.error("Error fetching data:", error);
      this.setState({ errorMessage: "Error fetching data. Please try again." });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
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
      amount,
      number_of_awards: numberOfAwards,
      eligibility_details: eligibilityDetails,
    };

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
      amount,
      numberOfAwards,
      eligibilityDetails,
      grantTypes,
      donors,
      errorMessage,
      successMessage,
    } = this.state;

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
                    Name/Title:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Grant Name/Title"
                      name="name"
                      value={name}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Grant description:
                  </label>
                  <div className="col-lg-9">
                    <textarea
                      rows="7"
                      cols="9"
                      className="form-control"
                      placeholder="Notes all about the subgrant"
                      name="description"
                      value={description}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>

                <div className="row mb-3" style={{ marginBottom: "1rem" }}>
                  <label
                    className="col-lg-3 col-form-label"
                    style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                  >
                    Grant Period:
                  </label>
                  <div className="col-lg-9">
                    <div className="row">
                      <div className="col-md-6">
                        <label style={{ fontWeight: "bold" }}>Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="startDate"
                          value={startDate}
                          onChange={this.handleChange}
                          style={{
                            borderRadius: "0.25rem",
                            border: "1px solid #ced4da",
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontWeight: "bold" }}>End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="endDate"
                          value={endDate}
                          onChange={this.handleChange}
                          style={{
                            borderRadius: "0.25rem",
                            border: "1px solid #ced4da",
                          }}
                        />
                      </div>
                    </div>
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
                      className="form-control"
                      name="applicationDeadline"
                      value={applicationDeadline}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                      }}
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
                    Amount:
                  </label>
                  <div className="col-lg-9">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Amount"
                      name="amount"
                      value={amount}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                      }}
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
                      className="form-control"
                      placeholder="Number of awards"
                      name="numberOfAwards"
                      value={numberOfAwards}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                      }}
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
                      rows="4"
                      cols="9"
                      className="form-control"
                      placeholder="Eligibility details"
                      name="eligibilityDetails"
                      value={eligibilityDetails}
                      onChange={this.handleChange}
                      style={{
                        borderRadius: "0.25rem",
                        border: "1px solid #ced4da",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>

                <div className="form-group text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ borderRadius: "0.25rem" }}
                  >
                    Submit Grant
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
