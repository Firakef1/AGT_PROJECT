import { Router } from "express";
import {
  createDivisionController,
  deleteDivisionController,
  listDivisionsController,
  updateDivisionController,
  setDivisionLeaderController,
} from "../controllers/divisionController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate as any);

/**
 * @swagger
 * /divisions:
 *   get:
 *     summary: List all divisions (ADMIN, MEMBERS_MANAGER, DIVISION_HEAD)
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of divisions
 */
router.get("/", authorize(["ADMIN", "MEMBERS_MANAGER", "DIVISION_HEAD"]) as any, listDivisionsController);

// Create/update/delete/set-leader require ADMIN only
router.post("/", authorize(["ADMIN"]) as any, createDivisionController);

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
/**
 * @swagger
 * /divisions/{id}/set-leader:
 *   post:
 *     summary: Set a division leader (member must be in division ≥ 6 months)
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
 *             required: [memberId]
 *             properties:
 *               memberId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Leader assigned
 *       403:
 *         description: Member not eligible (less than 6 months in division)
 *       409:
 *         description: Division already has a leader
 */
router.post("/:id/set-leader", authorize(["ADMIN"]) as any, setDivisionLeaderController);

/**
 * @swagger
 * /divisions/{id}:
 *   put:
 *     summary: Update a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", authorize(["ADMIN"]) as any, updateDivisionController);

/**
 * @swagger
 * /divisions/{id}:
 *   delete:
 *     summary: Delete a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authorize(["ADMIN"]) as any, deleteDivisionController);

export default router;
