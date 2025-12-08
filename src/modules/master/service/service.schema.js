import { body } from "express-validator";
const SERVICE_UNIT = ['KG', 'PCS'];
const SERVICE_STATUS = ['ACTIVE', 'INACTIVE'];

export const storeUpdateSchema = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),

    body("description")
        .notEmpty()
        .isString(),

    body("price_per_unit")
        .notEmpty()
        .isNumeric(),

    body("unit")
        .notEmpty()
        .withMessage("Unit is required")
        .isIn(SERVICE_UNIT)
        .withMessage(`Unit must be one of: ${SERVICE_UNIT.join(', ')}`),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(SERVICE_STATUS)
        .withMessage(`Status must be one of: ${SERVICE_STATUS.join(', ')}`),
];