const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let dapps = new Schema({
	title:{
		type:String
	},
	description:{
		type:String,
		required:true,
	},
	appimage:{
		type:String,
		required:true,
	},
	url:{
		type:String,
		required:true,
	},
	categoryId: {
		type: Schema.Types.ObjectId,
		ref: 'dappcategory',
	},
	deleted:{
		type:Number,
		default: 1
	},	
	created_date:{
		type:Date,
		default: Date.now
	}
});

module.exports = mongoose.model('dapps',dapps,'dapps');