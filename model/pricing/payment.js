const mongoose= require("mongoose")
const Schema = mongoose.Schema()

const paymentSchema= new Schema({
    subscribed_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subscription",
        required:true
    },
    invoice_no:{
        type:String,
        required:false
    },

    start_date:{type:Date, required:false},
    end_date:{type:Date,required:false},


},{
    timestamps:true
})

const Payment = mongoose.model("Payment",paymentSchema)

module.exports=Payment