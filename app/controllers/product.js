var express = require("express");
var productRouter= express.Router();
var mongoose = require("mongoose");
var productModel = mongoose.model('Product');
var userModel = mongoose.model('User');
var app = express();
var path = require("path");
var responseGenerator = require('./../../libs/responseGenerator');
var adminAuth = require("./../../middlewares/adminAuth");
var userAuth = require("./../../middlewares/userAuth");
var mycartp = [];

module.exports.controllerFunction = function(app) { 

	productRouter.get("/addProduct", function (req,res) {
		console.log("inside addProduct ");
		res.render('addProduct.html');	
	});

	

	productRouter.post('/addProduct',adminAuth.checkLogin,function(req,res){

        if(req.body.productName!=undefined && req.body.productType!=undefined && req.body.features!=undefined && req.body.price!=undefined){
           console.log("inside productCart")
            var newProduct = new productModel({
                productName            : req.body.productName,
                productType           : req.body.productType,
                features            : req.body.features,
                price               : req.body.price
                
            });// end new Product 

            newProduct.save(function(err){
                if(err){

                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                }

                else{

                    var myResponse = responseGenerator.generate(false,"successfully added products",200,newProduct);
                    console.log(myResponse);
                    req.session.admin = newProduct;
                    delete req.session.admin.password;
                    console.log("product details saved successfully in DB");
                    res.redirect('/product/alladminProducts');
                }
            });//end new product save
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

    });//end addProduct route

    // route to get all admin products

    productRouter.get('/alladminProducts',adminAuth.checkLogin,function(req,res){
            console.log("inside all products")
           productModel.find({},function(err,productList){
                if(err){
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                }
                else{
                    //var products = productList;
                    
                    //res.send(products);

                var myResponse = responseGenerator.generate(false, "here all the products ", 200, productList);
                //res.send(myResponse);
                res.writeHeader(200, {"Content-Type": "text/html"});
                res.write('<html><h2> List of all Products </h2><br></html>');
        productList.forEach( (product) => {
            // Write your HTML here
            res.write('<span>' + product.productName + '</span><br/>');
            res.write('<span>' + product.productType + '</span><br/>');
            res.write('<span>' + product.features + '</span><br/>');
            res.write('<span>' + product.price + '</span><br/>');
            res.write('<html><button type="submit">EDIT</button></html>');
            res.write('<html><button type="submit">Delete</button><br></html>');
            res.write('<html><a href="http://localhost:8000/admin/adminLogout">Logout</a></html>');

        });

        res.end();

                
                }
            })

    });// end alladminProducts

    // route to display all USER products

    productRouter.get('/allUserProducts',userAuth.checkLogin,function(req,res){
            console.log("inside all products")
           productModel.find({},function(err,productList){
                if(err){
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                }
                else{
                    var products = productList;
                    
                    //res.send(products);

                //var myResponse = responseGenerator.generate(false, "here all the products of electronics", 200, productList);
                //res.send(myResponse);
                res.writeHeader(200, {"Content-Type": "text/html"});
                res.write('<html><h2> List of Products </h2><br></html>');
            productList.forEach( (product) => {
            // Write your HTML here
            res.write('<span>' + product.productName + '</span><br/>');
            res.write('<span>' + product.productType + '</span><br/>');
            res.write('<span>' + product.features + '</span><br/>');
            res.write('<span>' + product.price + '</span><br/>');
            res.write('<html><button type="submit">ADD TO CART</button><br><br></html>');
            res.write('<html><button type="submit">Delete</button><br><br><br></html>');
            res.write('<html><a href="http://localhost:8000/users/userLogout">Logout</a></html>');
            

        });

        res.end();

                
                }
            })

    });// end allUserProducts


    //route to edit or update products.

    productRouter.put('/updateProduct/:id',adminAuth.checkLogin, function(req,res){
        var update = req.body;
        var id = req.params.id
        productModel.findOneAndUpdate({_id:id},update,function(err,updated){
            if(err){
                var myResponse= responseGenerator.generate(true, "some error occured"+err, 500, null);
                res.send(myResponse);
            }
            else{
                updated.save(function(err){
                    if(err){
                        var myResponse = responseGenerator.generate(true, " some error with update"+err , 500 ,null);
                        res.send(myResponse);
                    }
                    else{
                        var myResponse = responseGenerator.generate(false, "sucessfully updated", 200, updated);
                        res.send(myResponse);
                    }
            
                });
                
            }

        });// end findOneAndUpdate

    }); //end edit or update api


    // route to delete products with admin rights and admin login.

    productRouter.delete('/deleteProduct/:id',adminAuth.checkLogin, function(req,res){
        var id = req.params.id;
        productModel.findOneAndRemove({_id: id}, function(err, deleted){
            if(err){
                var myResponse = responseGenerator.generate(true, "some error"+err, 500 , null);
                res.send(myResponse);
            }
            else{
                
                var myResponse = responseGenerator.generate(false, " sucessfully removed the product"+id, 200, deleted);
                res.send(myResponse);
            }
        });
    });// end deleting a product by admiin


    // route to add products to cart by user.
  
    
    productRouter.post('/addtocart/:id',userAuth.checkLogin, function(req,res){
        productModel.findOne({_id: req.params.id}, function(err, mycart){
            
            
            if (err){
                var myResponse = responseGenerator.generate(true, err, 500 , null);
                res.send(myResponse);
            }
            else {
                mycart.save(function(err){
                    
                    if (err){
                        var myResponse = responseGenerator.generate(true, err, 500 , null);
                        res.send(myResponse);
                    }
                    else {
                        
                        var placeOrder = mycart;
                        var myResponse = responseGenerator.generate(false, " sucessfully saved the product details to DB ", 200 , mycart);
                        res.send(myResponse);
                        mycartp.push(mycart);
                        console.log(mycart);
                        console.log(placeOrder);

                        }
                });

            }

        });

    });// end add to cart
     
     // api for all cart items

    productRouter.get('/allCartItems',userAuth.checkLogin,function(req,res){

           res.send(mycartp);

    });// end alladminProducts

    // api to remove products from cart

    productRouter.delete('/delfromcart/:id',userAuth.checkLogin, function(req,res){
        productModel.findOne({_id: req.params.id}, function(err, mycart){
            if (err){
                var myResponse = responseGenerator.generate(true, err, 500 , null);
                res.send(myResponse);
            }
            else if(mycart == null){
                var myResponse = responseGenerator.generate(true,"there is no product with this id", 400, null);
            }
            else {
                mycart;
                var myResponse = responseGenerator.generate(false, " sucessfully deleted the product details ", 200 , mycart);
                res.send(myResponse);

            }   
        
        });// end save product

    });// end deletefromcart

 // place order which are added to cart.
    productRouter.get('/placeOrder',userAuth.checkLogin, function(req,res){
        console.log("order placed for the cart items sucessfylly");
        console.log(mycartp);
    })// end place order

app.use('/product', productRouter);
}