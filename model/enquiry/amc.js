const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AmcSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    company_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    amc_requirement: {
      type: String,
      required: false,
    },

    date: {
      type: String,
      required: false,
    },

    type: {
      type: String,
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

const AMC = mongoose.model("AMCRequirement", AmcSchema);

module.exports = AMC;
