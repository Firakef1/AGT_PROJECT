import { Router } from "express";
import {
  financeSummaryController,
  recordTransactionController,
  listTransactionsController,
} from "../controllers/financeController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate as any, authorize(["ADMIN", "DIVISION_HEAD"]) as any);

/**
 * @swagger
 * /finance:
 *   post:
 *     summary: Record a financial transaction
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               divisionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction recorded
 */
router.post("/", recordTransactionController);

/**
 * @swagger
 * /finance:
 *   get:
 *     summary: List finance transactions
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: divisionId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/", listTransactionsController);

/**
 * @swagger
 * /finance/summary:
 *   get:
 *     summary: Get finance summary
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: divisionId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Finance summary
 */
router.get("/summary", financeSummaryController);

export default router;

