import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nama harus diisi"),
  body("email")
    .isEmail()
    .withMessage("Email tidak valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").notEmpty().withMessage("Password harus diisi"),
];