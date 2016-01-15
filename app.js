var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var request = require('request');
var nodemailer = require("nodemailer");
var directTransport = require('nodemailer-direct-transport');

/*var transport = nodemailer.createTransport(directTransport({
    name: '192.168.123.153' // should be the hostname machine IP address resolves to
}));
transport.sendMail({
	from: "foo@blurdybloop.com", // sender address
	to: "kostastsakas@gmail.com", // list of receivers
	subject: "Hey, what's up?", // Subject line
	text: "Hello world ✔", // plaintext body
	html: "<b>Hello world ✔</b>" // html body
}, console.error);*/

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
		var verified = JSON.parse(body);

		if (verified.success) {

		}

		res.json(verified);
	});
	// console.log(req.body);
});