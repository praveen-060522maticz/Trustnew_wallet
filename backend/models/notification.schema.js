const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let notification = new Schema({
    Evmwalletaddress: {
        type: String,
        default: ""

        // required: true,
    },
    Tronwalletaddress: {
        type: String,
        default: ""    
    },
    Btcwalletaddress: {
        type: String,
        default: ""    
    },
    
    devicetoken: {
        type: Array,
        default: [] 
    },
    notification: {
        type: Boolean,
        default: true
    },
    wallettype: {
        type: String,
        default:""
    }
});

module.exports = mongoose.model('notification', notification, 'notification');
