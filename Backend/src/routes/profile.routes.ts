import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as ctrl from "../controllers/profile.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Sadece resim dosyaları kabul edilir."));
  },
});

const router = Router();

router.use(authMiddleware as any);

router.get("/", ctrl.getProfile as any);
router.put("/about", ctrl.saveAbout as any);
router.post("/avatar", upload.single("avatar"), ctrl.uploadAvatar as any);

router.post("/experiences", ctrl.createExperience as any);
router.delete("/experiences/:id", ctrl.removeExperience as any);

router.post("/educations", ctrl.createEducation as any);
router.delete("/educations/:id", ctrl.removeEducation as any);

router.post("/languages", ctrl.createLanguage as any);
router.delete("/languages/:id", ctrl.removeLanguage as any);

router.post("/projects", ctrl.createProject as any);
router.delete("/projects/:id", ctrl.removeProject as any);

export default router;
