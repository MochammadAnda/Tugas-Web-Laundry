import { body } from "express-validator";
const TRANSACTION_STATUS = ["PENDING", "FAILED", "SUCCESS"]

export const storeUpdateSchema = [
    body("transaction_id")
        .notEmpty()
        .isNumeric(),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(TRANSACTION_STATUS)
        .withMessage(`Status must be one of: ${TRANSACTION_STATUS.join(', ')}`),
];