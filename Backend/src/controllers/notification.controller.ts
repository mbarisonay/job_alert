import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as notificationService from "../services/notification.service";

export async function getNotifications(req: AuthRequest, res: Response) {
  const notifications = await notificationService.getUserNotifications(req.user!.userId);
  const unreadCount = await notificationService.getUnreadCount(req.user!.userId);

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
    },
  });
}

export async function markAsRead(req: AuthRequest, res: Response) {
  const id = String(req.params.id);
  const updated = await notificationService.markAsRead(req.user!.userId, id);
  res.json({ success: true, data: updated });
}

export async function markAllAsRead(req: AuthRequest, res: Response) {
  const result = await notificationService.markAllAsRead(req.user!.userId);
  res.json({ success: true, data: { updatedCount: result.count } });
}
