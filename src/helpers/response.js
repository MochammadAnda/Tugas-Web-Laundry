export const successResponse = (res, data = {}, message = "Success", code = 200) => {
  return res.status(code).json({
    status: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = "Error", code = 500, errors = []) => {
  return res.status(code).json({
    status: false,
    message,
    errors,
  });
};
