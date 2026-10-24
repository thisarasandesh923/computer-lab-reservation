
import { Link } from 'react-router-dom';

function Home() {
    return (
        <main>
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Lab. Book Your Time.</h1>

                    <p>
                        Check laboratory availability,
                        choose a suitable time slot,
                        and make your reservation easily.
                    </p>

                    <Link to="/labs" className="explore-btn">
                        Explore Labs
                    </Link>
                </div>
            </section>

            <section className="features-section">
                <h2>Easy Lab Reservations</h2>

                <p className="features-intro">
                    Everything you need to plan and manage
                    your laboratory reservations.
                </p>

                <div className="features-container">
                    <div className="feature-card">
                        <div className="feature-icon">💻</div>
                        <h3>Explore Labs</h3>
                        <p>
                            Browse computer laboratories
                            and view their facilities.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📅</div>
                        <h3>Check Availability</h3>
                        <p>
                            View available time slots
                            before making a reservation.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">✅</div>
                        <h3>Manage Reservations</h3>
                        <p>
                            Submit booking requests
                            and track reservation status.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;
