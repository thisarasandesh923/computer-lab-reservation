
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-column">
                    <h2>Lab Reservation System</h2>

                    <p>
                        An easy and convenient platform for
                        checking laboratory availability and
                        managing lab reservations.
                    </p>
                </div>

                <div className="footer-column">
                    <h3>Contact & Support</h3>

                    <p>
                        For laboratory booking assistance,
                        please contact your authorized coordinator.
                    </p>

                    <p>Reservation Support</p>
                    <p>Academic Laboratory Management</p>
                </div>

                <div className="footer-column">
                    <h3>Quick Links</h3>

                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/labs">Available Labs</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Sign Up</a></li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 Lab Reservation System. All Rights Reserved.</p>

            </div>
        </footer>
    );
}

export default Footer;
