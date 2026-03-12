import { Router } from "express";
import { getReports, createReport } from "../controllers/reportController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate, authorize(["ADMIN", "DIVISION_HEAD"]));

router.get("/", getReports);
router.post("/", createReport);

export default router;
