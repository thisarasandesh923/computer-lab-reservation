import Reservation from "../models/Reservation.js";


const createReservation = async (req, res) => {
    try {

    const { user, lab, date, startTime, endTime, reason } = req.body;

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
        });

        res.status(201).json(reservation);
    }

    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

export { createReservation };