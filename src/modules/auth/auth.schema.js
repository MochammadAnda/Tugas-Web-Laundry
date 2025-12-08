import { body } from "express-validator";

export const registerSchema = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("phone")
        .notEmpty()
        .withMessage("Phone is required"),

    body("address")
        .notEmpty()
        .withMessage("Address is required"),
];

export const loginSchema = [
    body("email")
        .isEmail()
        .withMessage("Valid email required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];
