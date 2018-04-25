var _ = require('underscore');
var Index = require('../app/controller/index');
var Movie = require('../app/controller/movie');
var User=require('../app/controller/user');
var Comment = require('../app/controller/comment');
var Catetory = require('../app/controller/catetory');


module.exports=function (app) {
    app.use(function (req, res, next) {
        var _user = req.session.user;

        if (_user) {
            res.locals.user = _user;
            res.locals.root=app.locals.root;
        }
        return next();
    });
    
    //movie
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/movie', User.signinRequired, User.adminRequired,Movie.new);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired,Movie.update);
    app.post('/admin/movie/new', User.signinRequired, User.adminRequired,Movie.save);
    app.get('/admin/movielist', User.signinRequired, User.adminRequired,Movie.list);
    app.delete('/admin/movielist/:id', User.signinRequired, User.adminRequired,Movie.del);
    //user
    app.post('/user/signin',User.signin);
    app.post('/user/signup',User.signup);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/logout',User.logout);
    app.get('/admin/userlist', User.signinRequired,User.adminRequired,User.userlist);
    app.get('/admin/user/detail/:id', User.signinRequired, User.adminRequired, User.userupdate);
    app.post('/admin/user/update/new', User.signinRequired, User.adminRequired, User.save);
    app.post('/admin/user/update/uploadHeadPortrait', User.signinRequired, User.adminRequired, User.uploadHeadPortrait);
    //comment
    app.post('/user/comment', User.signinRequired, Comment.save);
    //catetory
    app.get('/admin/catetory/new', User.signinRequired, User.adminRequired, Catetory.new);
    app.post('/admin/catetory', User.signinRequired, User.adminRequired, Catetory.save);
    app.get('/admin/catetory/update/:id', User.signinRequired, User.adminRequired, Catetory.update);
    app.get('/admin/catetorylist', User.signinRequired, User.adminRequired, Catetory.list);
    //首页
    app.get('/', Index.index);
    app.get('/results', Index.search);
}

