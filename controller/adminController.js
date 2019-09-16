const ProductModel = require("../model/productModel");
const UserModel = require("../model/userModel");

exports.addProduct = async (req, res, next) => {
    const {title, price, spec} = req.body;
    const product = new ProductModel({
        title: title,
        price: price,
        spec: spec
    })
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

exports.updateProduct = async (req, res, next) => {
    const deProduct = req.params.title
    try{
        const {title, price, spec} = req.body;
        const product = new ProductModel({
            title : title, 
            price: price, 
            spec: spec
        })

       const report =  await product.editProduct(deProduct);
       if(!report)  return res.status(404).send({success: false, message: "Product do not exist, please, create product"});
        return res.status(200).send({success: true, message: "Product updated successfully "});
    }catch(err){
        console.log(err);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const {title} = req.params;
    const isDone = await ProductModel.deleteProduct(title);
    if(!isDone)  return res.status(404).send({success: false, message:"The product do not exist in our database"});
    return  res.status(200).send({success: true, message: "Product deleted successfully"});
}

exports.getProduct = async (req, res, next)=>{
    try{
        const products = await UserModel.getProducts();
        if(products) return res.status(200).send({success: true, data : products})
        return res.status(404).send({success: false, message: "No product in the database"});
    }catch(err){
        console.log(err)
    }
}