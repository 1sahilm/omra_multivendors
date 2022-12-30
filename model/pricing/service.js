const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ServiceSchema = new Schema({
    name: { type: String, required: false },
    mrp_id:{type: mongoose.Schema.Types.ObjectId,
        ref: "MRP_Rate",
        required:true
    },
    mrp: {
        type: Object,
        required: true
    },
    rate: {    type: mongoose.Schema.Types.String,
        ref: "MRP_Rate"},
    unit: {    type: mongoose.Schema.Types.String,
        ref: "MRP_Rate" },
    quantity: { type: String, required: false },
    price: { type: String, required: false },
    benifits: { type: String, required: false },
    type: { type: String, required: false }

}, {
    timestamps: true
})

const Services = mongoose.model("Service", ServiceSchema)
module.exports = Services