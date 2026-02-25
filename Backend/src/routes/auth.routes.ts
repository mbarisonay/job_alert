import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  registerController,
  loginController,
  updateUserController,
  changePasswordController,
  deleteAccountController,
} from "../controllers/auth.controller";

const router = Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);

// Protected routes
router.use(authMiddleware as any);
router.put("/user", updateUserController as any);
router.put("/password", changePasswordController as any);
router.delete("/account", deleteAccountController as any);

export default router;
