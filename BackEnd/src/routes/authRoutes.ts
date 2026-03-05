import { Router, Request, Response, NextFunction } from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import passport from "../config/googleAuth";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, fullName]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DIVISION_HEAD, MEMBER]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already in use
 */
router.post(
  "/register",
  authenticate,
  authorize(["ADMIN"]),
  registerController,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and obtain a JWT
 *     tags: [Auth]
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Invalid input
 */
router.post("/login", loginController);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect to Google for OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth consent screen
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns JWT and user info after successful Google login
 */
router.get(
  "/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      (err, result: any) => {
        if (err || !result) {
          return res.status(401).json({ message: "Google authentication failed" });
        }
        const { user, token } = result;
        return res.json({ token, user });
      },
    )(req, res, next);
  },
);

export default router;

