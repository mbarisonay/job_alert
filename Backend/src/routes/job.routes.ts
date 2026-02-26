import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as ctrl from "../controllers/job.controller";

const router = Router();

// Protect all job routes
router.use(authMiddleware as any);

// ─── Saved Jobs ───
router.post("/saved", ctrl.saveJob as any);
router.get("/saved", ctrl.getSavedJobs as any);
router.delete("/saved/:id", ctrl.removeSavedJob as any);

// ─── Job Applications (Tracking) ───
router.post("/applications", ctrl.addApplication as any);
router.get("/applications", ctrl.getApplications as any);
router.put("/applications/:id", ctrl.updateApplicationStatus as any);
router.delete("/applications/:id", ctrl.removeApplication as any);

export default router;
