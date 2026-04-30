const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
	center: {
		type: String,		
	},
	service: {
		type: String,
	},
	unique_id:{
		type:String
	},
	unique_url :{
		type:String
	}
}, { timestamps: true });

module.exports = mongoose.model("urlData", urlSchema, "Url_Create");
