var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var request = require('request');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

// Run development server
// without optimizations on port 3000
var app = express();

// Use gzip
app.use(compression());
app.use(bodyParser.json());

var public_folder = (process.env.NODE_ENV == 'production') ? './dist' : './public';

app.use(express.static(public_folder));

var server = app.listen((process.env.PORT || 3000), function() {
	var port = server.address().port;

	console.log('Development app running on http://localhost:%s', port);
});

app.post('/contact', function(req, res) {
	request.post({
		url: "https://www.google.com/recaptcha/api/siteverify",
		form: {
			secret: "6LfwYhUTAAAAAFRKlJ3BjtEWSKF65Awn1budtTYk",
			response: req.body.recaptcha,
		}
	}, function(err, httpResponse, body) {
		var formData = req.body;
		var verified = JSON.parse(body);

		if (verified.success) {
			var transporter = nodemailer.createTransport(smtpTransport({
				service: 'Godaddy',
				auth: {
					user: process.env.EMAIL,
					pass: process.env.PASS
				}
			}));

			transporter.sendMail({
				from: formData.email, // sender address
				to: process.env.EMAIL, // list of receivers
				subject: "Boronite.com - " + formData.email, // Subject line
				text: "Name: " + formData.name +
				"\nCompany: " + formData.company +
				"\nEmail: " + formData.email +
				"\nPhone Number: " + formData.phoneNumber +
				"\n\n" + formData.message
			}, function(error, response) {
				if (error) {
					console.log(error);
				} else {
					console.log('Message sent');
				}
			});
		}

		res.json(verified);
	});
	// console.log(req.body);
});