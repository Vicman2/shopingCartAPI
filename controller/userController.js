const JWT = require('jsonwebtoken');
const nodeMialer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const UserModel = require("../model/userModel")
const ProductModel = require("../model/productModel").model;


const transporter = nodeMialer.createTransport(sendGridTransport({
    auth: {
        api_key: "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"
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
                    html: "<h1> You have successfully signed In <h1>"
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
        console.log(err)
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

exports.searchProduct = async (req, res, next) => {
    try{
        const {productToSearch} = req.body
        const searchResult = await  ProductModel.searchProduct(productToSearch);
        if(!searchResult || searchResult.length < 1 ) return res.status(404).send({success: true, message: "No product found"})
        return res.status(404).send({success: true, products: searchResult});
    }catch(err){
        console.log(err);
    }
}