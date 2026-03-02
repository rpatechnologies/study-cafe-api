const Joi = require('joi');

const createOrder = {
    body: Joi.object({
        type: Joi.string().valid('course', 'membership').required(),
        entityId: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().min(1)).required(),
        amount: Joi.number().positive().required(),
        currency: Joi.string().length(3).uppercase().default('INR'),
    }),
};

const verifyOrder = {
    body: Joi.object({
        orderId: Joi.string().required(),
        razorpay_order_id: Joi.string().allow('', null),
        razorpay_payment_id: Joi.string().required(),
        razorpay_signature: Joi.string().required(),
    }),
};

const invoiceParam = {
    params: Joi.object({
        orderId: Joi.string().required(),
    }),
};

module.exports = {
    createOrder,
    verifyOrder,
    invoiceParam,
};
