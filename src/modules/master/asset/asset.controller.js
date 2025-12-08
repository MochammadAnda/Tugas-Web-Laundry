import * as AssetService from "./asset.service.js"
import { success, error } from "../../../utils/response.js";

export const index = async (req, res) => {
    try {
        const data = await AssetService.index();
        return success(res, data, "Successfully retrieved all assets");
    } catch (err) {
        return error(res, err.message, 500);
    }
};

export const show = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id);
        const data = await AssetService.show({ id });
        return success(res, data, "Successfully retrieved asset details");
    } catch (err) {
        return error(res, err.message, 404);
    }
};

export const store = async (req, res) => {
    try {
        const data = await AssetService.store(req.body);
        return success(res, data, "Asset successfully created", 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

export const update = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id)
        const data = await AssetService.update({ id, ...req.body });
        return success(res, data, "Asset successfully updated");
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
        await AssetService.destroy({ id });
        return success(res, null, "Asset successfully deleted");
    } catch (err) {
        if (err.message.includes("not found")) {
            return error(res, err.message, 404);
        }
        return error(res, err.message, 500);
    }
};