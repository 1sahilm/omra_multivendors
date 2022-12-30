const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubscriptionSchema = new Schema({
    auther_Id:{type:String,required:false},
    mobile_no:{type:String,required:false},
    vendors_name:{type:String,required:false},
    email: {type:String,required:false},
    GST_No:{type:String,required:false},
    address: {type:String,required:false},
    name:{type:String,required:false},
    plan:{type:Array,required:false},
    plan2:{type:String,required:false},
    payment_mode:{type:String,required:false},
    start_date:{type:Date, required:false},
    end_date:{type:Date,required:false},
    price:{type:Number,required:false},
    benifits:{type:String,required:false},
    validity:{type:String,required:false},
    gst:{type:String,required:false},
    image: { type: Array, required: false },
    Amount: {type:Number,required:false,default:0},
    payment_status:{type:Boolean,required:false,default:false},
    payment_link:{type:String,required:false},
    type:{type:String,required:false},
},{
    timestamps:true
})

const Subscription=mongoose.model("subscription",SubscriptionSchema)
module.exports =Subscription