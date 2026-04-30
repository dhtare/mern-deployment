const mongoose = require("mongoose");

const crudSchema = new mongoose.Schema({
	fq1: {
		type: String,
		required: [true, "feed back answer one required"],		
	},
	fq2: {
		type: String,
		required: [true, "feed back answer two required"],		
	},
	fq3: {
		type: String,
		required: [false, "feed back answer three required"],		
	},
	location: {
		type: String,		
	},
	counter: {
		type: String,
	},
	unique_id:{
		type:String
	}
}, { timestamps: true });

module.exports = mongoose.model("Crud", crudSchema, "feedback");
