import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";
import { toast } from "react-toastify";
import useLoadingHandler from "../../hooks/useLoadingHandler";

const Partnership = () => {
  const { loadingStates, handleLoading } = useLoadingHandler();
  const [partnerships, setPartnerships] = useState([
    { name: "", description: "", period: "" },
  ]);
  const [subgrants, setSubgrants] = useState([
    { name: "", period: "", purpose: "", amount: "" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await handleLoading("fetchData", async () => {
        const response = await fetchWithAuth(`/api/subgrantees/profiles/me/`);
        if (response.ok) {
          const data = await response.json();
          if (data.partnerships && data.partnerships.length > 0) {
            setPartnerships(data.partnerships);
          }
          if (data.subgrants && data.subgrants.length > 0) {
            setSubgrants(data.subgrants);
          }
        } else {
          const errorData = await response.json();
          console.error("Error fetching data:", errorData);
          toast.error("Error fetching data: " + errorData.message);
        }
      });
    };

    fetchData();
  }, []);

  const handleAddRow = (type) => {
    if (type === "partnership") {
      const newRow = {
        name: "",
        description: "",
        period: "",
      };
      setPartnerships([...partnerships, newRow]);
    } else {
      const newRow = {
        name: "",
        period: "",
        purpose: "",
        amount: "",
      };
      setSubgrants([...subgrants, newRow]);
    }
  };

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === "partnership") {
      const updatedPartnerships = [...partnerships];
      updatedPartnerships[index][name] = value;
      setPartnerships(updatedPartnerships);
    } else {
      const updatedSubgrants = [...subgrants];
      updatedSubgrants[index][name] = value;
      setSubgrants(updatedSubgrants);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      partnerships: partnerships,
      subgrants: subgrants,
    };

    await handleLoading("SubmitData", async () => {
      const response = await fetchWithAuth(`/api/subgrantees/profiles/`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        toast.success("Data saved successfully");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Error saving data:", errorData);
        toast.error("Error saving data: " + errorData.message);
      }
    });
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">
            Please list any organization or entity (government, national or
            international) with which your organization has had (or currently
            has) a working relationship that does not involve a contract or
            funding.
          </label>
          <p>
            Organizations from which you have received funding are included
            above and those you have funded are listed below [please add lines
            if needed]
          </p>
        </div>

        <table className="table table-striped mb-4">
          <thead>
            <tr>
              <th>Name of the Organisation/entity</th>
              <th>Briefly describe the relationship/engagement</th>
              <th>When [period]</th>
            </tr>
          </thead>
          <tbody>
            {partnerships.map((partnership, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={partnership.name}
                    onChange={(e) => handleInputChange(e, index, "partnership")}
                    required
                  />
                </td>
                <td>
                  <textarea
                    name="description"
                    className="form-control"
                    value={partnership.description}
                    onChange={(e) => handleInputChange(e, index, "partnership")}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="period"
                    className="form-control"
                    value={partnership.period}
                    onChange={(e) => handleInputChange(e, index, "partnership")}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-primary mb-4"
          onClick={() => handleAddRow("partnership")}
        >
          Add Partnership Row
        </button>

        <div className="mb-4">
          <label className="form-label">
            Have you ever sub-granted or sub-contracted to another organization
            in the past 3 years? Please list details
          </label>
          <p>[please add lines if needed]</p>
        </div>

        <table className="table table-striped mb-4">
          <thead>
            <tr>
              <th>Name of the Organisation</th>
              <th>Period</th>
              <th>Purpose</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {subgrants.map((subgrant, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={subgrant.name}
                    onChange={(e) => handleInputChange(e, index, "subgrant")}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="period"
                    className="form-control"
                    value={subgrant.period}
                    onChange={(e) => handleInputChange(e, index, "subgrant")}
                    required
                  />
                </td>
                <td>
                  <textarea
                    name="purpose"
                    className="form-control"
                    value={subgrant.purpose}
                    onChange={(e) => handleInputChange(e, index, "subgrant")}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    value={subgrant.amount}
                    onChange={(e) => handleInputChange(e, index, "subgrant")}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-primary mb-4"
          onClick={() => handleAddRow("subgrant")}
        >
          Add Subgrant Row
        </button>
<br />
        <button type="submit" className="btn btn-success" disabled={loadingStates.SubmitData}>
          {loadingStates.SubmitData ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default Partnership;
