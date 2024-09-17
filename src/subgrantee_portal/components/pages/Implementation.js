import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Implementation = () => {
  const [pastProjects, setPastProjects] = useState([
    { name: "", time_frame: "", budget: "", outcomes: "", contact: "" },
  ]);
  const [currentProjects, setCurrentProjects] = useState([
    { donor: "", time_frame: "", budget: "", description: "", contact: "" },
  ]);
  const [currentWorkEmphasizes, setCurrentWorkEmphasizes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`/api/subgrantees/profiles/me/`);
        if (response.ok) {
          const data = await response.json();
          if (data.past_projects && data.past_projects.length > 0) {
            setPastProjects(data.past_projects);
          }
          if (data.current_projects && data.current_projects.length > 0) {
            setCurrentProjects(data.current_projects);
          }
          if (data.current_work_emphasizes) {
            setCurrentWorkEmphasizes(data.current_work_emphasizes);
          }
        } else {
          const errorData = await response.json();
          console.error("Error fetching data:", errorData);
          toast.error(errorData.message || "Error fetching project data");
        }
      } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Error fetching project data");
      }
    };
    fetchData();
  }, []);

  const handleAddRow = (type) => {
    if (type === "past") {
      const newRow = {
        name: "",
        time_frame: "",
        budget: "",
        outcomes: "",
        contact: "",
      };
      setPastProjects([...pastProjects, newRow]);
    } else {
      const newRow = {
        donor: "",
        time_frame: "",
        budget: "",
        description: "",
        contact: "",
      };
      setCurrentProjects([...currentProjects, newRow]);
    }
  };

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === "past") {
      const updatedProjects = [...pastProjects];
      updatedProjects[index][name] = value;
      setPastProjects(updatedProjects);
    } else {
      const updatedProjects = [...currentProjects];
      updatedProjects[index][name] = value;
      setCurrentProjects(updatedProjects);
    }
  };

  const handleCurrentWorkChange = (e) => {
    setCurrentWorkEmphasizes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      past_projects: pastProjects,
      current_projects: currentProjects,
      current_work_emphasizes: currentWorkEmphasizes,
    };

    console.log("Submitting form data:", formData);

    try {
      const response = await fetchWithAuth(`/api/subgrantees/profiles/`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        toast.success("Projects updated successfully");
        navigate("/profile/partnership");
      } else {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        toast.error(errorData.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          List of past (completed) projects and contact information [most recent
          5]
        </label>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Timeframe</th>
              <th>Budget</th>
              <th>Outcomes</th>
              <th>Contact Info</th>
            </tr>
          </thead>
          <tbody>
            {pastProjects.map((project, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={project.name}
                    onChange={(e) => handleInputChange(e, index, "past")}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="time_frame"
                    value={project.time_frame}
                    onChange={(e) => handleInputChange(e, index, "past")}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="budget"
                    value={project.budget}
                    onChange={(e) => handleInputChange(e, index, "past")}
                    className="form-control"
                  />
                </td>
                <td>
                  <textarea
                    name="outcomes"
                    value={project.outcomes}
                    onChange={(e) => handleInputChange(e, index, "past")}
                    className="form-control"
                    rows="2"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="contact"
                    value={project.contact}
                    onChange={(e) => handleInputChange(e, index, "past")}
                    className="form-control"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => handleAddRow("past")}
        >
          Add Past Project
        </button>

        <br />
        <label className="form-label">
          List of current projects and contact information [all current]
        </label>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Timeframe</th>
              <th>Budget</th>
              <th>Description</th>
              <th>Contact Info</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="donor"
                    value={project.donor}
                    onChange={(e) => handleInputChange(e, index, "current")}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="time_frame"
                    value={project.time_frame}
                    onChange={(e) => handleInputChange(e, index, "current")}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="budget"
                    value={project.budget}
                    onChange={(e) => handleInputChange(e, index, "current")}
                    className="form-control"
                  />
                </td>
                <td>
                  <textarea
                    name="description"
                    value={project.description}
                    onChange={(e) => handleInputChange(e, index, "current")}
                    className="form-control"
                    rows="2"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="contact"
                    value={project.contact}
                    onChange={(e) => handleInputChange(e, index, "current")}
                    className="form-control"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => handleAddRow("current")}
        >
          Add Current Project
        </button>

        <div className="mb-3">
          <label className="form-label">
            Please describe how your current work includes or emphasizes gender,
            women, or youth
          </label>
          <textarea
            name="current_work_emphasizes"
            value={currentWorkEmphasizes}
            onChange={handleCurrentWorkChange}
            className="form-control"
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn-success">
          Save Projects
        </button>
      </form>
    </div>
  );
};

export default Implementation;
