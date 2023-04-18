const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddTemplate = new Schema(
  {
    template_name: {
      type: String,
      required: false,
    },
    template: {
      type: String,
      required: false,
    },
    dltTemplateId: {
      type: String,
      required: false,
    },
    telemarketerId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const templateModel = mongoose.model("Template", AddTemplate);
module.exports = templateModel;
