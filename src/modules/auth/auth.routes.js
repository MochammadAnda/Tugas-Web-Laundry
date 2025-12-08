import { Router } from "express";
import { validate } from "../../middleware/validation.js";
import * as AuthController from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);

router.post("/login", validate(loginSchema), AuthController.login);

export default router;
