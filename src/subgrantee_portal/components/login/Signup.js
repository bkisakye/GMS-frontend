import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../utils/helpers";
import { toast } from "react-toastify";
import useLoadingHandler from "../../hooks/useLoadingHandler";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [organisation_name, setorganisationName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const url = "http://127.0.0.1:8000";
  const { loadingStates, handleLoading } = useLoadingHandler();
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !email ||
      !password ||
      !fname ||
      !lname ||
      !organisation_name ||
      !phone_number
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    await handleLoading("handleSubmit", async () => {
      const response = await fetch(`${url}/api/authentication/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fname,
          lname,
          organisation_name,
          phone_number,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Sign-up successful. Please wait for admin approval.");
      } else {
        toast.error(data.message || "Sign-up failed");
      }
    });
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: 'url("/logo/gms.jpeg")',
        backgroundColor: "rgb(244, 231, 214)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "980px",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card shadow"
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <div className="card-body">
          <div className="container">
            <h3 className="card-title text-center mb-4">
              <b> Sign Up for Grants System </b>
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="fname" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="lname" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="organisation_name" className="form-label">
                    Organisation Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="organisation_name"
                    value={organisation_name}
                    onChange={(e) => setorganisationName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="phone_number" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone_number"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loadingStates.handleSubmit}>
                {loadingStates.handleSubmit ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
              <div className="text-center mt-4">
                <p>
                  Already have an account?{" "}
                  <a href="/login" className="text-primary">
                    Sign in
                  </a>
                </p>
                <p>
                  <a href="/terms" className="text-secondary">
                    Terms and Conditions
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
