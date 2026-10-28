
import express from "express";
import {
  createReservation,
  getReservations,
  getReservationsById,
  updateReservations,
  deleteReservation,
  reviewReservation,
  getLabAvailability
} from "../controllers/reservationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("representative"),
  createReservation
);

router.get("/", protect, getReservations);
router.get("/availability", protect, getLabAvailability);

router.get("/:id", protect, getReservationsById);

router.put(
  "/:id",
  protect,
  authorize("representative"),
  updateReservations
);

router.delete(
  "/:id",
  protect,
  authorize("representative"),
  deleteReservation
);

router.patch(
  "/:id/review",
  protect,
  authorize("module_coordinator", "lab_coordinator", "instructor"),
  reviewReservation
);

export default router;
