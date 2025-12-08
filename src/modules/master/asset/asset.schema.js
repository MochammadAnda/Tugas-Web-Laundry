import { body } from "express-validator";

export const storeUpdateSchema = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),

    body("buy_price")
        .notEmpty()
        .isNumeric(),

    body("nilai_sisa")
        .notEmpty()
        .isNumeric(),

    body("umur_ekonomis")
        .notEmpty()
        .isNumeric(),

    body("buy_date")
        .notEmpty().withMessage("buy_date is required")
        .custom((value) => {
            const d = new Date(value);
            if (isNaN(d.getTime())) {
                throw new Error("buy_date must be a valid date");
            }
            return true;
        }),
];