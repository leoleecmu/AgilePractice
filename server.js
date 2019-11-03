var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsmate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');


var User = require('./models/user');
var secret = require('./config/secret');

var app = express();

mongoose.connect(secret.database, function(err) {
	if(err) {
		console.log("Faile with error :" + err);
	}
	else {
		console.log("Successfully connected to database");
	}
});

//---------------------Middleware---------------------
//by setting static dir, we can find files under public folder
app.use(express.static('__dirname' + '/public'));
//morgan : log tool
app.use(morgan('dev'));
//body parser: parse content to diffenrent type 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey
}));
app.use(flash());
//ejs. why we use ejs? ejs can generate html with js, so we can reuse html module with ejs.
app.engine('ejs', ejsmate);
//set ejs as view engine's value
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);

app.listen(secret.port, function(err){
	if(err) throw err;
	console.log("Server is listening on port " + secret.port);
})
