const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComposeMsg = new Schema(
  {
    message_channel: {
      type: String,
      required: false,
    },
    message_route: {
      type: String,
      required: false,
    },
    sender_id: {
      type: String,
      required: false,
    },
    campaign_name: {
      type: String,
      required: false,
    },
    message_text: {
      type: String,
      required: false,
    },
    number: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const msgModel = mongoose.model("Compose", ComposeMsg);
module.exports = msgModel;
