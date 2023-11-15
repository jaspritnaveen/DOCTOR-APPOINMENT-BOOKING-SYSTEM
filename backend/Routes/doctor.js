// doctor.js
import express from "express";
import {
  getSingleDoctor,
  getAllDoctor,
  updateDoctor, // Corrected the function name here
  deleteDoctor,
} from "../Controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

import reviewRouter from "./review.js";

const router = express.Router();

// Nested route
router.use("/:doctorid/reviews", reviewRouter);

router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);
router.delete("/:id", authenticate, restrict(["patient"]), deleteDoctor);

export default router;
