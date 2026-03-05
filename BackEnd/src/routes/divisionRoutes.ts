import { Router } from "express";
import {
  createDivisionController,
  deleteDivisionController,
  listDivisionsController,
  updateDivisionController,
} from "../controllers/divisionController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate, authorize(["ADMIN"]));

/**
 * @swagger
 * /divisions:
 *   get:
 *     summary: List all divisions
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of divisions
 */
router.get("/", listDivisionsController);

/**
 * @swagger
 * /divisions:
 *   post:
 *     summary: Create a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Division created
 */
router.post("/", createDivisionController);

/**
 * @swagger
 * /divisions/{id}:
 *   put:
 *     summary: Update a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Division updated
 */
router.put("/:id", updateDivisionController);

/**
 * @swagger
 * /divisions/{id}:
 *   delete:
 *     summary: Delete a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Division deleted
 */
router.delete("/:id", deleteDivisionController);

export default router;

