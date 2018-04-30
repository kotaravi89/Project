
var express = require("express");
var adminRouter= express.Router();
var mongoose = require("mongoose");
var adminModel = mongoose.model('Admin');
var app = express();
var path = require("path");
var nodemailer = require('nodemailer');

var responseGenerator = require('./../../libs/responseGenerator');
//var auth = require("./../../middlewares/auth");


module.exports.controllerFunction = function(app) { 

  	adminRouter.get("/adminSignup", function (req,res) {
  		console.log("inside singup");
  		res.render('adminSignup.html');	
  	});

  	adminRouter.get("/adminLogin", function (req,res) {
  		console.log(" inside login");
  		res.render('adminLogin.html');
  	});

    adminRouter.get("/adminLogout", function(req,res){
      console.log("inside logout");
      res.render("adminLogin.html")
    });

    adminRouter.get("/allProducts", function(req,res){
    console.log("inside all admin products");
    res.render("http://localhost:8000/product/alladminProducts")
  })


	 adminRouter.post('/adminSignup',function(req,res){

        if(req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.email!=undefined && req.body.password!=undefined){
           console.log("inside signup post")
            var newAdmin = new adminModel({
                userName            : req.body.firstName+''+req.body.lastName,
                firstName           : req.body.firstName,
                lastName            : req.body.lastName,
                email               : req.body.email,
                mobileNumber        : req.body.mobileNumber,
                password            : req.body.password


            });// end new user 

            newAdmin.save(function(err){
                if(err){

                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);

                }

                else{

                   var myResponse = responseGenerator.generate(false,"successfully signup user",200,newAdmin);
                    console.log(myResponse);
                    req.session.admin = newAdmin;
                    delete req.session.admin.password;
                    res.redirect('/admin/adminLogin');
                }

            });//end new user save

        }
        else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            res.send(myResponse);

        }

    });//end adminSignup

	adminRouter.post('/adminLogin',function(req,res){

	        adminModel.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(err,foundAdmin){
	            if(err){
	                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
	                res.send(myResponse);
	            }
	            else if(foundAdmin==null || foundAdmin==undefined || foundAdmin.userName==undefined){

	                var myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
	                res.send(myResponse);
	                
	            }
	            else{

	                   req.session.admin = foundAdmin;
	                   delete req.session.admin.password;
	                   res.redirect('/product/addProduct');
	                   console.log("successfully logged into adminLogin");

	            }
	        });// end findOne

	    });// end adminLogin

      // Route for Admin forgetpassword.

adminRouter.post('/forgetPassword', function(req,res){
        adminModel.findOne({'email': req.body.email}, function(err,foundAdmin ){
            if(!foundUser){
                var myResponse = responseGenerator.generate(true,"please check your email id", 404 , null);
                res.send(myResponse);
            }
            else if (err) {
                var myResponse = responseGenerator.generate(true,"entered wrong email id", 404 , null);
                res.send(myResponse);
            }
            else{
               var transporter = nodemailer.createTransport({
                  service : "gmail",
                  //secure  : false,
                  //port    : 25,
                  auth: {
                    user: 'kota.raavi@gmail.com',
                    pass: 'nodejspassion'
                  }
                });
                var mailOptions = {
                  from: 'Ravi Kota <kota.raavi@gmail.com>',
                  to: foundAdmin.email,
                  subject: 'Sending Email using Node.js',
                  text: 'here is the required token by which you can reset your password and the same will be updated!'
                };
                transporter.sendMail(mailOptions, function(err, info){
                  if (err) {
                    console.log(err);
                    //var myResponse = responseGenerator.generate(true,"entered coming here wrong email id", 404 , null);
                    //res.send(myResponse);
                  } else {
                    console.log('Email sent: ' + info.response);
                    var myResponse = responseGenerator.generate(false,"check your modified inbox", 200 , info.response );
                    res.send(myResponse);
                  }
                });
                
            }
        });
    });// end forgetPassrword


app.use('/admin', adminRouter);
}