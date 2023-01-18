const express = require("express");
const { default: mongoose } = require("mongoose");

const router = express.Router();
const path = require("path");
const Enquiry = require("../model/enquiry/enquiry");
const Supplier = require("../model/enquiry/supplier");
const UserModel = require("../model/model");
const CustomerQueryByProduct = require("../model/products/CustomerQuery");

router.post(
  "/book-demo",

  async (req, res) => {
    const { isCompleted, isDeclined,
        merchant_Id,
        name,
        email,
        mobile,
        business_name,
        process,
        date,
        type } = req.body;

        if(!name ||!email||!mobile){
            res.json(
                {success:false,message:"name and mobile no is mandatory"}
            )
        }else{
            try {
                const product = await Enquiry.create({
                  merchant_Id: merchant_Id,
                  name: name,
                  email: email,
                  mobile: mobile,
                  business_name: business_name,
                  process: process,
                  date: date,
                  type: type,
                });
                const CountDocuments = product.CountDocuments;
          
                res.status(200).json({success:true,message:"created successfully",data:product,count:CountDocuments});
              } catch (err) {
                res.status(500).send({ message: err?.message });
              }

        }
  

    
  }
);

router.patch("/book-demo/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  const { isCompleted, isDeclined,merchant_Id,
    name,
    email,
    mobile,
    business_name,
    process,
    date,
    type } = req.body;
  try {
    const updateQuery = await CustomerQueryByProduct.findByIdAndUpdate(
      _id,
      {
        merchant_Id: merchant_Id,
        name: name,
        email: email,
        mobile: mobile,
        business_name: business_name,
        process: process,
        date: date,
        type: type,
        // isDeclined:isDeclined
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.json({
      message: "updated Successfull",
      success: true,
      data: updateQuery,
    });
  } catch (err) {
    res.json({
      message: err?.message,
    });
  }
});



router.get("/getDemo", async (req, res) => {
  try {
    const buyerQuery = await Enquiry.find().sort({
      createdAt: -1,
    });

    res.status(200).json(buyerQuery);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post(
    "/bulk-enquiry",
  
    async (req, res) => {
      const { isCompleted, isDeclined,
          merchant_Id,
          name,
          email,
          mobile,
          business_name,
          product_category,
          comment,
         
          date,
          type } = req.body;
          console.log("enquairy",product_category,comment)
  
          if(!name ||!email||!mobile){
              res.json(
                  {success:false,message:"name and mobile no is mandatory"}
              )
          }else{
              try {
                  const product = await Enquiry.create({
                    merchant_Id: merchant_Id,
                    name: name,
                    email: email,
                    mobile: mobile,
                    business_name: business_name,
                    product_category:product_category,
                    comment:comment,

                 
                    date: date,
                    type: type,
                  });
                  const CountDocuments = product.CountDocuments;
            
                  res.status(200).json({success:true,message:"created successfully",data:product,count:CountDocuments});
                } catch (err) {
                  res.status(500).send({ message: err?.message });
                }
  
          }
    
  
      
    }
  );



  router.post(
    "/suppliers",
  
    async (req, res) => {
      const { 
        
         
          mobile,
          
          
         
        
          type } = req.body;
          console.log("mobileNo",mobile)
      
  
          if(!mobile){
              res.json(
                  {success:false,message:"Please Enter Your Mobile Number"}
              )
          }else{
            const user= await UserModel.findOne({mobile_no:mobile})
            console.log("tsed bhaat",user)
            if(user){
              res.status(400).json({success:false,message:"Mobile no. already exist, please contact with Customer Care"})
            }else{
              try {
                const product = await Supplier.create({
                  
                 
                  mobile: mobile,
                
                 
  
               
                  
                  type: type,
                });
                const CountDocuments = product.CountDocuments;
          
                res.status(200).json({success:true,message:"created successfully",data:product,count:CountDocuments});
              } catch (err) {
                console.log("errorr",err)
                res.status(500).json({ message: err?.message });
              }

            }
            


          }
          
    
  
      
    }
  );

  router.patch(
    "/suppliers/:id",
  
    async (req, res) => {
      const {id}=req.params
      const { 
        
          name,
          email,
          mobile,
          business_name,
          
         
        
          type } = req.body;
          console.log("hello ttata",id)
         
  
          if(!email){
              res.json(
                  {success:false,message:"Please Enter Your mail id"}
              )
          }else{
            const user= await UserModel.findOne({email:email})
            if(user){
              res.status(400).json({success:false,message:"Already Exist"})
            }else{
              try {
                const product = await Supplier.findByIdAndUpdate(id,{
                  name: name,
                  email: email,
                 business_name: business_name,
                type: type,
                },{
                  new:true,
                  upsert:true
                });
                const CountDocuments = product.CountDocuments;
          
                res.status(200).json({success:true,message:"We have received your details successfully",data:product,count:CountDocuments});
              } catch (err) {
                res.status(500).send({ message: err?.message });
              }
            }
          


          }
          
    
  
      
    }
  );
  router.get("/getsuppliers",async(req,res)=>{
    try {
      const supplier = await Supplier.find({})

      res.status(200).json({success:true,data:supplier})
      
    } catch (error) {
      res.status(404).json({message:error.message})
      
    }
  })


module.exports = router;
