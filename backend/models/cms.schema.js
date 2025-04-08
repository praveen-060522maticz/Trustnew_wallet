const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cms = new Schema({
	question:{
		type:String
	},
	answer:{
		type:String,
		required:true,
	},
	icon:{
		type:String
	}
	// slug:{
	// 	type:String,
	// 	required:true,

},{timestamps:true});
module.exports = mongoose.model("Cms", cms, "Cms");