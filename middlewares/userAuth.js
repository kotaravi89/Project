 var mongoose = require('mongoose');
var userModel = mongoose.model('User');


// app level middleware to set request user 

//to check if its a legitimate user of the system or not
exports.setLoggedInUser = function(req,res,next){
// its checking weatheer this session and session.user exist or not
	if(req.session && req.session.user){
		userModel.findOne({'email':req.session.user.email},function(err,user){
 
			if(user){
				// setting anothr user
				//req.user = user;
				//delete req.user.password; 
				req.session.user = user;
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

	if(!req.session.user){
		// if the user doesnt exist redirect to login page again
		res.redirect('/users/userLogin');
	}
	else{
		// if it exists then move forward
		next();
	}

}// end checkLogin