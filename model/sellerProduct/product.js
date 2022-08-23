const mongoose=require("mongoose")

const Schema=mongoose.Schema

const ProductSchema= new Schema({
    Vendor_Id:{type:String,required:false},
    vendors_name:{type:String,required:false},
    product_name:{type:String,required:false},
    product_image:{
        type:Array,required:false,

    },
    pic1:{
        type:String,required:false,

    },
    videos:{ type:String,required:false},
    category:{
        type:String,
        required:false
    },
    price:{
        type:Number,
        required:false
    },

    product_Specification:{
        type:String,
        required:false

    },

    type:{
        type:String,
        required:false


}

},
{
    timestamps:true
}

)

const ProductModel = mongoose.model("SellerProduct",ProductSchema)

module.exports = ProductModel