import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../auth/auth";
import { loginService } from "../api/commonService";
import logo from "../assets/logo-trade-dashboard.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await loginService(username, password);

    if (result.success && result.token) {
      saveToken(result.token);
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card fade-in">
        <div className="login-logo">
          <img src={logo} alt="TradeFlow Logo" className="logo-img" /> Trading
          dashboard
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8a16.9 16.9 0 0 1 5.17-7.62" />
                  <path d="M1 1l22 22" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a16.9 16.9 0 0 1-1.67 2.9" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
