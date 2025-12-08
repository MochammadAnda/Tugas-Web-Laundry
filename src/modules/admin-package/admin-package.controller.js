import * as AdminPackageService from "./admin-package.service.js";
import { success, error } from "../../utils/response.js";

export const index = async (req, res) => {
  try {
    const data = await AdminPackageService.index();
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const setStatus = async (req, res) => {
  try {
    const { transaction_id, status } = req.body;
    const data = await AdminPackageService.setStatus({transactionId: transaction_id, status});
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};