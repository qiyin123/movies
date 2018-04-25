var express=require('express');
var path=require('path');
var mongoose=require('mongoose');
var port=process.env.port || 3000;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multipart = require('connect-multiparty');
var logger=require('morgan');
var fs=require('fs');
//用于会话持久化
var mongoStore = require('connect-mongo')(session);
var app=express();
var dbUrl = 'mongodb://localhost/qiyin';
var root = __dirname;

mongoose.connect(dbUrl)

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multipart());
app.use(cookieParser());
app.use(session({
    resave: false,//添加这行  
    saveUninitialized: true,//添加这行
    secret:'imooc',
    //配置会话持久化，信息保存到mongodb数据库中
    store:new mongoStore({
        url:dbUrl,
        collection:'sessions'
    })
}))
app.use(express.static(path.join(root,'public')));
//开发环境
if ('development'===app.get('env')) {
    var accessLogStream=fs.createWriteStream(root+'\\log\\access.log');
    app.set('showStackError',true)
    //将日志写入access.log文件里面
    app.use(logger(':method :url :status',{stream:accessLogStream}));
    app.locals.pretty=true //代码格式化
    mongoose.set('debug',true) //操作数据库信息
}
app.locals.moment=require('moment');
app.locals.root=__dirname;
require('./config/routes')(app);
app.listen(port);
console.log('imooc started on port '+port);



