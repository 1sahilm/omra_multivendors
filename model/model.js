const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: false,
        unique: true,
    },
    mobile_no: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["SuperAdmin", "Admin", "User"],
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

    Merchant_Name: {
        type: String,
        required: false,
    },
    Merchant_Address: {
        type: String,
        required: false,
    },
    Merchant_ServiceArea_Pincodes: {
        type: Array,
        required: false,
    },

    TypesOf_Bussiness: {
        type: String,
        required: false,
    },
    SubTypeOf_bussiness: {
        type: String,
        required: false,
    },
    Merchant_Designation: {
        type: String,
        required: false,
    },

    Year_of_establishment: {
        type: String,
        required: false,
    },
    GST_No: {
        type: String,
        required: false,
    },

    PAN_No: {
        type: String,
        required: false,
    },

    company_Name: {
        type: String,
        required: false,
        // unique:false
    },
    description: {
        type: String,
        required: false,
        // unique:true
    },

    Category1: {
        type: String,
        required: false,
        // unique:true
    },
    Category2: {
        type: String,
        required: false,
        // unique:true
    },
    Category3: {
        type: String,
        required: false,
        // unique:true
    },
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;