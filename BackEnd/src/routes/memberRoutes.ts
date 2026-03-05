import { Router } from "express";
import {
  createMemberController,
  deleteMemberController,
  listMembersController,
  updateMemberController,
} from "../controllers/memberController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /members:
 *   get:
 *     summary: List members
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: divisionId
 *         schema:
 *           type: string
 *         description: Filter by division ID
 *     responses:
 *       200:
 *         description: List of members
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", authorize(["ADMIN", "DIVISION_HEAD"]), listMembersController);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Create a member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, fullName, email, divisionId]
 *             properties:
 *               studentId:
 *                 type: string
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               divisionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member created
 *       400:
 *         description: Invalid input
 */
router.post("/", authorize(["ADMIN", "DIVISION_HEAD"]), createMemberController);

/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Update a member
 *     tags: [Members]
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               divisionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", authorize(["ADMIN", "DIVISION_HEAD"]), updateMemberController);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Delete a member
 *     tags: [Members]
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
 *         description: Member deleted
 */
router.delete("/:id", authorize(["ADMIN"]), deleteMemberController);

export default router;

