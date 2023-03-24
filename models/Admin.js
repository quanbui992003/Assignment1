var mongoose = require('mongoose')
const Schema = mongoose.Schema;

const students = new Schema({
    name: String,
    email: String,
    pass: String,
    img:String
  });
  const Image = mongoose.model('Image', students);

  // Thêm ảnh vào cơ sở dữ liệu
  const image = new Image({
    img: 'path/to/image.jpg'
  });
module.exports = mongoose.model("students", students)