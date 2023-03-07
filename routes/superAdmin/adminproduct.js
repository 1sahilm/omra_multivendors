
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

module.exports = router;








