import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext.js";
import {
  fetchWithAuth,
  removeTrailingSlash,
  setTokens,
} from "../../../utils/helpers.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const setUser = useUser(); // Uncomment if using UserContext
  const baseUrl = removeTrailingSlash(process.env.REACT_APP_API_BASE_URL);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    console.log(email, password);

    try {
      const response = await fetch(`${baseUrl}/api/authentication/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        // Ensure you're checking for access token or appropriate response
        localStorage.setItem("isAuthenticated", "true");
        setTokens(data.access, data.refresh);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "Admin User",
            email: email,
            user_id: data.user_id,
          })
        );

        if (setUser) {
          // Uncomment if using UserContext
          setUser({ email });
        }

        navigate("/admin/");
      } else {
        setErrorMessage(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: 'url("/logo/gms.jpeg")',
        backgroundColor: "rgb(244, 231, 214)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "900px",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <div className="card-body">
          <div className="container">
            <div className="row">
              <h3 className="card-title text-center mb-4">
                <b> Sign in to Start Your Session </b>
              </h3>
            </div>
            <div className="row">
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
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
                <div className="mb-3">
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
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
