const mongoose = require("mongoose")
const schema = mongoose.Schema

const counterSchema = new schema({
    _id: { type: String, required: true },
    sequence_no: { type: Number, default: 0, }
}, {
    timestamps: true
})

const Counter = mongoose.model("Counter", counterSchema)

module.exports = Counter