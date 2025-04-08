const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let dappcategory = new Schema({
	categoryName:{
		type:String,
		required : true
	},

	deleted:{
		type:Number,
		default: 1
	},	
	created_date:{
		type:Date,
		default: Date.now
	},
	
});

module.exports = mongoose.model('dappcategory',dappcategory,'dappcategory');
