import jwt from "jsonwebtoken";
import { error } from "../utils/response.js";

export const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return error(res, "Unauthorized", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, "Invalid token", 401);
  }
};
