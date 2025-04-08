const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let pairs = new Schema({
    TokenA: {
        currencyName: {
            type: String,
            default: "",
        },
        currencySymbol: {
            type: String,
            default: "",
        },

        marketprice: {
            type: String,
            default: "",
        },

        withdrawFee: {
            type: Number,
            default: 0,
        },
        minimumWithdraw: {
            type: Number,
            default: 0,
        },

        fee: {
            type: Number,
            default: 0,
        },

        minimumDeposit: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            default: "Token", // crypto,Token
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
            default : ""
        },
        custom_token: {
            type: Number,
            default: 0,
        },
        block: { type: Number, default: 0 },
        currencyId: { type: Number },
        depositStatus: { type: Boolean, default: true },
        withdrawStatus: { type: Boolean, default: true },
        apiUrl: { type: String, default: "" },
        isPrimary: {
            type: Boolean,
            default: false,
        }
    },
    TokenB: {
        currencyName: {
            type: String,
            default: "",
        },
        currencySymbol: {
            type: String,
            default: "",
        },

        marketprice: {
            type: String,
            default: "",
        },

        withdrawFee: {
            type: Number,
            default: 0,
        },
        minimumWithdraw: {
            type: Number,
            default: 0,
        },

        fee: {
            type: Number,
            default: 0,
        },

        minimumDeposit: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            default: "Token", // crypto,Token
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
            default : "",
        },
        custom_token: {
            type: Number,
            default: 0,
        },
        block: { type: Number, default: 0 },
        currencyId: { type: Number },
        depositStatus: { type: Boolean, default: true },
        withdrawStatus: { type: Boolean, default: true },
        apiUrl: { type: String, default: "" },
        isPrimary: {
            type: Boolean,
            default: false,
        },
    }
});

module.exports = mongoose.model("pairs", pairs, "pairs");
