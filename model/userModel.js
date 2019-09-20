const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const ProductModel = require("../model/productModel");



const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String, 
        required: true
    }, 
    email : {
        type: String, 
        required: true, 
        unique: true
    }, 
    phone: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    isAdmin: {
        type: Boolean, 
        required: false, 
        default: false
    },
    cart: {
        "item": [
            {
                productId:  { type: Schema.Types.ObjectId, ref: "Product", required: true},
                quantity: {type: Number, required: true}
            } 
        ]
    }
}, {timestamps: true});

userSchema.methods.signIn = async function(){
    const existingUser =await  this.model("User").findOne({email: this.email});
    if(!existingUser){
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword
        const savedDoc = this.save()
        return savedDoc;
    }else{
        return false
    }
}

userSchema.statics.login = async function(email, password){
    try{
        const user = await this.model("User").findOne({email: email});
        console.log(user)
        const validUser = await bcrypt.compare(password, user.password);
        if(validUser) return {email: user.email, isAdmin: user.isAdmin};
        return false;
    }catch(err){
        console.log("Error => ", err);
    }
}

userSchema.statics.makeAdmin = async function(email){
    try{
        const toMakeAdmin = await this.model("User").findOne({email: email});
        if(!toMakeAdmin) return false;
        toMakeAdmin.isAdmin = true;
        await toMakeAdmin.save();
        return true;
    }catch(err){
        console.log(err);
    }
}

userSchema.statics.addToCart = async function(title, email){
    try{
        const product = await ProductModel.findOne({title: title});
        if(!product)  return {message: 'Invalid Product!'}  
        const user = await this.model('User').findOne({email: email});
        if(!user) return {message : 'Invalid User'};
        const existingItemIndex = user.cart.item.findIndex(c1 => c1.productId.toString() == product._id.toString())
        if(existingItemIndex !== -1){
            user.cart.item[existingItemIndex].quantity++
            await user.save();
            return {message: "Number of product have been incremented"}
        }else{
            user.cart.item.push({productId: product._id, quantity: 1});
            await user.save()
            return {message: "Product have been added to Cart"};
        }
    }catch(err){
        console.log(err);
    }
}


userSchema.statics.getCart = async function(email){
    try{
        const userCart = await  this.model('User').findOne({email: email}).select("cart").populate("cart.item.productId", "title price spec -_id");
        if(!userCart) return false;
        return userCart.cart;
    }catch(err){
        console.log(err);
    }
}


userSchema.statics.getProducts = async function(){
    try{
        const products= await ProductModel.find().select("title price spec -_id");
        if(products) return products;
        return false
    }catch(err){
        console.log(err);
    }
}

userSchema.statics.getByEmail = async function(email){
    try {
        const isUser = await  this.model('User').findOne({email: email});
        if(isUser) return true 
        return false
    } catch (err) {
        console.log(err);
    }
}
userSchema.statics.updatePassword = async function(email, password){
    try{
        const isUser = await  this.model('User').findOne({email:email});
        if(!email) return false
        const hashedPassword = await bcrypt.hash(password, 12);
        isUser.password = hashedPassword;
        await isUser.save()
        return true
    }catch(err){
        console.log(err)
    }
}

module.exports = mongoose.model('User', userSchema);