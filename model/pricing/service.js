const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ServiceSchema = new Schema({
    name:{type:String,required:false},
    price:{type:String,required:false},
    benifits:{type:String,required:false},
    type:{type:String,required:false}

},{
    timestamps:true
})

const Services=mongoose.model("Service",ServiceSchema)
module.exports =Services