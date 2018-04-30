

// defining a mongoose schema
// inculuding the module
var mongoose = require('mongoose');
//declare schema object.
var Schema = mongoose.Schema;
var userSchema = new Schema({

	productName : {type:String,default:'', required: true},
	productType: {type:String, default:''},
	features : {type:String, default:''},
	price	 : {type:Number, default:''}
	
});

mongoose.model('Product',userSchema);

