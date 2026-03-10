import { Router } from "express";
import {
  getFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
  autoDistributeMembers
} from "../controllers/familyController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", getFamilies);
router.post("/", authorize(["ADMIN", "DIVISION_HEAD"]), createFamily);
router.put("/:id", authorize(["ADMIN", "DIVISION_HEAD"]), updateFamily);
router.delete("/:id", authorize(["ADMIN", "DIVISION_HEAD"]), deleteFamily);
router.post("/auto-distribute", authorize(["ADMIN", "DIVISION_HEAD"]), autoDistributeMembers);

export default router;
