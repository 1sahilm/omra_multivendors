const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PriceRateSchema = new Schema({
    price:{type:String,required:false,unique:true},
    unit:{type:String,required:false,unique:true},
    type:{type:String,required:false}


},{
    timestamps:true
})

const MRP_Rate=mongoose.model("MRP_Rate",PriceRateSchema)
module.exports =MRP_Rate