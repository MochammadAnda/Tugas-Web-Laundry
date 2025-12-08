import { body } from "express-validator";
const VALID_CATEGORIES = ['OPERATIONAL', 'SALARY', 'MARKETING', 'ETC'];
const VALID_STATUSES = ['PENDING', 'DONE'];

export const storeUpdateSchema = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn(VALID_CATEGORIES)
        .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),

    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a positive number"),

    body("due_date")
        .notEmpty().withMessage("due_date is required")
        .custom((value) => {
            const d = new Date(value);
            if (isNaN(d.getTime())) {
                throw new Error("due_date must be a valid date");
            }
            return true;
        }),

    body("status")
        .optional()
        .isIn(VALID_STATUSES)
        .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];