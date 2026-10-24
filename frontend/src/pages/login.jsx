
import { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from '../assets/login.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        console.log('Email:', email);
        console.log('Login form submitted');
    }

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

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                            >
                                Login
                            </button>
                        </form>

                        <p className="auth-switch">
                            Don't have an account?{' '}
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
