const JWT = require('jsonwebtoken');
const nodeMialer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const config = require("config");

const UserModel = require("../model/userModel")
const ProductModel = require("../model/productModel").model;


const transporter = nodeMialer.createTransport(sendGridTransport({
    auth: {
        api_key: config.get('sendGridApi')
    }
}))



exports.postSignIn = (req, res, next)=> {
    const {username, email, phone, password} = req.body;
    const user = new UserModel({
        username : username, 
        email: email,
        phone: phone, 
        password: password
    })
    
    user.signIn()
        .then(value => {
            if(value){
                return transporter.sendMail({
                    to: email, 
                    from: "ourExample.com", 
                    subject: "Sign up succeeded", 
                    html: `<h1> You have successfully signed In <h1>`
                })
            }else{
                return Promise.resolve(false)
            }
        })
        .then(value  =>{
            if(!value) return res.status(404).send({success : true, message: "User already exist"});
            return res.status(200).send({success : true, message: "User created successfully"})
        } )
        .catch(err => {
            console.log(err);
        })
}

exports.postLogIn = async (req, res, next) => {
    const {email, password} = req.body
    const user = await UserModel.login(email, password)
    if(user){
        const token = JWT.sign({email : user.email, isAdmin: user.isAdmin}, "Avic");
        res.status(200).send({success: true,token: token, message: "User logged in successfully"});
    }else{
        res.status(404).send({success: false, message: "Invalid email or password"});
    }
}
exports.postResetPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const isUser = await UserModel.getByEmail(email);    
        if(!isUser) return res.status(404).send({success: false, message: "This email do not exist in our database"});
        console.log(isUser)
        const tokenToBeSentToAsMail = JWT.sign({email:email, resetPassword: true}, 'Avic')
        const statusMessage = await  transporter.sendMail({
            to: email,
            from: "vicmanTheBest@whoever.com", 
            subject: "Reset password", 
            html: `<h2>Please click on the  <a href="http://localhost:7000/user/${tokenToBeSentToAsMail}">Link</a>  to direct you to password reset page</h2>`
        });
        console.log(statusMessage)
        console.log(tokenToBeSentToAsMail)
        if(statusMessage.message == 'success')   return res.status(200).send({success: true, message: "Email sent successfully"})
        return  res.status(404).send({success: false, message: "Redirct to the reset page"});
    } catch (err){
        console.log(err)
    }
}
exports.getResetPasswordFromEmail = async (req, res, next)=>{
    try{
        const {token} = req.params
        if(!token) return res.status(404).send("Unauthorized Access, no token provided");
        const valid = JWT.verify(token, 'Avic');
        if(valid) return res.status(200).json({success: true, message: "User have been verified"});
    }catch(err){
       if(err.message && err.message == 'invalid signature') res.status(403).json({success: false, message: "Unauthorized access, invalid token"})
    }
}
exports.putUpdatedPassword =async (req, res, next) => {
    try {
        const {password, confirmPassword} = req.body;
        if(password !== confirmPassword)return res.status(400).json({success: false, message: "Password have to match"})
        const {token} = req.headers;
        const verifiedToken = JWT.verify(token, 'Avic')
        const value =UserModel.updatePassword(verifiedToken.email, password)
        if(!value) return res.status(404).json({success: false, message: "User not found"})
        return res.status(200).json({success: false, message: "Password reset was a success"}); 
    } catch (error) {
        if(error.message == 'invalid signature')  return   res.status(402).json({success: false, message: "Unauthorized Access"})
    } 
}

exports.addToCart = async (req, res, next) => {
    try{
        const {title} = req.body;
        const {token} = req.headers;
        const verifiedToken = JWT.verify(token, 'Avic')
        const email = verifiedToken.email
        const messageObject  = await UserModel.addToCart(title, email);
        if(messageObject.message == 'Invalid Product!') return res.status(404).send({success: false, message: "Invalid products"});
        if(messageObject.message == 'Invalid User') return res.status(404).send({success: false, message: "Invalid User"});
        if(messageObject.message == 'Number of product have been incremented') {
            return res.status(200).send({success: true, message: "Quantity have been incremented by 1"});
        }
        if(messageObject.message == "Product have been added to Cart") return res.status(200).send({success: false, message: "Product added successfully"});
    }catch(err){
        console.log(err);
    }
}

exports.viewCart = async (req, res, next) => {
    const {token} = req.headers;
    const verifiedToken = JWT.verify(token, 'Avic');
    const email = verifiedToken.email;
    const cartItem =  await UserModel.getCart(email);
    if(cartItem == false) return res.status(404).send({success: false, message: "User do not exist"});
    if(cartItem.item == 0){
        res.status(404).send({success: true, message: "Empty cart"}); 
    }else{
        console.log("items -------------------------");
        console.log(cartItem);
        res.status(200).send({success: true, data: cartItem.item});
    }
}

exports.viewProducts = async (req, res, next)=>{
    try{
        const products = await UserModel.getProducts();
        if(products) return res.status(200).send({success: true, data : products})
        return res.status(404).send({success: false, message: "No product in the database"});
    }catch(err){
        console.log(err)
    }
}

exports.searchProduct = async (req, res, next) =>{
    try{
        const {productToSearch} = req.body
        const searchResult = await  ProductModel.searchProduct(productToSearch);
        if(!searchResult || searchResult.length < 1 ) return res.status(404).send({success: true, message: "No product found"})
        return res.status(404).send({success: true, products: searchResult});
    }catch(err){
        console.log(err);
    }
}