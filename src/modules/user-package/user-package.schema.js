import { body } from "express-validator";

export const storeUpdateSchema = [
    body("package_id")
        .notEmpty()
        .isNumeric()
];