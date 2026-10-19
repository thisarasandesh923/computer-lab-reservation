import Reservation from "../models/Reservation.js";
import Lab from "../models/laboratory.js";


const createReservation = async (req, res) => {
    try {

    const { user, lab, date, startTime, endTime, reason, numOfSeats } = req.body;

             if (!user || !lab || !date || !startTime || !endTime || !reason)

            {
                return res.status(400).json({
                    message: "Please Fill  all required fields"
                });
            }

             if (startTime >= endTime)

            {
                 return res.status(400).json({
                     message: " start time should be early than the end time "

                });

            }

        const selectedLab = await Lab.findById(lab);

             if (!selectedLab)

            {
                 return res.status(404).json({
                 message: "Lab not found"
                });
            }


             if (numOfSeats > selectedLab.seatCount)

            {

                 return res.status(400).json({
                     message :"Seat count is too much"

                 });

            }

        const existReservation = await Reservation.findOne({

            lab,
            date,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        });

        if (existReservation) {
            return res.status(400).json({

                message: "This Time Slot Already Book For Other Lab"
            });

            }

    const reservation = await Reservation.create({
            user,
            lab,
            date,
            startTime,
            endTime,
            reason,
            numOfSeats
        });

        res.status(201).json(reservation);
    }

    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
        }

    catch (error) {
        res.status(500).json(
            { messege: error.message }
        );
    }

};


export { createReservation,getReservations };