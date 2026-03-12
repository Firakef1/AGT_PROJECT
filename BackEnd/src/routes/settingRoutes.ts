import { Router } from "express";
import { getSettings, updateSetting } from "../controllers/settingController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate, authorize(["ADMIN"]));

router.get("/", getSettings);
router.post("/", updateSetting);

export default router;
