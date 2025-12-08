import * as AuthService from "./auth.service.js";
import { success, error } from "../../utils/response.js";

export const register = async (req, res) => {
  try {
    const data = await AuthService.registerUser(req.body);
    return success(res, data, "Register success");
  } catch (err) {
    return error(res, err.message, 400);
  }
};

export const login = async (req, res) => {
  try {
    const data = await AuthService.loginUser(req.body);
    return success(res, data, "Login success");
  } catch (err) {
    return error(res, err.message, 400);
  }
};
