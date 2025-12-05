import { Router } from "express";
import authRoutes from "./auth.routes.js";
// import route lain jika ada

const router = Router();

router.use("/auth", authRoutes);

export default router;
