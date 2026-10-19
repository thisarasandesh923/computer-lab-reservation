import express from "express";
import { createReservation,getReservations, getReservationsById } from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationsById);



export default router;