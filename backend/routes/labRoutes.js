
import express from "express";
import {
  createLab,
  getLabs,
  getLabById
} from "../controllers/labController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLabs);

router.get("/:id", protect, getLabById);


router.post(
  "/",
  protect,
  authorize("module_coordinator", "lab_coordinator", "instructor"),
  createLab
);

export default router;
