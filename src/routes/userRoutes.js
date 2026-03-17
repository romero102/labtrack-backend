import express from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, restoreUser} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createUserValidator } from "../validators/createUserValidator.js"
import { updateUserValidator } from "../validators/updateUserValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), createUserValidator, validate, createUser);
router.get("/", protect, authorizeRoles("admin", "technician"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin", "technician"), validateObjectId, getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUserValidator,validateObjectId, validate, updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), validateObjectId, deleteUser);
router.put("/restore/:id", protect, authorizeRoles("admin"), restoreUser)

export default router;