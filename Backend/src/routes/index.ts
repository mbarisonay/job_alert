import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import cvRoutes from "./cv.routes";
import jobRoutes from "./job.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/cv", cvRoutes);
router.use("/jobs", jobRoutes);

export default router;
