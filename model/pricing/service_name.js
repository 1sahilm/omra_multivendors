const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ServiceNameSchema = new Schema({
    name:{type:String,required:false},


},{
    timestamps:true
})

const Service_Name=mongoose.model("Service_name",ServiceNameSchema)
module.exports =Service_Name