import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import * as AdminOrderController from "./admin-order.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./admin-order.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get("/:status", AdminOrderController.index);
router.post("/set-status", validate(storeUpdateSchema), AdminOrderController.setStatus);

export default router;