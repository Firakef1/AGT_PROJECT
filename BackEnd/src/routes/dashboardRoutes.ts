import { Router } from "express";
import { dashboardSummaryController } from "../controllers/dashboardController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get high-level dashboard metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary including counts and finance totals
 */
router.get("/summary", dashboardSummaryController);

export default router;

