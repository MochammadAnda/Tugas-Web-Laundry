import * as AdminOrderService from "./admin-order.service.js";
import { success, error } from "../../utils/response.js";

export const index = async (req, res) => {
  try {
    const { status } = req.params;
    const data = await AdminOrderService.index({ status });
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const setStatus = async (req, res) => {
  try {
    const { transaction_id, status } = req.body;
    const data = await AdminOrderService.setStatus({ transactionId: transaction_id, status });
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const getAllOrder = async (req, res) => {
  try {
    const data = await AdminOrderService.getAllOrder();
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
}

export const getOrderLog = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await AdminOrderService.getOrderLog(Number(id));
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
}

export const addOrderLog = async (req, res) => {
  try {
    const { order_id, log } = req.body;
    const data = await AdminOrderService.addOrderLog(Number(order_id), log);
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
}

export const setDone = async (req, res) => {
  try {
    const { order_id } = req.body;
    const data = await AdminOrderService.setDone(Number(order_id));
    return success(res, data, "Success get data");
  } catch (err) {
    return error(res, err.message, 400);
  }
}