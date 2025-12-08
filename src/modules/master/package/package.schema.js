import { body } from "express-validator";

export const storeUpdateSchema = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),

    body("description")
        .notEmpty()
        .isString(),

    body("price")
        .notEmpty()
        .isNumeric(),

    body("quota")
        .notEmpty()
        .isNumeric(),
];