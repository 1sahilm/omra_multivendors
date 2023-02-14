const Subscription = require("../../../model/pricing/subscription");

const  getNextSequenceValue=async(sequenceName)=>{
    const sequenceDocument =await Subscription.findByIdAndUpdate({
       query:{_id: sequenceName },
       update: {$inc:{sequence_value:1}},
       new:true
    });
    return sequenceDocument.sequence_value;
 }

 module.exports = getNextSequenceValue