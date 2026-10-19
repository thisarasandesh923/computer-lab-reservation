import express from "express";
import { createReservation,getReservations, getReservationsById, updateReservations } from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", createReservation);
router.get("/", getReservations);
router.get("/:id", getReservationsById);
router.put("/:id", updateReservations);



export default router;