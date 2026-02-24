import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  uploadController,
  listController,
  deleteController,
  analyzeController,
  rewriteController,
} from "../controllers/cv.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const router = Router();

router.use(authMiddleware as any);

router.post("/upload", upload.single("file"), uploadController as any);
router.get("/list", listController as any);
router.delete("/:id", deleteController as any);
router.post("/:id/analyze", analyzeController as any);
router.post("/:id/rewrite", rewriteController as any);

export default router;
