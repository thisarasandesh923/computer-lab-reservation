
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import bookingImage from "../assets/booking.png";

function CreateReservation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [labs, setLabs] = useState([]);
  const [lab, setLab] = useState(searchParams.get("lab") || "");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [numOfSeats, setNumOfSeats] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

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
          sessionStorage.clear();
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
        setError("Cannot load laboratories. Check your backend server");

      } finally {
        setLoadingLabs(false);
      }
    };

    fetchLabs();
  }, [navigate]);

  const selectedLab = labs.find((item) => item._id === lab);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!lab || !date || !startTime || !endTime ||
        !reason.trim() || !numOfSeats) {
      setError("Please fill all required fields");
      return;
    }

    if (startTime >= endTime) {
      setError("Start time must be earlier than end time");
      return;
    }

    if (!Number.isInteger(Number(numOfSeats)) ||
        Number(numOfSeats) <= 0) {
      setError("Number of seats must be a positive integer");
      return;
    }

    if (selectedLab && Number(numOfSeats) > selectedLab.seatCount) {
      setError("Requested seats exceed laboratory capacity");
      return;
    }

    try {
      setLoading(true);

      const token = sessionStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            lab,
            date,
            startTime,
            endTime,
            reason: reason.trim(),
            numOfSeats: Number(numOfSeats)
          })
        }
      );

      if (response.status === 401) {
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create reservation");
        return;
      }

      navigate("/my-reservations", {
        replace: true,
        state: { message: "Reservation request submitted successfully!" }
      });

    } catch {
      setError("Cannot connect to server. Please try again");

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <section className="booking-header">
        <div>
          <span className="auth-label">NEW RESERVATION</span>
          <h1>Reserve a Laboratory</h1>
          <p>
            Select a laboratory, choose your preferred
            time slot and submit a reservation request.
          </p>
        </div>

        <img
          src={bookingImage}
          alt="Laboratory booking illustration"
        />
      </section>

      <section className="booking-content">
        <div className="booking-form-card">
          <h2>Reservation Details</h2>
          <p className="booking-intro">
            Your request will remain pending until an
            authorized staff member reviews it.
          </p>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="booking-form-grid">
              <div className="form-group">
                <label htmlFor="booking-lab">Laboratory</label>

                <select
                  id="booking-lab"
                  value={lab}
                  onChange={(event) => setLab(event.target.value)}
                  required
                  disabled={loadingLabs}
                >
                  <option value="">Select Laboratory</option>

                  {labs.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.labName} ({item.seatCount} seats)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="booking-date">Reservation Date</label>

                <input
                  id="booking-date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-start">Start Time</label>

                <input
                  id="booking-start"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-end">End Time</label>

                <input
                  id="booking-end"
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-seats">Number of Seats</label>

                <input
                  id="booking-seats"
                  type="number"
                  min="1"
                  max={selectedLab?.seatCount}
                  value={numOfSeats}
                  onChange={(event) => setNumOfSeats(event.target.value)}
                  placeholder="Enter required seats"
                  required
                />
              </div>

              <div className="form-group booking-reason">
                <label htmlFor="booking-reason">Reason for Booking</label>

                <textarea
                  id="booking-reason"
                  rows="4"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Example: Programming practical session"
                  required
                />
              </div>
            </div>

            {selectedLab && (
              <p className="booking-capacity">
                Selected lab capacity: {selectedLab.seatCount} seats
              </p>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || loadingLabs}
            >
              {loading ? "Submitting..." : "Submit Reservation Request"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default CreateReservation;
