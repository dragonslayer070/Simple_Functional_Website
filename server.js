var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

app.listen(8080);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database');
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true }
});


var User = mongoose.model('User', userSchema);

//app.get('/api/login', function(req, res) {

//});

app.post('/api/login', function(req, res) {
	User.find({
		username: req.body.username,
		password: req.body.password
	}, function(err, foundUsers) {
		console.log(foundUsers.length);
		if(err) throw err;

		if(foundUsers.length == 0) {
			res.end('0');
		}
		else {
			res.end('1');
		}
	});
});	

app.post('/api/register', function(req, res) {
	var userName = req.body.username;
	var passWord = req.body.password;

	var newUser = new User({
		username : userName,
		password : passWord
	});
	newUser.save(function(err) {
		if(err) throw err;

		console.log('Registered');
	});
});

