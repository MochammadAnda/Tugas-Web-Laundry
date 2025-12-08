import { Router } from "express";
import { validate } from "../../../middleware/validation.js";
import * as ExpenseController from "./expense.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./expense.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get("/", ExpenseController.index);
router.post("/", validate(storeUpdateSchema), ExpenseController.store);
router.get("/:id", ExpenseController.show);
router.put("/:id", validate(storeUpdateSchema), ExpenseController.update);
router.delete("/:id", ExpenseController.destroy);
router.patch("/:id/done", ExpenseController.setDone);

export default router;