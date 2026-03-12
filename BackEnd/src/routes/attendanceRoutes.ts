import { Router } from "express";
import {
  getDivisionAttendanceSummaryController,
  getEventAttendanceController,
  getMemberAttendanceSummaryController,
  markAttendanceController,
} from "../controllers/attendanceController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Mark attendance for a member at an event
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [memberId, eventId, status]
 *             properties:
 *               memberId:
 *                 type: string
 *               eventId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, EXCUSED]
 *     responses:
 *       200:
 *         description: Attendance recorded
 */
router.post("/", markAttendanceController);

/**
 * @swagger
 * /attendance/event/{eventId}:
 *   get:
 *     summary: Get attendance list for an event
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance records for the event
 */
router.get("/event/:eventId", getEventAttendanceController);

/**
 * @swagger
 * /attendance/member/{memberId}/summary:
 *   get:
 *     summary: Get attendance summary for a member
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance summary including participation percentage
 */
router.get("/member/:memberId/summary", getMemberAttendanceSummaryController);

/**
 * @swagger
 * /attendance/division/{divisionId}/summary:
 *   get:
 *     summary: Get participation overview for a division (per-member attendance stats)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: divisionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: totalDivisionEvents and members with presentCount, participationPercentage
 */
router.get(
  "/division/:divisionId/summary",
  getDivisionAttendanceSummaryController,
);

export default router;

