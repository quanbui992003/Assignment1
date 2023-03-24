var mongoose = require('mongoose')
const Schema = mongoose.Schema;

const sanpham = new Schema({
    masp: String,
    tensp: String,
    dongiasp: String,
    imgsp:String,
    mausacsp: String,
    loaisanpham: String,
    makhachhang: String,
    tenkhachhang: String,
  });
module.exports = mongoose.model("sanpham", sanpham)