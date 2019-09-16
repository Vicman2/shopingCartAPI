const Joi = require("joi");



exports.productValidation = (req, res, next) => {
    const schema = {
        title : Joi.string().min(3).required(), 
        price: Joi.number().min(1).required(), 
        spec: Joi.string().min(5).required()
    }
    const valid = Joi.validate(req.body, schema);
    if(valid.error)  return res.send({success: false, message: valid.error.message});
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
    if(valid.error) return res.send({success: false, message: valid.error.message})
    next()
}