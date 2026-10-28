
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import comlabImage from "../assets/comlab.png";

function Labs() {
  const navigate = useNavigate();

  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/labs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load laboratories");
          return;
        }

        setLabs(data);

      } catch {
        setError("Cannot connect to server. Please try again");

      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, [navigate]);

  const filteredLabs = labs.filter((lab) => {
    const keyword = search.toLowerCase();

    return (
      lab.labName.toLowerCase().includes(keyword) ||
      lab.labVenue.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="labs-page">

      <section className="labs-header">
        <div>
          <span className="auth-label">
            LABORATORY DIRECTORY
          </span>

          <h1>Explore Laboratories</h1>

          <p>
            Find the right laboratory for your practical
            session and check its details.
          </p>
        </div>
      </section>

      <section className="labs-content">

        <div className="labs-toolbar">
          <div>
            <h2>Available Laboratories</h2>

            <p>
              Browse laboratories registered in the system.
            </p>
          </div>

          <input
            type="search"
            placeholder="Search laboratories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search laboratories"
          />
        </div>

        {loading && (
          <p>Loading laboratories...</p>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && filteredLabs.length === 0 && (
          <p>No laboratories found.</p>
        )}

        {!loading && !error && filteredLabs.length > 0 && (
          <div className="lab-grid">

            {filteredLabs.map((lab) => (
              <article className="lab-card" key={lab._id}>

                <img
                  src={comlabImage}
                  alt="Computer laboratory"
                  className="lab-card-image"
                />

                <div className="lab-card-content">

                  <span className="lab-status">
                    {lab.status}
                  </span>

                  <h3>{lab.labName}</h3>

                  <p>📍 {lab.labVenue}</p>

                  <p>
                    💺 Capacity: {lab.seatCount} seats
                  </p>


                  <div className="lab-card-actions">

                    <Link
                      to={`/availability?lab=${lab._id}`}
                      className="lab-availability-btn"
                    >
                      Check Availability
                    </Link>

                    <Link
                      to={`/reservations/new?lab=${lab._id}`}
                      className="lab-action-btn"
                    >
                      Request Reservation
                    </Link>

                  </div>


                </div>
              </article>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}

export default Labs;
