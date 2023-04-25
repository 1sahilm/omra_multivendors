const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddSenderId = new Schema(
  {
    sender_id: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    purpose: {
      type: String,
      required: false,
    },
    dlt_peid: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const senderModel = mongoose.model("Sender", AddSenderId);
module.exports = senderModel;
