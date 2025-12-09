import * as UserOrderService from "./user-order.service.js";
import { success, error } from "../../utils/response.js";

export const index = async (req, res) => {
  try {
    const data = await UserOrderService.index({ userId: Number(req.user.id) });
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await UserOrderService.show({ orderId: Number(id) });
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const store = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { service_id, quantity_kg, delivery_method, address, user_package_id = null } = req.body;

    const data = await UserOrderService.store({ user_id, service_id, quantity_kg, delivery_method, address, user_package_id })
    return success(res, data, "Success store data");
  } catch (err) {
    return error(res, err.message, 400);
  }
}

export const getService = async (req, res) => {
  try {
    const data = await UserOrderService.getService()
    return success(res, data, "Success get service");
  } catch (err) {
    return error(res, err.message, 400);
  }
}

export const getUserPackage = async (req, res) => {
  try {
    const user_id = Number(req.user.id);
    const { quota } = req.params;
    const data = await UserOrderService.getUserPackage({ user_id, quota })
    return success(res, data, "Success get user package");
  } catch (err) {
    return error(res, err.message, 400);
  }
}

export const getTrxPending = async (req, res) => {
  try {
    const user_id = Number(req.user.id);
    const data = await UserOrderService.getTrxPending(user_id)
    return success(res, data, "Success get user package");
  } catch (err) {
    return error(res, err.message, 400);
  }
}