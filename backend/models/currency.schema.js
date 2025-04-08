const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let currency = new Schema({
  currencyName: {
    type: String,
    default: "",
  },
  currencySymbol: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "Crypto", // crypto,Token
  },
  tokenType: {
    type: String,
    default: "", // ERC20 BEB20 TRC20
  },
  minABI: {
    type: String,
    default: "",
  },
  contractAddress: {
    type: String,
    default: "",
  },
  decimals: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 1, // 0 - deactive, 1-active
  },
  currencyimage: {
    type: String,
  },

 
});

module.exports = mongoose.model("Currencies", currency, "Currencies");