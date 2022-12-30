const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PackageSchema = new Schema({
    name:{type:String,required:false},
    Services:{type:Array,required:false},
    
    price:{type:Number,required:false},
    benifits:{type:String,required:false},
    validity:{type:String,required:false},
    gst:{type:Number,required:false},
    
    Amount: {type:Number,required:false,default:0},
    type:{type:String,required:false},
},{
    timestamps:true
})

const Packages=mongoose.model("Package",PackageSchema)
module.exports =Packages