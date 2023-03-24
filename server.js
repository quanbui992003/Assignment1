const express = require('express')
const app = express()
const port = 3000;
var path = require('path')
var methods = require('method-override')
const userController = require('./controler/AdminController')

const bodyParser = require("body-parser");
//import {engine} from 'express-handlebars'
const engine = require('express-handlebars')

app.engine('.hbs', engine.engine({ extname: "hbs", defaultLayout: 'main' ,
helpers:{
  sum:(a,b)=>a+b,
}
}
));
app.set('view engine', '.hbs');
app.set('views', './views');
var mongoose = require('mongoose')

app.use(express.json())
app.use(methods("_method"))
// app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect('mongodb://127.0.0.1:27017/quanlyquanao')
  .then(function () {
    console.log("thanh cong")
  })
  .catch(function (err) {
    console.log("failed to connect")
  })

// app.get('/', (req, res) => {
//     res.render('dangnhap', {

//     });
// });


app.use("/user", userController)


app.listen(port, () => {
  console.log('Example ${port}')
})
