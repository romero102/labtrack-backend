import express from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createUser);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.post("/login", loginUser);

export default router;