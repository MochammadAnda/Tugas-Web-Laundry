import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import * as UserOrderController from "./user-order.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./user-order.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get('/get-trx-pending', UserOrderController.getTrxPending);
router.get("/get-user-package/:quota", UserOrderController.getUserPackage);
router.get("/get-service", UserOrderController.getService);
router.get("/", UserOrderController.index);
router.get("/:id", UserOrderController.show);
router.post("/", validate(storeUpdateSchema), UserOrderController.store);

export default router;