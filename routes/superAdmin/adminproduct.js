
const express = require("express");
const { default: mongoose } = require("mongoose");
const UserModel = require("../../model/model");
const Product = require("../../model/products/product");
const router = express.Router();

router.get("/user-catalog/:_id",async(req,res)=>{
    const {_id} =req.params

   
    try {
       const user = await UserModel.find({_id})
       const data= await Product.find({auther_Id:_id})
       

        res.json({user:user,products:data})
        
    } catch (error) {
        
    }
})

router.patch("/approved_product/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;
    const date = new Date()

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post Available");

        const product = await Product.findOne({ _id },{
            isApproved : req.body.isApproved,
            approved_date:date


        });
        product.isApproved = req.body.isApproved;

        await product.save();

        res.status(200).send(product);
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});

//===================================  declined

router.patch("/declined_product/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post Available");

        const product = await Product.findOne({ _id });
        product.isDeclined = req.body.isDeclined;
        product.status = req.body.status;
        product.message = req.body.message;

        await product.save();
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});

module.exports = router;








