
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import resdashImage from "../assets/resdash.png";

function MyReservations() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.message || "");
  const [filter, setFilter] = useState("all");

  const [editingReservation, setEditingReservation] = useState(null);

  const [editForm, setEditForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
    numOfSeats: ""
  });

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  const handleUnauthorized = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/reservations",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
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

  const filteredReservations = reservations.filter((reservation) => {
    return filter === "all" || reservation.status === filter;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
  };

  const getDateInputValue = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const handleEdit = (reservation) => {
    setError("");
    setSuccess("");

    setEditingReservation(reservation);

    setEditForm({
      date: getDateInputValue(reservation.date),
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      reason: reservation.reason,
      numOfSeats: String(reservation.numOfSeats)
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!editingReservation) {
      return;
    }

    if (!editForm.date ||
        !editForm.startTime ||
        !editForm.endTime ||
        !editForm.reason.trim() ||
        !editForm.numOfSeats) {
      setError("Please fill all required fields");
      return;
    }

    if (editForm.startTime >= editForm.endTime) {
      setError("Start time must be earlier than end time");
      return;
    }

    const seats = Number(editForm.numOfSeats);

    if (!Number.isInteger(seats) || seats <= 0) {
      setError("Number of seats must be a positive integer");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/reservations/${editingReservation._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({
            date: editForm.date,
            startTime: editForm.startTime,
            endTime: editForm.endTime,
            reason: editForm.reason.trim(),
            numOfSeats: seats
          })
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update reservation");
        return;
      }

      setEditingReservation(null);
      setSuccess("Reservation updated successfully!");

      await fetchReservations();

    } catch {
      setError("Cannot connect to server. Please try again");

    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reservation) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reservation? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reservation._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservation._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete reservation");
        return;
      }

      setSuccess("Reservation deleted successfully!");

      await fetchReservations();

    } catch {
      setError("Cannot connect to server. Please try again");

    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="reservations-page">

      <section className="reservations-banner">
        <div className="reservations-banner-text">
          <span className="auth-label">MY BOOKINGS</span>

          <h1>My Reservations</h1>

          <p>
            View, edit and manage your laboratory
            reservation requests.
          </p>

          <Link to="/labs" className="explore-btn">
            Explore Laboratories
          </Link>
        </div>

        <img
          src={resdashImage}
          alt="Laboratory reservation management"
        />
      </section>

      <section className="reservations-content">

        <div className="reservations-toolbar">
          <div>
            <h2>Reservation History</h2>
            <p>All your laboratory booking requests.</p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter reservations by status"
          >
            <option value="all">All Reservations</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
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

        {loading && <p>Loading reservations...</p>}

        {!loading && filteredReservations.length === 0 && !error && (
          <div className="reservations-empty">
            <h3>No reservations found</h3>

            <p>Your booking requests will appear here.</p>

            <Link to="/labs" className="explore-btn">
              Explore Labs
            </Link>
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
                      <div className="reservation-actions">

                        {reservation.status === "pending" && (
                          <>
                            <button
                              type="button"
                              className="reservation-edit-btn"
                              onClick={() => handleEdit(reservation)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="reservation-delete-btn"
                              disabled={deletingId === reservation._id}
                              onClick={() => handleDelete(reservation)}
                            >
                              {deletingId === reservation._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        )}

                        {reservation.status === "approved" && (
                          <span className="reservation-locked">
                            Locked
                          </span>
                        )}

                        {["rejected", "cancelled"].includes(
                          reservation.status
                        ) && (
                          <button
                            type="button"
                            className="reservation-delete-btn"
                            disabled={deletingId === reservation._id}
                            onClick={() => handleDelete(reservation)}
                          >
                            {deletingId === reservation._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingReservation && (
          <div className="reservation-edit-section">
            <div className="reservation-edit-header">
              <div>
                <h2>Edit Reservation</h2>
                <p>
                  Update your pending laboratory booking.
                </p>
              </div>

              <button
                type="button"
                className="reservation-cancel-btn"
                onClick={() => setEditingReservation(null)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="booking-form-grid">

                <div className="form-group">
                  <label htmlFor="edit-date">
                    Reservation Date
                  </label>

                  <input
                    id="edit-date"
                    name="date"
                    type="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-start">
                    Start Time
                  </label>

                  <input
                    id="edit-start"
                    name="startTime"
                    type="time"
                    value={editForm.startTime}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-end">
                    End Time
                  </label>

                  <input
                    id="edit-end"
                    name="endTime"
                    type="time"
                    value={editForm.endTime}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-seats">
                    Number of Seats
                  </label>

                  <input
                    id="edit-seats"
                    name="numOfSeats"
                    type="number"
                    min="1"
                    value={editForm.numOfSeats}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group booking-reason">
                  <label htmlFor="edit-reason">
                    Reason for Booking
                  </label>

                  <textarea
                    id="edit-reason"
                    name="reason"
                    rows="4"
                    value={editForm.reason}
                    onChange={handleEditChange}
                    required
                  />
                </div>

              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

      </section>
    </main>
  );
}

export default MyReservations;
