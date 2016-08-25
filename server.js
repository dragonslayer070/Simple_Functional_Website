var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var url = require('url');
var nev = require('email-verification')(mongoose);
var nodemailer = require('nodemailer');
var crypto = require('crypto');

// Temporary fix for self signed certificate error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Credentials
var database = {
	username: process.env.DATABASE_USERNAME,
	pass: process.env.DATABASE_PASSWORD
};

var email = {
	username: process.env.EMAIL_USERNAME,
	pass: process.env.EMAIL_PASSWORD,
	otherFormat: process.env.EMAIL_OTHER
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

var forgotPasswordSchema = new Schema({
	token: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	createdAt: { type: Date, required: true, default: Date.now, expires: '1d'}
});

var Forgot = mongoose.model('Forgot', forgotPasswordSchema);


var transporter = nodemailer.createTransport('smtps://' + email.otherFormat + ':' + email.pass + '@smtp.gmail.com');


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

app.post('/api/checkToken', function(req, res) {
	var userToken = req.body.token;
	var hosturl = req.protocol + '://' + req.get('host');
	//Check token 

	Forgot.find({
		token: userToken
	}, function(err, foundUsers) {
		if(err) throw err;
		
		if(foundUsers.length == 1) {
			var email = foundUsers[0].email;
			
			var query = {
				token: userToken
			};

			Forgot.remove(query, function(err) {
				if(err) throw err;

				res.end(email);
			});
		}
		else{
			res.end('0');
		}
	});
});

app.post('/api/confirmChange', function(req, res) {
	var userEmail = req.body.email;

	var mailOptions = {
  		from: '"Simple Website KY" <' + email.user + '>',
  		to: userEmail,
  		subject: 'Password reset confirmed',
  		html: '<p> You have successfully resetted your password </p>'
	};

	transporter.sendMail(mailOptions, function(err, info) {
  		if(err) throw err;

  		console.log('Message sent: ' + info.response);
  			res.end('1');
  		});
});

app.post('/api/forgot', function(req, res) {
	// Check if email exists
	var hosturl = req.protocol + '://' + req.get('host');
	var userEmail = req.body.email;

	User.find({
		email: userEmail
	}, function(err, foundUsers) {
		if(err) throw err;

		// Check if email is in Forgot database
		if(foundUsers.length != 0) {
			Forgot.find({
				email: userEmail
			}, function(err, foundForgotUser) {
				if(err) throw err;

				// Generate random token
				crypto.randomBytes(48, function(err, buffer) {
  					var token = buffer.toString('hex');
  					var resetURL = hosturl + '/#/reset/' + token;

  					if(foundForgotUser.length == 0) {
  						var forgotUser = new Forgot({
  							token: token,
  							email: userEmail,
  						});
  						// Save random token and email address in Forgot database
  						forgotUser.save(function(err) {
  							if(err) throw err;

  							console.log('Saved in Forgot database');
  						});
  					}
  					else {
  						// Save random token and email address in Forgot database
  						var query = {
  							email: userEmail
  						};

  						Forgot.findOne(query, function(err, doc) {
  							if(err) throw err;

  							else{
  								doc.token = token;
  								doc.save();
  							}
  						})
  					}
  					
  					var mailOptions = {
  						from: '"Simple Website KY" <' + email.user + '>',
  						to: userEmail,
  						subject: 'Password reset',
  						html: '<p> You have requested to reset your password </p>' + 
  							  '<p> If you did not request it, ignore this email, otherwise: </p>' + 
  							  '<p> Click on this <a href="' + resetURL + '">link</a> or browse to ' + resetURL + ' to reset your password </p>'
  					};
					// Send url to email of user
  					transporter.sendMail(mailOptions, function(err, info) {
  						if(err) throw err;

  						console.log('Message sent: ' + info.response);
  						res.end('1');
  					});
				});
			});
		}
		else {
			res.end('0');
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
	var query = "";

	if(changeCredentials.hasOwnProperty('username')) {
		query = {
			username : changeCredentials.username
		};
	}
	else{
		query = {
			email : changeCredentials.email
		};
	}
	console.log(query);
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



