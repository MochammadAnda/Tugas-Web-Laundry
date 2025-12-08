import * as ServiceService from "./service.service.js"
import { success, error } from "../../../utils/response.js";

export const index = async (req, res) => {
    try {
        const data = await ServiceService.index();
        return success(res, data, "Successfully retrieved all services");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

export const show = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        const data = await ServiceService.show({ id });
        return success(res, data, "Successfully retrieved service details");
    } catch (err) {
        return error(res, err.message, 404);
    }
};

export const store = async (req, res) => {
    try {
        const data = await ServiceService.store(req.body);
        return success(res, data, "service successfully created", 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

export const update = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        const data = await ServiceService.update({ id, ...req.body });
        return success(res, data, "service successfully updated");
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
        await ServiceService.destroy({ id });
        return success(res, null, "service successfully deleted");
    } catch (err) {
        if (err.message.includes("not found")) {
            return error(res, err.message, 404);
        }
        return error(res, err.message, 500);
    }
};

export const setStatus = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        const data = await ServiceService.setStatus({ id });
        return success(res, data, "service successfully updated");
    } catch (err) {
        if (err.message.includes("not found")) {
            return error(res, err.message, 404);
        }
        return error(res, err.message, 400);
    }
}