import Reservation from "../models/Reservation.js";
import Lab from "../models/laboratory.js";


const createReservation = async (req, res) => {
    try {

    const { user, lab, date, startTime, endTime, reason, numOfSeats } = req.body;

             if (!user || !lab || !date || !startTime || !endTime || !reason || numOfSeats==null)

            {
                return res.status(400).json({
                    message: "Please Fill  all required fields"
                });
            }

        const bookingDate = new Date(date);

        if (isNaN(bookingDate.getTime()))
        {
            return res.status(400).json
                (
                    {
                        message: "Invalid date"
                    }
                );
        }




            if (startTime >= endTime)

            {
                 return res.status(400).json({
                     message: " start time should be early than the end time "

                });

            }

        if (!Number.isInteger(numOfSeats) || numOfSeats <= 0)
        {
            return res.status(400).json
            (
                {
                    message: "Number of seats must be a positive integer"
                }
            );
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
            date:bookingDate,
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
            date:bookingDate,
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
            { message: error.message }
        );
    }

};

const getReservationsById = async (req, res) => {
    try
    {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);

        if (!reservation)
        {
            return res.status(404).json
                (
                    {
                        message : " Reservation Not Found "
                    }
                );
        }
        res.status(200).json(reservation);
    }

    catch ( error )
    {
        res.status(500).json

            (
                {
                    message : error.message
                }
            );

    }

};

const updateReservations = async (req , res) => {
    try {
        const { id } = req.params;
        const { date, startTime, endTime, reason, numOfSeats } = req.body;

        const reservation = await Reservation.findById(id);

        if (!reservation)
        {
            return res.status(404).json
                (
                    {
                        message : "Sorry!.. Reservation Not Found"
                    }
                );
        }

        const newStartTime = startTime ?? reservation.startTime;
        const newEndTime = endTime ?? reservation.endTime;
        const newDate = date ? new Date(date) : reservation.date;

        if (isNaN(newDate.getTime()))
        {
            return res.status(400).json
            (
                {
                    message: "Invalid date"
                }
            );
        }




        if (newStartTime >= newEndTime)
        {
            return res.status(400).json
            (
                {
                    message: " New Start time must be earlier than New end time "
                }
            );
        }
        const existReservation = await Reservation.findOne
            (
                {
                    _id : { $ne: id },
                    lab : reservation.lab,
                    date : newDate,
                    startTime : { $lt: newEndTime },
                    endTime : { $gt: newStartTime }
                }
            );

        if (existReservation)
        {
            return res.status(400).json
                (
                    {
                        message: "This time slot is already booked for other lab"
                    }
                );
        }

        const newSeats = numOfSeats ?? reservation.numOfSeats;
        const lab = await Lab.findById(reservation.lab);
        if (!lab)
        {
            return res.status(404).json
            (
                {
                  message: "Lab Not Found."
                }

            );
        }

        if (!Number.isInteger(newSeats) || newSeats <= 0)
        {
            return res.status(400).json
            (
                {
                  message: "no of seats should be postive integer"
                }

            );
        }

        if (newSeats > lab.seatCount)
        {
            return res.status(400).json
            (
                {
                  message: "seats exceed lab capacity "
                }

            );
        }

        const updateReservation = await Reservation.findByIdAndUpdate

        (
            id,
            {
                date: newDate,
                startTime:newStartTime,
                endTime:newEndTime,
                reason:reason ?? reservation.reason,
                numOfSeats: newSeats
            },

            { new:true , runValidators:true }
        );
        res.status(200).json
        (
            {
                message: "Reservation Updated.",
                reservation: updateReservation
            }
        );

    }
    catch (error)
    {
        res.status(500).json
        (
            {
                message: error.message
            }

        );

    }
};
export { createReservation,getReservations,getReservationsById,updateReservations };