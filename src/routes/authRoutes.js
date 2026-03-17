import express from "express";
import { getSetupStatus, setupAdmin, loginUser, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/setup-status", getSetupStatus);
router.post("/setup-admin", setupAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;