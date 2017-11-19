var express = require('express');
var router = express.Router();
var PostModel = require('../model/PostModel');
var multiparty = require('multiparty');
var perPageDisplayCount = 5;

/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.session || !req.session.username) {
		res.redirect("/users/login");
		return;
	}
 	PostModel.find({flag:1},(err,docs)=>{
 		if(err){
 			console.log(err)
 		}
 		var totalPage = Math.ceil(docs.length / perPageDisplayCount);
		var pageNo = req.query.pageNo ? req.query.pageNo : 1;
		if(pageNo) {
			docs = docs.slice((pageNo -1)*perPageDisplayCount, (pageNo -1)*perPageDisplayCount+perPageDisplayCount);
		}
		res.render("post", {goodsList: docs, pageNo: pageNo, totalPage: totalPage, username: req.session.username});
 	})
});


router.post('/createPost', function(req, res, next) {
 	var form = new multiparty.Form({uploadDir:"./public/images"});
 	form.parse(req,function(err,fields,files){
 		if(err){
 			console.log(err);
 		}
 		console.log(fields);
 		console.log(files);
 		
   		var pm = new PostModel();
   		pm.imgUrl = files.imgUrl[0].path.replace('public','');
   		pm.postname = fields.postname[0];
   		pm.companyname = fields.companyname[0];
   		pm.worktime = fields.worktime[0];
   		pm.worktype = fields.worktype[0];
   		pm.worksite = fields.worksite[0];
   		pm.price = fields.price[0];
   		pm.save((err)=>{
   			var result = {
   				code:1
   			}
   			if(err){
   				result.code = -122;
   				result.message = '文件上傳失敗'
   			}
   			res.send(JSON.stringify(result))
   		})
 	})
});


router.post('/updatePost', function(req, res, next) {
	var result = {
   				code:1
   			}
 	var form = new multiparty.Form({uploadDir:"./public/images"});
 	form.parse(req,function(err,fields,files){
 		if(err){
 			console.log(err);
 		}
 		console.log(fields);
 		console.log(fields.post_id[0]);
 		PostModel.find({_id:fields.post_id[0]},(err,docs)=>{
 			if(!err || docs.length>0){
 				var pm = docs[0];
 				if(files.imgUrl && files.imgUrl.length>0){
 					pm.imgUrl = files.imgUrl[0].path.replace('public','');
 				}
 				pm.postname = fields.postname[0];
		   		pm.companyname = fields.companyname[0];
		   		pm.worktime = fields.worktime[0];
		   		pm.worktype = fields.worktype[0];
		   		pm.worksite = fields.worksite[0];
		   		pm.price = fields.price[0];
		   		pm.save((err)=>{		   			
		   			if(err){
		   				result.code = -122;
		   				result.message = '文件上傳失敗'
		   			}
		   			res.send(JSON.stringify(result))
		   		})
 			}else{
 				var pm = new PostModel();
		   		pm.imgUrl = files.imgUrl[0].path.replace('public','');
		   		pm.postname = fields.postname[0];
		   		pm.companyname = fields.companyname[0];
		   		pm.worktime = fields.worktime[0];
		   		pm.worktype = fields.worktype[0];
		   		pm.worksite = fields.worksite[0];
		   		pm.price = fields.price[0];
		   		pm.save((err)=>{
		   			
		   			if(err){
		   				result.code = -122;
		   				result.message = '文件上傳失敗'
		   			}
		   			res.send(JSON.stringify(result))
		   		})
 			}
 		})
 		
   		
 	})
});

router.post('/delPost', function(req, res, next) {
	PostModel.update({_id: req.body.id}, {flag: 0}, (err)=>{
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
