import * as UserPackageService from "./user-package.service.js";
import { success, error } from "../../utils/response.js";
import { prisma } from "../../utils/prisma.js";

export const index = async (req, res) => {
  try {
    const userId = req.user.id
    const data = await UserPackageService.index({userId});
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await UserPackageService.show({userPackageId: Number(id)});
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const store = async (req, res) => {
  try {
    let user_id = req.user.id;
    let { package_id } = req.body;
    console.log("Package id " + package_id);
    
    user_id = Number(user_id)
    package_id = Number(package_id)

    const mPackage = await prisma.mPackage.findUnique({ where: { id: package_id } })
    if (!mPackage) return error(res, "Package not found", 400);

    const data = await UserPackageService.store({ userId: user_id, packageId: package_id })
    return success(res, data, "Success store data");
  } catch (err) {
    return error(res, err.message, 400);
  }
}