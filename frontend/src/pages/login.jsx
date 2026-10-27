
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import loginImage from "../assets/login.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "representative") {
        navigate("/labs", { replace: true });
      } else {
        navigate("/staff", { replace: true });
      }

    } catch (error) {
      setError("Cannot connect to server. Please try again");

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">

        <div className="auth-form-section">
          <div className="auth-form-content">

            <span className="auth-label">
              WELCOME BACK
            </span>

            <h1>Login to Your Account</h1>

            <p className="auth-description">
              Sign in to access laboratories,
              manage reservations, and track
              your booking requests.
            </p>

            {location.state?.message && (
              <p className="auth-success" role="status">
                {location.state.message}
              </p>
            )}

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="login-email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="login-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">
                  Password
                </label>

                <input
                  type="password"
                  id="login-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/register">
                Sign Up
              </Link>
            </p>

          </div>
        </div>

        <div className="auth-image-section">
          <img
            src={loginImage}
            alt="Student accessing the lab reservation system"
          />

          <h2>Smarter Lab Reservations</h2>

          <p>
            One platform to check availability
            and manage laboratory bookings.
          </p>
        </div>

      </div>
    </main>
  );
}

export default Login;
