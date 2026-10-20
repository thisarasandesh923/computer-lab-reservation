import express from "express";
import { createLab } from "../controllers/labController.js";

const router = express.Router();

router.post("/", createLab);



export default router;
