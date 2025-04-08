// import package
import mongoose from "mongoose";

// import lib

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TransactionSchema = new Schema({

User: {
    type: String,
    default: "string"
},
Transactionhash: {
    type: String,
    default: "string"
},
Quantity:{
    type: String,
    default: "string"
},
Date:{
    type: Date,
    default: Date.now(),
},

Walletaddress:{
    type: String,
    default: "string"
}
 
},{timestamps:true});




module.exports = mongoose.model("Transaction", TransactionSchema, "Transaction");
