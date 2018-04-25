var Movie = require('../models/movie');
var Catetory = require('../models/catetory');


exports.index = function (req, res) {
	Catetory
		.find({})
		.populate({path:'movies',options:{limit:5}})		//limit 限制显示5条
		.exec(function (err, catetories) {
			if (err) {
				console.log(err);
			}

			res.render('index', {
				catetories: catetories
			})
		})
};
//search page
exports.search = function (req, res) {
	//类型查询
	var cat=req.query.cat;
	//搜索框搜索数据
	var q=req.query.q;
	var page = parseInt(req.query.p,10) || 0;
	//当前显示几条数据
	var count=2;
	var index=page*count;

	if (cat) {
		Catetory
			.find({ _id: cat })
			.populate({
				path: 'movies'
			})
			.exec(function (err, catetories) {
				if (err) {
					console.log(err);
				}
				var catetory = catetories[0] || {};
				var movies = catetory.movies;
				var results = movies.slice(index, index + count);

				res.render('results', {
					title: '结果列表页面',
					keywork: catetory.name,
					currentPage: page + 1,
					query: 'cat=' + cat,
					totalPage: Math.ceil(movies.length / count),
					movies: results
				})
			})
	}else{
		Movie
			.find({ title: RegExp(q + '.*', 'i') })	//直接用正则的字面量不行，如：/q/
			.exec(function (err, movies) {
				if (err) {
					console.log(err);
				}
				var results = movies.slice(index, index + count);

				res.render('results', {
					title: '结果列表页面',
					keywork: q,
					currentPage: page + 1,
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length / count),
					movies: results
				})
			});
	}
}
