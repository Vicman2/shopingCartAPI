const mongoose = require("mongoose");

const Schema = mongoose.Schema


const productSchema = new Schema({
    title: {
        type: String, 
        required: true
    }, 
    price: {
        type: Number,
        required: true,
    }, 
    spec: {
        type: String, 
        required: true
    }
})

productSchema.methods.addProduct = async function(){
    try{
        const existing = await this.model('Product').findOne({title: this.title})
        if(existing) return false
        await this.save();
        return true
    }catch(err){
        console.log(err);
    }
}

productSchema.methods.editProduct = async function(productTitle){
    try{
        const existing = await this.model('Product').findOne({title: productTitle});
        if(!existing) return false;
        existing.title = this.title;
        existing.price = this.price;
        existing.spec = this.spec;
        await existing.save();
        return true;
    }catch(err){
        console.log(err);
    }
}
productSchema.statics.deleteProduct = async function(productTitle){
    try{
        const existing = await this.model('Product').findOne({title: productTitle});
        if(!existing) return false;
        await this.deleteOne();
        return true;
    }catch(err){
        console.log(err);
    }
}


productSchema.statics.searchProduct = async function(productToSearch){
    const regex = new RegExp(".*" + productToSearch + ".*", "gi")
    try{
        const products = await this.model('Product').find({title: regex}).select("-_id");
        if(!products) return false;
        return products;
    }catch(err){
        console.log(err);
    }
}



module.exports = mongoose.model('Product', productSchema);