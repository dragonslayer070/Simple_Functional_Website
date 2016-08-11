var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://070ky58:sarkisla58@ds042459.mlab.com:42459/simplewebsite');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

var port = Number(process.env.PORT || 3000);
app.listen(port);

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

