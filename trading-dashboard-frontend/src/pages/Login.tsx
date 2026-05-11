import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../auth/auth";
import { loginService } from "../api/commonService";

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
          <img src="/logo.png" alt="Logo" />
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Secure access to trading dashboard</p>

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
              {showPassword ? "🙈" : "👁️"}
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
