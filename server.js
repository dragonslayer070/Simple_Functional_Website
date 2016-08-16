var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
	password: { type: String, required: true },
	email: 	  { type: String, required: true, unique: true }
});


var User = mongoose.model('User', userSchema);

app.post('/api/login', function(req, res) {
	User.find({
		username: req.body.username
	}, function(err, foundUsers) {
		console.log(foundUsers.length);
		if(err) throw err;

		if(foundUsers.length == 0) {
			res.end('0');
		}
		else {
			var hashedPassword = foundUsers[0].password;
			bcrypt.compare(req.body.password, hashedPassword, function(err, check) {
				if(err) throw err;

				if(check) {
					res.end('1');
				}
				else {
					res.end('0');
				}
			});
		}
	});
});	

app.post('/api/register', function(req, res) {
	var userName = req.body.username;
	var newEmail = req.body.email;

	User.find({
		username : userName
	}, function(err, foundUsers) {
		if(err) throw err;

		if(foundUsers.length == 0) {
			User.find({
				email : newEmail
			}, function(errEmail, foundEmails) {
				if(errEmail) throw errEmail;

				if(foundEmails.length == 0) {
					registerProcess();
				}
				else {
					res.end('0.1');
				}
			});		
		}
		else {
			res.end('0');
		}
	});


	var registerProcess = function() { 
		var passWord = req.body.password;

		const saltRounds = 10;

		bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(passWord, salt, function(err, hash) {
				if(err) throw err;

				var newUser = new User({
					username : userName,
					password : hash,
					email : newEmail
				});

				newUser.save(function(err) {
					if(err) throw err;

					console.log('Registered');
					res.end('1');
				});
			});
		});
	}
});

