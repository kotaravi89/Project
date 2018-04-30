 var mongoose = require('mongoose');
var AdminModel = mongoose.model('Admin');


// app level middleware to set request user 

//to check if its a legitimate user of the system or not
exports.setLoggedInUser = function(req,res,next){
// its checking weatheer this session and session.user exist or not
	if(req.session && req.session.user){
		adminModel.findOne({'email':req.session.user.email},function(err,admin){
 
			if(admin){
				// setting anothr user
				//req.user = user;
				//delete req.user.password; 
				req.session.admin = admin;
				// deleting the password
				delete req.session.user.password;
				next()
			}
			else{
				// do nothing , because this is just to set the values
			}
		});
	}
	else{
		next();
	}


}//


exports.checkLogin = function(req,res,next){

	if(!req.session.admin){
		// if the user doesnt exist redirect to login page again
		res.redirect('/admin/adminLogin');
	}
	else{
		// if it exists then move forward
		next();
	}

}// end checkLogin