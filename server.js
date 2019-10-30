var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb+srv://yanlingduan:duanyanling@cluster0-hv2lz.mongodb.net/test?retryWrites=true&w=majority', function(err) {
	if(err) {
		console.log("Faile with error :" + err);
	}
	else {
		console.log("Succeed!");
	}
});

/*
Middleware
*/

//morgan 
app.use(morgan('dev'));

/*
GET APIs
*/
app.get('/', function(req, res) {
	var name = "Yanling";
	res.json("my name is " + name);
})

app.listen(3000, function(err){
	if(err) throw err;
	console.log("Server is listening on port 3000");
})
