const Joi = require("joi");



exports.productValidation = (req, res, next) => {
    const schema = {
        title : Joi.string().min(3).required(), 
        price: Joi.number().min(1).required(), 
        spec: Joi.string().min(5).required()
    }
    const valid = Joi.validate(req.body, schema);
    if(valid.error)  return res.status(400).send({success: false, message: valid.error.message});
    next()
}

exports.userValidation = (req, res, next) => {
    const schema = {
        username: Joi.string().min(3).required(),
        phone: Joi.number().min(11).required(),
        email: Joi.string().min(7).max(70).required().email(), 
        password: Joi.string().min(5).required()
    }
    const valid = Joi.validate(req.body, schema)
    if(valid.error) return res.status(400).send({success: false, message: valid.error.message})
    next()
}

exports.validteEmailOnly = (req, res, next) => {
    const schema = {
        email : Joi.string().min(7).max(80).required().email()
    }
    const valid = Joi.validate(req.body, schema);
    if(valid.error) return res.status(400).send({success: false, message: valid.error.message});
    next()
}

exports.getResetPasswordFromEmail = (req, res, next) => {
    const schema = {
        string: Joi.string().required()
    }
    const valid = Joi.validate(req.params, schema);
    if(valid.error) return res.status(400).json({success: false, message: valid.error.message});
    next()
}
exports.validatePasswords = (req, res, next) => {
    const schema = {
        password: Joi.string().required().min(5),
        confirmPassword: Joi.string().required().min(5)
    }
    const isValid = Joi.validate(req.body, schema);
    if(isValid.error) return res.status(400).json({success: false, message: isValid.error.message});
    next();
}

