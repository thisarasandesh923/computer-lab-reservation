function Navbar() {
    return (
        <nav className="navbar">
            <h2 className="navbar-title">Lab Reservation System</h2>

            <div className="navbar-links">
                <a href="/">Home</a>
                <a href="/labs">Labs</a>
                <a href="/login">Login</a>
                <a href="/register">Sign Up</a>
            </div>
        </nav>
    );
}

export default Navbar;