
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import comlabImage from "../assets/comlab.png";

function Home() {
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

  const availabilityLink = !isLoggedIn
    ? "/login"
    : isStaff
      ? "/staff"
      : "/availability";

  const labsLink = !isLoggedIn
    ? "/login"
    : isStaff
      ? "/staff"
      : "/labs";

  return (
    <main className="home-page">

      <section className="home-hero">
        <div className="home-hero-container">

          <div className="home-hero-content">
            <span className="home-eyebrow">
              LAB RESERVATION SYSTEM
            </span>

            <h1>
              Your Lab.
              <span> Your Time.</span>
            </h1>

            <p>
              Find a computer laboratory, check available
              time slots and request a reservation in a
              few simple steps.
            </p>

            <div className="home-hero-actions">
              <Link
                to={availabilityLink}
                className="home-primary-btn"
              >
                {isStaff ? "Staff Dashboard" : "Check Availability"}
              </Link>

              {!isStaff && (
                <Link
                  to={labsLink}
                  className="home-secondary-btn"
                >
                  Explore Labs
                </Link>
              )}
            </div>

            <div className="home-hero-footnote">
              <span className="home-footnote-line"></span>
              Simple booking. Clear availability. Easy tracking.
            </div>
          </div>

          <div className="home-hero-image">
            <img
              src={heroImage}
              alt="Students using computers in a laboratory"
            />
          </div>

        </div>
      </section>

      <section className="home-steps">
        <div className="home-section-heading">
          <span className="home-section-label">
            HOW IT WORKS
          </span>

          <h2>Book your laboratory in three steps.</h2>

          <p>
            Everything you need to organize a laboratory
            session, all in one place.
          </p>
        </div>

        <div className="home-steps-grid">

          <div className="home-step-card">
            <span className="home-step-number">01</span>

            <h3>Find a Laboratory</h3>

            <p>
              Browse registered computer laboratories,
              view their locations and seating capacity.
            </p>
          </div>

          <div className="home-step-card">
            <span className="home-step-number">02</span>

            <h3>Check Available Times</h3>

            <p>
              See free, pending and approved booking slots
              before choosing a suitable time.
            </p>
          </div>

          <div className="home-step-card">
            <span className="home-step-number">03</span>

            <h3>Request & Track</h3>

            <p>
              Submit your booking request and check
              its approval status from your dashboard.
            </p>
          </div>

        </div>
      </section>

      <section className="home-feature">
        <div className="home-feature-container">

          <div className="home-feature-image">
            <img
              src={comlabImage}
              alt="Computer laboratory with desktop workstations"
            />
          </div>

          <div className="home-feature-content">
            <span className="home-section-label">
              PLAN BEFORE YOU BOOK
            </span>

            <h2>
              Know when a lab is free.
            </h2>

            <p>
              Check the laboratory timetable before
              making your reservation. Available slots
              are clearly shown alongside pending and
              approved bookings.
            </p>

            <div className="home-status-guide">
              <div>
                <span className="home-status-dot home-dot-free"></span>
                Free to request
              </div>

              <div>
                <span className="home-status-dot home-dot-pending"></span>
                Pending request
              </div>

              <div>
                <span className="home-status-dot home-dot-approved"></span>
                Approved booking
              </div>
            </div>

            <Link
              to={availabilityLink}
              className="home-feature-btn"
            >
              {isStaff ? "View Staff Dashboard" : "View Lab Availability"}
            </Link>
          </div>

        </div>
      </section>

      <section className="home-bottom-section">
        <div>
          <span className="home-section-label">
            GET STARTED
          </span>

          <h2>Ready to plan your next lab session?</h2>

          <p>
            Explore laboratories and choose a time
            that works for your session.
          </p>
        </div>

        <Link
          to={labsLink}
          className="home-primary-btn"
        >
          {isStaff ? "Go to Dashboard" : "Get Started"}
        </Link>
      </section>

    </main>
  );
}

export default Home;
