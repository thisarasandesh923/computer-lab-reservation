import express from "express";
import {
    createReservation,
    getReservations,
    getReservationsById,
    updateReservations,
    deleteReservation
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationsById);
router.put("/:id", updateReservations);
router.delete("/:id", deleteReservation);



export default router;