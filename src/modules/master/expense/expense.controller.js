import * as ExpenseService from "./expense.service.js";
import { success, error } from "../../../utils/response.js";

export const index = async (req, res) => {
    try {
        const data = await ExpenseService.index();
        return success(res, data, "Successfully retrieved all expenses");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

export const show = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        const data = await ExpenseService.show({ id });
        return success(res, data, "Successfully retrieved expense details");
    } catch (err) {
        return error(res, err.message, 404);
    }
};

export const store = async (req, res) => {
    try {
        const data = await ExpenseService.store(req.body); 
        return success(res, data, "Expense successfully created", 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

export const update = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        const data = await ExpenseService.update({ id, ...req.body }); 
        return success(res, data, "Expense successfully updated");
    } catch (err) {
        if (err.message.includes("not found")) {
            return error(res, err.message, 404);
        }
        return error(res, err.message, 400);
    }
};

export const destroy = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        await ExpenseService.destroy({ id }); 
        return success(res, null, "Expense successfully deleted");
    } catch (err) {
        if (err.message.includes("not found")) {
            return error(res, err.message, 404);
        }
        return error(res, err.message, 500);
    }
};

export const setDone = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        const data = await ExpenseService.setDone({ id });
        return success(res, data, "Expense status updated to Done");
    } catch (err) {
        if (err.message.includes("not found")) {
            return error(res, err.message, 404);
        }
        return error(res, err.message, 400);
    }
};