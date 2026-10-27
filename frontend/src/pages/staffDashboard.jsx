
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import resdashImage from "../assets/resdash.png";

function StaffDashboard() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState("");
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/reservations",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load reservations");
        return;
      }

      setReservations(data);

    } catch {
      setError("Cannot connect to server. Please try again");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleReview = async (reservation, status) => {
    const action = status === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this reservation?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setReviewingId(reservation._id);
      setError("");
      setSuccess("");

      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservation._id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to review reservation");
        await fetchReservations();
        return;
      }

      await fetchReservations();
      setSuccess(`Reservation ${status} successfully!`);

    } catch {
      setError("Cannot connect to server. Please try again");

    } finally {
      setReviewingId("");
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    return filter === "all" || reservation.status === filter;
  });

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "pending"
  ).length;

  const approvedCount = reservations.filter(
    (reservation) => reservation.status === "approved"
  ).length;

  const rejectedCount = reservations.filter(
    (reservation) => reservation.status === "rejected"
  ).length;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
  };

  return (
    <main className="staff-page">

      <section className="staff-banner">
        <div>
          <span className="auth-label">STAFF PORTAL</span>

          <h1>Reservation Management</h1>

          <p>
            Review laboratory booking requests,
            approve or reject pending reservations,
            and monitor booking activity.
          </p>
        </div>

        <img
          src={resdashImage}
          alt="Laboratory reservation management dashboard"
        />
      </section>

      <section className="staff-content">

        <div className="staff-summary-grid">
          <div className="staff-summary-card">
            <span>Pending Requests</span>
            <h2>{pendingCount}</h2>
          </div>

          <div className="staff-summary-card">
            <span>Approved Reservations</span>
            <h2>{approvedCount}</h2>
          </div>

          <div className="staff-summary-card">
            <span>Rejected Reservations</span>
            <h2>{rejectedCount}</h2>
          </div>
        </div>

        <div className="reservations-toolbar">
          <div>
            <h2>Booking Requests</h2>
            <p>Manage laboratory reservation approvals.</p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter staff reservations"
          >
            <option value="pending">Pending Requests</option>
            <option value="all">All Reservations</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {success && (
          <p className="auth-success" role="status">
            {success}
          </p>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        {loading && <p>Loading booking requests...</p>}

        {!loading && !error && filteredReservations.length === 0 && (
          <div className="reservations-empty">
            <h3>No booking requests found</h3>
            <p>New requests will appear here.</p>
          </div>
        )}

        {!loading && filteredReservations.length > 0 && (
          <div className="reservations-table-wrapper">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Laboratory</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      {reservation.lab?.labName || "Unknown Laboratory"}
                    </td>

                    <td>{formatDate(reservation.date)}</td>

                    <td>
                      {reservation.startTime} - {reservation.endTime}
                    </td>

                    <td>{reservation.numOfSeats}</td>

                    <td>{reservation.reason}</td>

                    <td>
                      <span
                        className={`reservation-status status-${reservation.status}`}
                      >
                        {reservation.status}
                      </span>
                    </td>

                    <td>
                      {reservation.status === "pending" ? (
                        <div className="reservation-actions">
                          <button
                            type="button"
                            className="staff-approve-btn"
                            disabled={Boolean(reviewingId)}
                            onClick={() => handleReview(reservation, "approved")}
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            className="staff-reject-btn"
                            disabled={Boolean(reviewingId)}
                            onClick={() => handleReview(reservation, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="reservation-locked">
                          Reviewed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>
    </main>
  );
}

export default StaffDashboard;
