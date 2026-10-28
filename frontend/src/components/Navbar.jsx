


import { NavLink, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    const isLoggedIn = Boolean(token && user);

    const isStaff = isLoggedIn && [
        "module_coordinator",
        "lab_coordinator",
        "instructor"
    ].includes(user.role);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar">
            <h2 className="navbar-title">
                Lab Reservation System
            </h2>

            <div className="navbar-links">
                <NavLink to="/" end className="nav-link">
                    Home
                </NavLink>

                {!isLoggedIn && (
                    <>
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>

                        <NavLink to="/register" className="nav-link">
                            Sign Up
                        </NavLink>
                    </>
                )}


                        {isLoggedIn && !isStaff && (
                        <>
                            <NavLink to="/labs" className="nav-link">
                            Labs
                            </NavLink>

                            <NavLink to="/availability" className="nav-link">
                            Check Availability
                            </NavLink>

                            <NavLink to="/my-reservations" className="nav-link">
                            My Reservations
                            </NavLink>
                        </>
                        )}


                {isLoggedIn && isStaff && (
                    <NavLink to="/staff" className="nav-link">
                        Staff Dashboard
                    </NavLink>
                )}

                {isLoggedIn && (
                    <button
                        type="button"
                        className="nav-link nav-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
