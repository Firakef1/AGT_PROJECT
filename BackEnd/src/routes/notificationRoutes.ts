import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * GET /notifications — list notifications (stub: returns empty array until real implementation)
 */
router.get("/", (_req: Request, res: Response) => {
  res.json([]);
});

export default router;
