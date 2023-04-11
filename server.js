const express = require('express')
const app = express()
const port = 9999;
var path = require('path')
var methods = require('method-override')
const userController = require('./controler/Admincontroller')
var config = require('./config/database');
const bodyParser = require("body-parser");
//import {engine} from 'express-handlebars'
const engine = require('express-handlebars')
// var passport = require('./config/Passport');
const passport = require('passport');
app.engine('.hbs', engine.engine({ extname: "hbs", defaultLayout: 'main' ,
helpers:{
  user:()=> res.locals.user,
    isAllow: () => res.locals.isAllow,
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

mongoose.connect(config.database, { 
  useNewUrlParser: true,
   useUnifiedTopology: true 
  })

app.use(passport.initialize());

app.use("/user", userController)


app.listen(port, () => {
  console.log('Example ${port}')
})
