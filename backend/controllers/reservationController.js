
import Reservation from "../models/Reservation.js";
import Lab from "../models/laboratory.js";
import mongoose from "mongoose";

const staffRoles = [
  "module_coordinator",
  "lab_coordinator",
  "instructor"
];

const isStaff = (user) => {
  return staffRoles.includes(user.role);
};

const isOwner = (reservation, user) => {
  return reservation.user.toString() === user._id.toString();
};

const isValidTime = (time) => {
  if (typeof time !== "string") {
    return false;
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return false;
  }

  return true;
};

const parseBookingDate = (date) => {
  if (typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const bookingDate = new Date(date);

  if (isNaN(bookingDate.getTime())) {
    return null;
  }

  if (bookingDate.toISOString().slice(0, 10) !== date) {
    return null;
  }

  return bookingDate;
};

const createReservation = async (req, res) => {
  try {
    if (req.user.role !== "representative") {
      return res.status(403).json({
        message: "Only representatives can create reservations"
      });
    }

    const { lab, date, startTime, endTime, reason, numOfSeats } = req.body;

    if (!lab || !date || !startTime || !endTime ||
        !reason || numOfSeats == null) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    if (!mongoose.isValidObjectId(lab)) {
      return res.status(400).json({
        message: "Invalid Lab ID"
      });
    }

    const bookingDate = parseBookingDate(date);

    if (!bookingDate) {
      return res.status(400).json({
        message: "Invalid date. Use YYYY-MM-DD"
      });
    }

    if (!isValidTime(startTime) || !isValidTime(endTime) ||
        startTime >= endTime) {
      return res.status(400).json({
        message: "Please enter a valid time range"
      });
    }

    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        message: "Please enter a valid reservation reason"
      });
    }

    if (!Number.isInteger(numOfSeats) || numOfSeats <= 0) {
      return res.status(400).json({
        message: "Number of seats must be a positive integer"
      });
    }

    const selectedLab = await Lab.findById(lab);

    if (!selectedLab) {
      return res.status(404).json({
        message: "Lab not found"
      });
    }

    if (numOfSeats > selectedLab.seatCount) {
      return res.status(400).json({
        message: "Seats exceed lab capacity"
      });
    }

    const existReservation = await Reservation.findOne({
      lab,
      date: bookingDate,
      status: { $in: ["pending", "approved"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (existReservation) {
      return res.status(409).json({
        message: "This lab is unavailable during the selected time"
      });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      lab,
      date: bookingDate,
      startTime,
      endTime,
      reason: reason.trim(),
      numOfSeats,
      status: "pending"
    });

    return res.status(201).json(reservation);

  } catch (error) {
    console.error("Create reservation error:", error);

    return res.status(500).json({
      message: "Failed to create reservation"
    });
  }
};

const getReservations = async (req, res) => {
  try {
    let filter = {};

    if (!isStaff(req.user)) {
      filter = { user: req.user._id };
    }

    const reservations = await Reservation.find(filter)
      .sort({ date: -1, startTime: 1 });

    return res.status(200).json(reservations);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch reservations"
    });
  }
};

const getReservationsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid Reservation ID"
      });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation Not Found"
      });
    }

    if (!isStaff(req.user) && !isOwner(reservation, req.user)) {
      return res.status(403).json({
        message: "You cannot view this reservation"
      });
    }

    return res.status(200).json(reservation);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch reservation"
    });
  }
};

const updateReservations = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid Reservation ID"
      });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation Not Found"
      });
    }

    if (req.user.role !== "representative" ||
        !isOwner(reservation, req.user)) {
      return res.status(403).json({
        message: "You cannot update this reservation"
      });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        message: "Only pending reservations can be edited"
      });
    }

    const { date, startTime, endTime, reason, numOfSeats } = req.body;

    const newDate = date == null
      ? reservation.date
      : parseBookingDate(date);

    const newStartTime = startTime ?? reservation.startTime;
    const newEndTime = endTime ?? reservation.endTime;
    const newSeats = numOfSeats ?? reservation.numOfSeats;
    const newReason = reason ?? reservation.reason;

    if (!newDate || isNaN(newDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date. Use YYYY-MM-DD"
      });
    }

    if (!isValidTime(newStartTime) ||
        !isValidTime(newEndTime) ||
        newStartTime >= newEndTime) {
      return res.status(400).json({
        message: "Please enter a valid time range"
      });
    }

    if (typeof newReason !== "string" || !newReason.trim()) {
      return res.status(400).json({
        message: "Please enter a valid reservation reason"
      });
    }

    if (!Number.isInteger(newSeats) || newSeats <= 0) {
      return res.status(400).json({
        message: "Number of seats must be a positive integer"
      });
    }

    const lab = await Lab.findById(reservation.lab);

    if (!lab) {
      return res.status(404).json({
        message: "Lab Not Found"
      });
    }

    if (newSeats > lab.seatCount) {
      return res.status(400).json({
        message: "Seats exceed lab capacity"
      });
    }

    const existReservation = await Reservation.findOne({
      _id: { $ne: reservation._id },
      lab: reservation.lab,
      date: newDate,
      status: { $in: ["pending", "approved"] },
      startTime: { $lt: newEndTime },
      endTime: { $gt: newStartTime }
    });

    if (existReservation) {
      return res.status(409).json({
        message: "This lab is unavailable during the selected time"
      });
    }

    const updatedReservation = await Reservation.findOneAndUpdate(
      {
        _id: reservation._id,
        user: req.user._id,
        status: "pending"
      },
      {
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        reason: newReason.trim(),
        numOfSeats: newSeats
      },
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(409).json({
        message: "Reservation is no longer available for editing"
      });
    }

    return res.status(200).json({
      message: "Reservation Updated",
      reservation: updatedReservation
    });

  } catch (error) {
    console.error("Update reservation error:", error);

    return res.status(500).json({
      message: "Failed to update reservation"
    });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid Reservation ID"
      });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation Not Found"
      });
    }

    if (req.user.role !== "representative" ||
        !isOwner(reservation, req.user)) {
      return res.status(403).json({
        message: "You cannot delete this reservation"
      });
    }

    if (!["pending", "rejected", "cancelled"].includes(reservation.status)) {
      return res.status(400).json({
        message: "Approved reservations cannot be deleted"
      });
    }

    const deletedReservation = await Reservation.findOneAndDelete({
      _id: reservation._id,
      user: req.user._id,
      status: { $in: ["pending", "rejected", "cancelled"] }
    });

    if (!deletedReservation) {
      return res.status(409).json({
        message: "Reservation status changed. Please try again"
      });
    }

    return res.status(200).json({
      message: "Reservation Deleted Successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete reservation"
    });
  }
};

const reviewReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid Reservation ID"
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected"
      });
    }

    const updatedReservation = await Reservation.findOneAndUpdate(
      {
        _id: id,
        status: "pending"
      },
      {
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedReservation) {
      const reservation = await Reservation.findById(id);

      if (!reservation) {
        return res.status(404).json({
          message: "Reservation Not Found"
        });
      }

      return res.status(409).json({
        message: "This reservation has already been reviewed"
      });
    }

    return res.status(200).json({
      message: `Reservation ${status} successfully`,
      reservation: updatedReservation
    });

  } catch (error) {
    console.error("Review reservation error:", error);

    return res.status(500).json({
      message: "Failed to review reservation"
    });
  }
};

export {
  createReservation,
  getReservations,
  getReservationsById,
  updateReservations,
  deleteReservation,
  reviewReservation
};
