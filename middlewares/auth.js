const JWT = require('jsonwebtoken');
const UserModel = require('../model/userModel')

exports.authentication = async (req, res, next)=> {
    try{
        const {token} = req.headers
        const valueOfToken =   JWT.verify(token, 'Avic')
        if(!valueOfToken) return res.status(404).send({success: false, message : "Invalid User"})
        const validUser = UserModel.find({email: valueOfToken.email})
        if(!validUser) return res.status(404).send({success: false, message : "Invalid User"})
        next();
    }catch(err){
        console.log("Error : "  ,err);
        if(err.message == 'invalid signature'){
             res.status(404).send({success: false, message : "Access Denied, verify Token"})
        }
    }
        
}


exports.authorization  = async (req, res, next) => {
    const {token} = req.headers;
    const valueOfToken =   JWT.verify(token, 'Avic')
    if(valueOfToken.isAdmin == true){
        next()
    }else{
        res.status(404).send({success: false, message: "Unauthorized User"});
    }
    
}