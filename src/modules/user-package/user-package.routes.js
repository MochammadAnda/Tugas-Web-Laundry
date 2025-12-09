import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import * as UserPackageController from "./user-package.controller.js"; // Import Controller Expense
import { storeUpdateSchema } from "./user-package.schema.js"; // Import Schema Validasi Expense

const router = Router();

router.get('/get-package', UserPackageController.getPackage);
router.get('/get-trx-pending', UserPackageController.getTrxPending);
router.get("/", UserPackageController.index);
router.get("/:id", UserPackageController.show);
router.post("/", validate(storeUpdateSchema), UserPackageController.store);

export default router;