const mongoose=require("mongoose")


const product_profileSchema= new mongoose.Schema({
    product_name:{type:String,required:false},
    description:{type:String,required:false},

    type:{type:String,required:false}
})

const ProductProfile=mongoose.model("ProductProfile",product_profileSchema)

module.exports=ProductProfile
