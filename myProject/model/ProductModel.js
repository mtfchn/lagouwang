var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Product = new Schema({
    ali_image     : String,
    name      	: String,
    highlights    : String,
    price     : String,
    flag      : { type: Number, default: 1 },
    date      : { type: Date, default: Date.now }
});

var ProductModel = mongoose.model('product', Product);

module.exports = ProductModel;