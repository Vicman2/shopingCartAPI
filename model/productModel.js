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



module.exports = mongoose.model('Product', productSchema);