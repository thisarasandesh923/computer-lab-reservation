import mongoose from "mongoose";


const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },

    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lab",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    }

});

const Reservation = mongoose.Model("Reservation", reservationSchema);

export default Reservation;