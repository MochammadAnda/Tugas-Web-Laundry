import { Router } from "express";
import { validate } from "../../../middleware/validation.js";
import * as AssetController from "./asset.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./asset.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get("/", AssetController.index);
router.post("/", validate(storeUpdateSchema), AssetController.store);
router.get("/:id", AssetController.show);
router.put("/:id", validate(storeUpdateSchema), AssetController.update);
router.delete("/:id", AssetController.destroy);

export default router;