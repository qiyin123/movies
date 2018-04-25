var mongoose = require('mongoose');
var bcrypt=require('bcrypt');
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:{
        unique:true,
        type:String
    },
    // 0: 普通用户
    // 1: 验证用户
    // 2: 高级用户
    role:{
        type:Number,
        default:0
    },
    //头像地址
    headportrait:String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function (next) {
    var user=this;

    if (this.isNew) {
        this.meta.createAt = this.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    //生成盐
    bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
        if (err) {
            return next(err);
        }
        //进行hash算法加密
        bcrypt.hash(user.password,salt,function (err,hash) {
            if (err) {
                return next(err);
            }
            user.password=hash;
            next();
        })
    })
    
});

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
};
UserSchema.methods={
    comparePassword:function (_password,cb) {
        bcrypt.compare(_password,this.password,function (err,isMatch) {
            if (err) {
                return cb(err)
            }
            cb(null,isMatch)
        })
    }
}
module.exports = UserSchema;
