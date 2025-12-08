import { Router } from "express";
import { validate } from "../../../middleware/validation.js";
import * as PackageController from "./package.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./package.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get("/", PackageController.index);
router.post("/", validate(storeUpdateSchema), PackageController.store);
router.get("/:id", PackageController.show);
router.put("/:id", validate(storeUpdateSchema), PackageController.update);
router.delete("/:id", PackageController.destroy);

export default router;