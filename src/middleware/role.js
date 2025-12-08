import { error } from "../utils/response.js";

export const role = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, "Forbidden", 403);
    }
    next();
  };
};
