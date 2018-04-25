var User = require('../models/user');
var _ = require('underscore');
var join=require('path').join;
var fs=require('fs');
var url=require('url');


//signup
exports.signup = function (req, res) {
	var _user = req.body.user;
	//req.params('user')

	User.findOne({ name: _user.name }, function (err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			var user = new User(_user);
			user.save(function (err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			})
		} else {
			//返回首页
			console.log('已注册用户')
			res.redirect('/signin')
		}
	})
};
//signin
exports.signin = function (req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({ name: name }, function (err, user) {
		if (err) {
			console.log(err);
		}

		if (!user) {
			return res.redirect('/signup');
		} else {
			user.comparePassword(password, function (err, isMatch) {
				if (err) {
					console.log(err)
				}
				if (isMatch) {
					req.session.user = user;
					return res.redirect('/');
				} else {
					return res.redirect('/signin');
					console.log('Password is not match');
				}
			})
		}


	})
};
//logout
exports.logout = function (req, res) {
	delete req.session.user;
	//不删除的话，这里的app.locals.user还会存在
	delete res.locals.user;

	res.redirect('/');
};
//user list page
exports.userlist = function (req, res) {
	User.fetch(function (err, users) {
		if (err) {
			console.log(err);
		}

		res.render('userlist', {
			title: '用户列表页',
			users: users
		})
	})
};
//signin
exports.showSignin = function (req, res) {
	res.render('signin', {
		title: '登录页面'
	})
};
//signup
exports.showSignup = function (req, res) {
	res.render('signup', {
		title: '注册页面'
	})
};

//midware
//验证是否为登录用户
exports.signinRequired=function (req,res,next) {
	var _user=req.session.user;

	if (!_user) {
		//这需要加 return ,否则会出现 Can't set headers after they are sent.错误
	 return	res.redirect('/signin');
	}
	next();
};
//验证是否admin用户
exports.adminRequired=function (req,res,next) {
	var _user=req.session.user;

	if (!_user.role || _user.role<=10) {
		//这需要加 return ,否则会出现 Can't set headers after they are sent.错误
	 return	res.redirect('/signin');
	}
	next();
};

//用户更新查询操作
exports.userupdate=function (req,res) {
	var id=req.params.id;
	User.findById(id,function (err,user) {
		if (err) {
			console.log(err);
		}
		var host = req.headers.host;
		if (user.headportrait) {
			var pathUrl='http://'+host;
			user.headportrait = pathUrl +'/headportraits/'+ user.headportrait;
		}
		
		res.render('userupdate',{
			user:user
		})
	})
};
//用户更新操作
exports.save=function (req,res) {
	//提交过来的用户信息
	var userObj=req.body.user;
	var _user;

	User.findById(userObj.id,function (err,user) {
		console.log(user);
		if(err){
			console.log(err);
		}

		_user=_.extend(user,userObj);
		_user.save(function (err,user) {
			if(err){
				console.log(err);
			}
			
			res.redirect('/admin/userlist')
		})

	})

};
//上传头像
exports.uploadHeadPortrait=function (req,res) {
	console.log(req);
	var id=req.body.userId;
	var img=req.files.user.headportrait;
	var imgArr = img.path.split('\\');
	var imgName=imgArr[imgArr.length-1];
	//保存的图片地址
	var path = join(res.locals.root +'\\public\\headportraits\\', imgName);
	var _user;
	var userObj={};
	console.log(path);

	userObj.headportrait = imgName;
	var rStream = fs.createReadStream(img.path);
	var wStream=fs.createWriteStream(path);
	rStream.pipe(wStream);
	rStream.on('error',function () {
		//处理错误的逻辑
	})

		User.findById(id, function (err, user) {
			if (err) {
				console.log(err);
			}

			_user = _.extend(user, userObj);
			_user.save(function (err, user) {
				if (err) {
					console.log(err);
				}
				return res.json({"state":"1"});
			})

		})
	
}