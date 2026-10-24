

import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <h2 className="navbar-title">
                Lab Reservation System
            </h2>

            <div className="navbar-links">
                <NavLink to="/" end className="nav-link">
                    Home
                </NavLink>

                <NavLink to="/labs" className="nav-link">
                    Labs
                </NavLink>

                <NavLink to="/login" className="nav-link">
                    Login
                </NavLink>

                <NavLink to="/register" className="nav-link">
                    Sign Up
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
