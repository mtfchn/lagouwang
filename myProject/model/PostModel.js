var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Post = new Schema({
    postname     : String,
    companyname      : String,
    worktime      : String,
    worktype     : String,
    worksite      : String,
    price      : String,
    imgUrl      : String,
    flag      : { type: Number, default: 1 },
    date      : { type: Date, default: Date.now }
});

var PostModel = mongoose.model('post', Post);

module.exports = PostModel;