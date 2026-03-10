import { Router } from "express";
import { dashboardSummaryController, dashboardActivitiesController, dashboardChartController } from "../controllers/dashboardController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate as any);

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
router.get("/", dashboardSummaryController);
router.get("/activities", dashboardActivitiesController);
router.get("/chart", dashboardChartController);

export default router;

