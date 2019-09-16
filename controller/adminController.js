const ProductModel = require("../model/productModel");
const UserModel = require("../model/userModel");

exports.addProduct = async (req, res, next) => {
    const {title, price, spec} = req.body;
    const product = new ProductModel({
        title: title,
        price: price,
        spec: spec
    })
    console.log(product)
    const validProd = await  product.addProduct()
    console.log(validProd)
    if(validProd == true){
        res.status(200).send({success: true, message: "Products added successfully"});
    }else{
        res.status(404).send({success: false, message: "Products already existed"});
    }
}

exports.makeAdmin = async (req, res, next) =>{
    try{
        const {email} = req.body
        const isDone = await UserModel.makeAdmin(email);
        if(isDone == false) return res.status(404).send({success: false, message: "Could not find the user with such email"})
        res.status(200).send({success: true, message: "User is now an Administrator"})
    }catch(err){
        console.log(err);
    }
} 