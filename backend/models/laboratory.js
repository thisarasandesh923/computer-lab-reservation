import mongoose from "mongoose";

const labScheme = new mongoose.Schema({

    labName: {

        type: String,
        required: true
    },
    labVenue: {
        type: String,
        required: true
    },

    seatCount: {
        type: Number,
        required: true

    },
    status: {
    type: String,
    required: true,
    default: "Available"
    }
});

const Lab = mongoose.model("Lab", labScheme);

export default Lab;
