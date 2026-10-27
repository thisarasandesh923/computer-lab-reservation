
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill all required fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      navigate("/login", {
        state: {
          message: "Registration successful! Please login."
        }
      });

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
              GET STARTED
            </span>

            <h1>Create Your Account</h1>

            <p className="auth-description">
              Register as a batch representative to access
              laboratories and manage reservation requests.
            </p>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="register-name">
                  Full Name
                </label>

                <input
                  type="text"
                  id="register-name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="register-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">
                  Password
                </label>

                <input
                  type="password"
                  id="register-password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>

          </div>
        </div>

        <div className="auth-image-section">
          <img
            src={loginImage}
            alt="Student using the lab reservation system"
          />

          <h2>Plan. Reserve. Learn.</h2>

          <p>
            A simple platform for managing laboratory
            access and reservation requests.
          </p>
        </div>

      </div>
    </main>
  );
}

export default Register;
