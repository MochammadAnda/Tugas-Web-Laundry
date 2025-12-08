import { validationResult } from "express-validator";
import { error } from "../utils/response.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    await Promise.all(schema.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return error(res, errors.array()[0].msg, 422);
    }

    next();
  };
};
