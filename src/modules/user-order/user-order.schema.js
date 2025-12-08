import { body } from "express-validator";
const USER_ORDER_DELIVERY_METHOD = ['PICKUP_DROP', 'SELF_PICKUP'];

export const storeUpdateSchema = [
    body("service_id")
        .notEmpty()
        .isNumeric(),

    body("quantity_kg")
        .notEmpty()
        .isNumeric(),

    body("delivery_method")
        .notEmpty()
        .withMessage("Delivery method is required")
        .isIn(USER_ORDER_DELIVERY_METHOD)
        .withMessage(`Delivery method must be one of: ${USER_ORDER_DELIVERY_METHOD.join(', ')}`),

    body("address")
        .notEmpty()
        .isString(),

    body("user_package_id")
        .optional()
        .isNumeric()
        .withMessage("user_package_id must be numeric")

];