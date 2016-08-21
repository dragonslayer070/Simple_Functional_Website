var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var url = require('url');
var nev = require('email-verification')(mongoose);

// Temporary fix for self signed certificate error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Credentials
var database = {
	username: process.env.DATABASE_USERNAME,
	pass: process.env.DATABASE_PASSWORD
};

var email = {
	username: process.env.EMAIL_USERNAME,
	pass: process.env.EMAIL_PASSWORD
}

// Connect to database
mongoose.connect('mongodb://'+database.username+':'+database.pass+'@ds042459.mlab.com:42459/simplewebsite');

// Specify where content is
app.use(express.static(__dirname + '/client'));

// Need this for input
app.use(bodyParser.json());

// Listen to port
var port = Number(process.env.PORT || 3000);
app.listen(port);

// Check database connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database');
});

// Database stuff
var Schema = mongoose.Schema;
var userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: 	  { type: String, required: true, unique: true }
});
var User = mongoose.model('User', userSchema);

// Handle login
app.post('/api/login', function(req, res) {
	User.find({
		username: req.body.username
	}, function(err, foundUsers) {
		if(err) throw err;

		if(foundUsers.length == 0) {
			res.end('0');
		}
		else {
			var hashedPassword = foundUsers[0].password;
			bcrypt.compare(req.body.password, hashedPassword, function(err, check) {
				if(err) throw err;

				if(check) {
					console.log('logged in');
					res.end('1');
				}
				else {
					res.end('0');
				}
			});
		}
	});
});	

// Verification handler
app.get(/verify/, function(req, res) {
	var hosturl = req.protocol + '://' + req.get('host');
	var fullUrl = req.originalUrl;
	fullUrl = fullUrl.replace('/verify/', '');
	console.log(fullUrl);
	nev.confirmTempUser(fullUrl, function(err, newUser) {
		if (err) throw err;

		else {
			newUser.save(function(err) {
				if(err) throw err;

				console.log('Registered');
				res.redirect(hosturl + '/#/success_verified');
			});
		}
	});
});

// Email configurations
var nevOptions = function(fullUrl) {
	nev.configure({
		verificationURL: fullUrl + '/verify/${URL}',
		persistentUserModel: User,
		tempUserCollection: 'tempusers',

		transportOptions: {
			service: 'Gmail',
			auth: {
				user: email.username,
				pass: email.pass
			}
		},
		verifyMailOptions: {
			from: 'Simple-Website-KY',
			subject: 'Please verify email',
			html: 'Click the following link to confirm your email: </p><p>${URL}</p>',
			text: 'Please confirm your email by clicking the following link: ${URL}'
		}
	}, function(err, options){
	});
};


nev.generateTempUserModel(User, function(err, tempUserModel) {
});


// Handle registering
app.post('/api/register', function(req, res) {
	var userName = req.body.username;
	var newEmail = req.body.email;
	var hosturl = req.protocol + '://' + req.get('host');

	nevOptions(hosturl);

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
					res.end('0.3');
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

				nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
					if(err) throw err;

					if(existingPersistentUser) {
						res.end('0.2');
					}

					if(newTempUser) {
						var URL = newTempUser[nev.options.URLFieldName];
						nev.sendVerificationEmail(newEmail, URL, function(err, info) {
							if(err) throw err;
							
							console.log('Sent email to new user');
						});
					}
					else{
						console.log('Some error related to user not being an existent Persistent User and also not a newTempUser');
					}
				});
			});
		});
	}
});

app.post('/api/changePassword', function(req, res) {
	var changeCredentials = req.body;
	
	var query = {
		username : changeCredentials.username
	};

	// hash password
	const saltRounds = 10;
	
	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(changeCredentials.newPass, salt, function(err, hash) {
			if(err) throw err;
			
			else {
				User.findOne(query, function(err, doc) {
					if(err) throw err;
					
					else {
						doc.password = hash;
						doc.save();
						res.end('1');
					}
				});
			}
		});
	});
});



