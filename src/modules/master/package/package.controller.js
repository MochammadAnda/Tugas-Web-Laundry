import * as PackageService from "./package.service.js"
import { success, error } from "../../../utils/response.js";

export const index = async (req, res) => {
    try {
        const data = await PackageService.index();
        return success(res, data, "Successfully retrieved all package");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

export const show = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id);
        const data = await PackageService.show({ id });
        return success(res, data, "Successfully retrieved package details");
    } catch (err) {
        return error(res, err.message, 404);
    }
}; 

export const store = async (req, res) => {
    try {
        const data = await PackageService.store(req.body);
        return success(res, data, "Package successfully created", 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

export const update = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id);
        const data = await PackageService.update({ id, ...req.body });
        return success(res, data, "Package successfully updated");
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
        id = Number(id);
        await PackageService.destroy({ id });
        return success(res, null, "Package successfully deleted");
    } catch (err) {
        if (err.message.includes("not found")) {
            return error(res, err.message, 404);
        }
        return error(res, err.message, 500);
    }
};