import express from "express";
import {
  getSingleUser,
  getAllUser,
  updateUser,
  deleteUser,
} from "../Controllers/userController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);
router.get("/", authenticate, restrict(["admin"]), getAllUser);
router.put("/:id", updateUser);
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

export default router;
