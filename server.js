var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsmate = require('ejs-mate');

var User = require('./models/user');

var app = express();

mongoose.connect('mongodb+srv://yanlingduan:duanyanling@cluster0-hv2lz.mongodb.net/test?retryWrites=true&w=majority', function(err) {
	if(err) {
		console.log("Faile with error :" + err);
	}
	else {
		console.log("Successfully connected to database");
	}
});

/*
---------------------Middleware---------------------
*/

//by setting static dir, we can find files under public folder
app.use(express.static('__dirname' + '/public'));
//morgan : log tool
app.use(morgan('dev'));
//body parser: parse content to diffenrent type 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ejs
why we use ejs? ejs can generate html with js, so we can reuse html module with ejs.
*/
app.engine('ejs', ejsmate);
//set ejs as view engine's value
app.set('view engine', 'ejs');


/*
---------------------API---------------------
*/

/*
GET APIs
*/
app.get('/', function(req, res) {
	res.render('main/home');
})

/*
POST APIs
*/
app.post('/create-user', function(req, res, next) {
	var user = new User();
	user.profile.name = req.body.name;
	user.password = req.body.password;
	user.email = req.body.email;

	user.save(function(err) {
		if(err) return next(err);
		res.json("Creation succeed");
	});
});

app.listen(3000, function(err){
	if(err) throw err;
	console.log("Server is listening on port 3000");
})
