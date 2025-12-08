import { Router } from "express";
import { role } from "./middleware/role.js";
import { auth } from "./middleware/auth.js";
import authRoutes from "./modules/auth/auth.routes.js";
import masterExpenseRoutes from "./modules/master/expense/expense.routes.js"
import masterAssetRoutes from "./modules/master/asset/asset.routes.js"
import masterServiceRoutes from "./modules/master/service/service.routes.js"
import masterPackageRoutes from "./modules/master/package/package.routes.js"
import userPackageRoutes from "./modules/user-package/user-package.routes.js"
import userOrderRoutes from "./modules/user-order/user-order.routes.js"
import adminPackageRoutes from "./modules/admin-package/admin-package.routes.js"
import adminOrderRoutes from "./modules/admin-order/admin-order.routes.js"

const router = Router();

router.use("/auth", authRoutes);

router.use("/master/expense", auth, role("ADMIN"), masterExpenseRoutes);
router.use("/master/asset", auth, role("ADMIN"), masterAssetRoutes);
router.use("/master/service", auth, role("ADMIN"), masterServiceRoutes);
router.use("/master/package", auth, role("ADMIN"), masterPackageRoutes);

router.use("/user-package", auth, userPackageRoutes);
router.use("/user-order", auth, userOrderRoutes);

router.use("/admin-package", auth, role("ADMIN"), adminPackageRoutes);
router.use("/admin-order", auth, role("ADMIN"), adminOrderRoutes);

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;
