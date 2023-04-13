const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(30).required(),
    email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
    password: Joi.string().min(6).max(30).required(), email: Joi.string().email().required(),
});

exports.validateRegisterInput = (body) => {
    const result = registerSchema.validate(body);
    if (result.error) {
        return { error: result.error.details[0].message, valid: false };
    }
    return { valid: true };
}

exports.validateLoginInput = (body) => {
    const result = loginSchema.validate(body);
    if (result.error) {
        return { error: result.error.details[0].message, valid: false };
    }
    return { valid: true };
};
