
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import bookingImage from "../assets/booking.png";

const START_HOUR = 8;
const END_HOUR = 16;

const formatHour = (hour) => {
  return `${String(hour).padStart(2, "0")}:00`;
};

const timeSlots = [];

for (let hour = START_HOUR; hour < END_HOUR; hour++) {
  timeSlots.push({
    startTime: formatHour(hour),
    endTime: formatHour(hour + 1)
  });
}

function LabAvailability() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(
    searchParams.get("lab") || ""
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const [loadingLabs, setLoadingLabs] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const handleUnauthorized = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/labs",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load laboratories");
          return;
        }

        setLabs(data);

      } catch {
        setError("Cannot connect to server");

      } finally {
        setLoadingLabs(false);
      }
    };

    fetchLabs();
  }, [navigate]);

  const checkAvailability = async (event) => {
    event.preventDefault();

    setError("");
    setChecked(false);
    setBookedSlots([]);

    if (!selectedLab || !selectedDate) {
      setError("Please select a laboratory and date");
      return;
    }

    try {
      setChecking(true);

      const token = sessionStorage.getItem("token");

      const query = new URLSearchParams({
        lab: selectedLab,
        date: selectedDate
      });

      const response = await fetch(
        `http://localhost:5000/api/reservations/availability?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to check availability");
        return;
      }

      setBookedSlots(data.bookedSlots || []);
      setChecked(true);

    } catch {
      setError("Cannot connect to server");

    } finally {
      setChecking(false);
    }
  };

  const getSlotStatus = (slot) => {
    const overlappingBookings = bookedSlots.filter((booking) => {
      return (
        booking.startTime < slot.endTime &&
        booking.endTime > slot.startTime
      );
    });

    if (overlappingBookings.some(
      (booking) => booking.status === "approved"
    )) {
      return "approved";
    }

    if (overlappingBookings.some(
      (booking) => booking.status === "pending"
    )) {
      return "pending";
    }

    return "free";
  };

  const getBookingUrl = (slot) => {
    const query = new URLSearchParams({
      lab: selectedLab,
      date: selectedDate,
      startTime: slot.startTime,
      endTime: slot.endTime
    });

    return `/reservations/new?${query.toString()}`;
  };

  const selectedLabDetails = labs.find(
    (lab) => lab._id === selectedLab
  );

  const freeCount = checked
    ? timeSlots.filter((slot) => getSlotStatus(slot) === "free").length
    : 0;

  return (
    <main className="availability-page">

      <section className="availability-banner">
        <div>
          <span className="auth-label">LABORATORY BOOKING</span>

          <h1>Check Lab Availability</h1>

          <p>
            View laboratory booking times and select a free
            time slot before requesting a reservation.
          </p>
        </div>

        <img src={bookingImage} alt="Laboratory booking" />
      </section>

      <section className="availability-content">

        <div className="availability-card">
          <h2>Find Available Time</h2>

          <p>
            Select a laboratory and date to view its timetable.
          </p>

          <form onSubmit={checkAvailability}>
            <div className="availability-form-grid">

              <div className="availability-field">
                <label htmlFor="availability-lab">
                  Laboratory
                </label>

                <select
                  id="availability-lab"
                  value={selectedLab}
                  onChange={(event) => {
                    setSelectedLab(event.target.value);
                    setChecked(false);
                    setBookedSlots([]);
                  }}
                  disabled={loadingLabs}
                  required
                >
                  <option value="">Select Laboratory</option>

                  {labs.map((lab) => (
                    <option key={lab._id} value={lab._id}>
                      {lab.labName} - {lab.labVenue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="availability-field">
                <label htmlFor="availability-date">
                  Date
                </label>

                <input
                  id="availability-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    setSelectedDate(event.target.value);
                    setChecked(false);
                    setBookedSlots([]);
                  }}
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="availability-check-btn"
              disabled={checking || loadingLabs}
            >
              {checking ? "Checking..." : "Check Availability"}
            </button>
          </form>
        </div>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        {checked && (
          <div className="availability-results">

            <h2>{selectedLabDetails?.labName}</h2>
            <p>Date: {selectedDate}</p>

            <div className="availability-legend">
              <span>🟢 Free</span>
              <span>🟡 Pending</span>
              <span>🔴 Approved</span>
            </div>

            <div className="availability-timetable">
              {timeSlots.map((slot) => {
                const status = getSlotStatus(slot);

                return (
                  <div
                    key={slot.startTime}
                    className={`timetable-slot timetable-${status}`}
                  >
                    <strong>
                      {slot.startTime} - {slot.endTime}
                    </strong>

                    <span className="timetable-status">
                      {status === "free"
                        ? "Available"
                        : status === "pending"
                          ? "Pending"
                          : "Approved"}
                    </span>

                    {status === "free" ? (
                      <Link
                        className="timetable-book-btn"
                        to={getBookingUrl(slot)}
                      >
                        Select Slot
                      </Link>
                    ) : (
                      <span className="timetable-blocked">
                        Unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="availability-note">
              {freeCount} of {timeSlots.length} hourly slots
              are currently free. Slots shown as Pending or
              Approved cannot be selected. Availability is
              checked again when you submit your request.
            </p>

          </div>
        )}

      </section>
    </main>
  );
}

export default LabAvailability;
