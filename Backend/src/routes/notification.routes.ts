import { Router } from "express";
import * as ctrl from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export const router = Router();

router.use(authMiddleware as any);

router.get("/", ctrl.getNotifications as any);
router.put("/read-all", ctrl.markAllAsRead as any);
router.put("/:id/read", ctrl.markAsRead as any);
