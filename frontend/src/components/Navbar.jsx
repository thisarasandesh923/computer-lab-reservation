
function Navbar() {
    return (
        <nav className="navbar">
            <h2 className="navbar-title">Lab Reservation System</h2>

            <div className="navbar-links">
                <a href="/" className="nav-link">Home</a>
                <a href="/labs" className="nav-link">Labs</a>
                <a href="/login" className="nav-link">Login</a>
                <a href="/register" className="nav-link">Sign Up</a>
            </div>
        </nav>
    );
}

export default Navbar;
