import { Router } from "express";
import {
  createInventoryItemController,
  deleteInventoryItemController,
  listInventoryController,
  updateInventoryItemController,
} from "../controllers/inventoryController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate, authorize(["ADMIN", "DIVISION_HEAD"]));

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: List inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inventory items
 */
router.get("/", listInventoryController);

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Create an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, quantity]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inventory item created
 */
router.post("/", createInventoryItemController);

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
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
 *               quantity:
 *                 type: integer
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inventory item updated
 */
router.put("/:id", updateInventoryItemController);

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
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
 *         description: Inventory item deleted
 */
router.delete("/:id", deleteInventoryItemController);

export default router;

