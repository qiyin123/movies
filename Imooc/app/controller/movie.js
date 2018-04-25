var _ = require('underscore');
var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
var User = require('../models/user');
var Comment = require('../models/comment');

//detail page
exports.detail = function (req, res) {
	var id = req.params.id;

	Movie.findById(id, function (err, movie) {
		var _movie=movie;

		if (err) {
			console.log(err);
		}

		Comment
		.find({movie:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function (err,comments) {
			var _comments=comments;

			if (err) {
				console.log(err);
			}

			if (!_comments) {
				_comments=[];
			}

			res.render('detail', {
				title:  _movie.title,
				movie: _movie,
				comments: _comments
			})
		})
	})

};
//admin page
exports.new = function (req, res) {
	Catetory.find({}, function (err, catetories) {
		res.render('admin', {
			title: '后台录入页',
			catetories: catetories,
			movie: {
				title:'',
				doctor:'',
				country:'',
				language:'',
				poster:'',
				flash:'',
				year:'',
				summary:''
			}
		})
	})
};
//admin update movie
exports.update = function (req, res) {
	var id = req.params.id;
	if (id) {
		Catetory.find({},function (err,catetories) {
			Movie.findById(id, function (err, movie) {
				res.render('admin', {
					title: '后台更新页',
					movie: movie,
					catetories: catetories
				})
			})
			
		})
	}
};
//admin post movie
exports.save = function (req, res) {
	var id = req.body.movie.id;
	var movieObj = req.body.movie;
	var _movie;

	if (id) {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function (err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movie._id);
			})
		})
	} else {
		_movie = new Movie(movieObj);
		
		var catetoryId = movieObj.catetory;
		var catetoryName=movieObj.catetoryName;

		_movie.save(function (err, movie) {
			if (err) {
				console.log(err)
			}
			if (catetoryId) {
				Catetory.findById(catetoryId,function (err,catetory) {
					catetory.movies.push(movie._id);
					catetory.save(function (err,catetory) {
						res.redirect('/movie/' + movie._id);					
					})
				})
			}else if(catetoryName){
				//注意这里新增的catetory没有给录入的电影信息加入类别，movie.catetory为空，因为这里是手动
				//录入类别名称的
				var catetory=new Catetory({
					name:catetoryName,
					movies: [movie._id]
				})
				catetory.save(function (err, catetory) {
					//取出catetoryid
					movie.catetory=catetory._id;
					movie.save(function (err,movie) {
						res.redirect('/movie/' + movie._id);																
					});
				})
			}
		})
	}
};
//list page
exports.list = function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}

		res.render('list', {
			title: ' 列表页',
			movies: movies
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