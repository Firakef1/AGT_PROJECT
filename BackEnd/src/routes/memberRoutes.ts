import { Router } from "express";
import {
  approveMemberController,
  deleteMemberController,
  listMembersController,
  registerMemberController,
  rejectMemberController,
  updateMemberController,
  assignDivisionLeaderController,
  assignMemberToDivisionController,
} from "../controllers/memberController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /members/register:
 *   post:
 *     summary: Register a new member (Public)
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, fullName, email]
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
 *         description: Registration submitted
 */
router.post("/register", registerMemberController);

// Authenticated routes below this point
router.use(authenticate as any);

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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: List of members
 */
router.get(
  "/",
  authorize(["ADMIN", "MEMBERS_MANAGER", "DIVISION_HEAD"]) as any,
  listMembersController,
);

/**
 * @swagger
 * /members/{id}/approve:
 *   post:
 *     summary: Approve a pending member (sends email with temp password)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/:id/approve",
  authorize(["ADMIN", "MEMBERS_MANAGER"]) as any,
  approveMemberController,
);

/**
 * @swagger
 * /members/{id}/reject:
 *   post:
 *     summary: Reject a pending member (sends rejection email)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/:id/reject",
  authorize(["ADMIN", "MEMBERS_MANAGER"]) as any,
  rejectMemberController,
);

/**
 * @swagger
 * /members/{id}/assign-leader:
 *   post:
 *     summary: Assign member as a division leader
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [divisionId]
 *             properties:
 *               divisionId:
 *                 type: string
 *                 format: uuid
 */
router.post(
  "/:id/assign-leader",
  authorize(["ADMIN"]) as any,
  assignDivisionLeaderController,
);

/**
 * @swagger
 * /members/{id}/division:
 *   put:
 *     summary: Assign or unassign a member to/from a division
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [divisionId]
 *             properties:
 *               divisionId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: UUID to assign, null to unassign
 */
router.put(
  "/:id/division",
  authorize(["ADMIN", "MEMBERS_MANAGER"]) as any,
  assignMemberToDivisionController,
);

router.put(
  "/:id",
  authorize(["ADMIN", "MEMBERS_MANAGER", "DIVISION_HEAD"]) as any,
  updateMemberController,
);

router.delete("/:id", authorize(["ADMIN"]) as any, deleteMemberController);

export default router;
