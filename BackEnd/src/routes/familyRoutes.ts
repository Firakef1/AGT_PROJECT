import { Router } from "express";
import {
  getFamilies,
  createFamily,
  autoDistributeMembers
} from "../controllers/familyController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", getFamilies);
router.post("/", authorize(["ADMIN", "DIVISION_HEAD"]), createFamily);
router.post("/auto-distribute", authorize(["ADMIN", "DIVISION_HEAD"]), autoDistributeMembers);

export default router;
