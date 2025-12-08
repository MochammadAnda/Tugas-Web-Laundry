import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import * as AdminPackageController from "./admin-package.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./admin-package.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get("/", AdminPackageController.index);
router.post("/set-status", validate(storeUpdateSchema), AdminPackageController.setStatus);

export default router;