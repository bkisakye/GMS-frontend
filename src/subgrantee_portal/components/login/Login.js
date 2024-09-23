import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext.js";
import { fetchWithAuth, removeTrailingSlash } from "../../../utils/helpers.js";
import { toast } from "react-toastify";
import useLoadingHandler from "../../hooks/useLoadingHandler.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loadingSates, handleLoading } = useLoadingHandler();
  const setUser = useUser();
  const baseUrl = removeTrailingSlash(process.env.REACT_APP_API_BASE_URL);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    await handleLoading("Submit", async () => {
      const response = await fetch(`${baseUrl}/api/authentication/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "User",
            email: email,
            user_id: data.user_id,
            organisation_name: data.organisation_name,
          })
        );

        if (setUser) {
          setUser({ email });
        }

        navigate("/");
      } else {
        toast.error(data.error || "Invalid credentials");
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
                <b>Grants System Login</b>
              </h3>
            </div>
            <div className="row">
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
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-2"
                  disabled={loadingSates.Submit}
                >
                  {loadingSates.Submit ? "Loading..." : "Login"}
                </button>
                {/* Sign-Up and Terms Links */}
                <div className="text-center mt-4">
                  <p>
                    Don't have an account?{" "}
                    <a href="/register" className="text-primary">
                      Sign up
                    </a>
                  </p>
                  <p>
                    <a href="#" className="text-secondary">
                      Terms and Conditions
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
