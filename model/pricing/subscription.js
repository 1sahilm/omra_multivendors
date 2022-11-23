const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubscriptionSchema = new Schema({
    auther_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    mobile_no: {
        type: mongoose.Schema.Types.String,
        ref: "User",
    },
    vendors_name: { type: mongoose.Schema.Types.String, ref: "User" },
    email: { type: mongoose.Schema.Types.String, ref: "User" },
    address: { type: mongoose.Schema.Types.String, ref: "User" },
    name:{type:String,required:false},
    plan:{type:mongoose.Schema.Types.Array,ref:"Services"},
    plan2:{type:mongoose.Schema.Types.Array,ref:"Packages"},
    payment_mode:{type:String,required:false},
    start_date:{type:Date, required:false},
    end_date:{type:Date,required:false},
    
    price:{type:Number,required:false},
    benifits:{type:String,required:false},
    validity:{type:String,required:false},
    gst:{type:Number,required:false},
    
    Amount: {type:Number,required:false,default:0},
    type:{type:String,required:false},
},{
    timestamps:true
})

const Subscription=mongoose.model("pricing/subscription",SubscriptionSchema)
module.exports =Subscription