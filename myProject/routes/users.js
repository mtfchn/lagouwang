var express = require('express');
var router = express.Router();
var UserModel = require('../model/UserModel')
var ProductModel = require('../model/ProductModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login',{username:''});
});

router.post('/regist', function(req, res, next) {
  UserModel.find({username:req.body.username},(err,docs)=>{
  	var result = {
  		code:1
  	}
  	if(err || docs.length > 0 ){
  		result.code = -110;
  		result.message = '用户名已存在';
  		res.send(JSON.stringify(result));
  		return;
  	}
  	var UM = new UserModel();
  	UM.username = req.body.username;
  	UM.password = req.body.password;
  	UM.eamil = req.body.email;
  	UM.save((err)=>{
  		if(err){
  			result.code = -111;
  			result.message = '注册失败';
  		}
  		res.send(JSON.stringify(result));
  	})
  })
});


router.post('/login', function(req, res, next) {
  console.log(req)
  UserModel.find({username:req.body.username,password:req.body.password},(err,docs)=>{
  	var result = {
  		code:1
  	}
  	if(err || docs.length == 0 ){
  		result.code = -112;
  		result.message = '登录失败';
  	}
  	req.session.username = req.body.username;
  	res.send(JSON.stringify(result));  	
  })
});

router.get('/logout', function(req, res, next) {
	req.session.username = null;
	res.render("login", {username: ""});
});


router.post('/createProduct', function(req, res, next) {
    console.log(req)
       var pm = new ProductModel();
       pm.ali_image = req.body.ali_image;
       pm.name = req.body.name;
       pm.highlights = req.body.highlights;
       pm.price = req.body.price;
       pm.save((err)=>{
         var result = {
           code:1
         }
         if(err){
           result.code = -122;
           result.message = '添加失败'
         }
         res.send(JSON.stringify(result))
       })
  })

  router.get('/getUser', function(req, res, next) {
    if(!req.session || !req.session.username) {
      // res.redirect("/");
      res.send({UserList:null})
      return;
    }
  });

  router.get('/getCart', function(req, res, next) {
    if(!req.session || !req.session.username) {
      // res.redirect("/");
      res.send({goodsList:null})
      return;
    }
    ProductModel.find({flag:1},(err,docs)=>{
      if(err){
        console.log(err)
      }
      res.send({goodsList: docs});
    })
  });

  router.post('/delProduct', function(req, res, next) {
    console.log(req.body.id)
  ProductModel.update({_id: req.body.id}, {flag: 0}, (err)=>{
    var result = {
      code:1
    }
    if(err) {
      console.log(err);
      result.code = -88;
      result.message = "删除失败";
    }
    res.send(JSON.stringify(result));
  })
});

module.exports = router;
