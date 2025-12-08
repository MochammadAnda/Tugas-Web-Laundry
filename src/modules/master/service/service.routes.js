import { Router } from "express";
import { validate } from "../../../middleware/validation.js";
import * as ServiceController from "./service.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./service.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get("/", ServiceController.index);
router.post("/", validate(storeUpdateSchema), ServiceController.store);
router.get("/:id", ServiceController.show);
router.put("/:id", validate(storeUpdateSchema), ServiceController.update);
router.delete("/:id", ServiceController.destroy);
router.patch("/:id/set-status", ServiceController.setStatus);

export default router;