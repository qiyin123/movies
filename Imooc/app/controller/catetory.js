var _ = require('underscore');
var Movie = require('../models/movie');
var Catetory = require('../models/catetory');


//admin page
exports.new = function (req, res) {
	res.render('catetoryadmin', {
		title: '后台分类录入页',
		catetory:{
			name:''
		}
	})
};
//admin update catetory
exports.update = function (req, res) {
	var id = req.params.id;
	if (id) {
		Catetory.findById(id, function (err, catetory) {
			res.render('catetoryadmin', {
				title: '后台分类更新页',
				catetory: catetory
			})
		})
	}
};
//admin post movie
exports.save = function (req, res) {
	var catetoryObj = req.body.catetory;
	var catetory = new Catetory(catetoryObj);

	catetory.save(function (err, cat) {
			if (err) {
				console.log(err)
			}
			res.redirect('/admin/catetorylist');
		})
	
};
//list page
exports.list = function (req, res) {
	Catetory.fetch(function (err, catetories) {
		if (err) {
			console.log(err);
		}

		res.render('catetorylist', {
			title: '列表页',
			catetories: catetories
		})
	})
};
//list delete movie
exports.del = function (req, res) {
	//var id=req.query.id; //当url中的地址是?id=XXX时，用req.query.id获取id值
	var id = req.params.id;//当app.js是用:id来接收参数，url地址的传参方式是/XXX时，用req.params.id获取id值

	if (id) {
		Movie.remove({ _id: id }, function (err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({ success: 1 });
			}
		})
	}
};