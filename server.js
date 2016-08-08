var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
app = express();

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.listen(8080);

app.post('/api/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	fs.writeFile(__dirname + "/login.json", username + ' ' + password, function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("SAVED!");
	});
});

