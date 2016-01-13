var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

/*var app = express();

app.use(express.static('./public'));

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});*/

var dist_app = express();

dist_app.use(compression());
dist_app.use(bodyParser.json());

dist_app.use(express.static('./dist'));

var server = dist_app.listen((process.env.PORT || 5000), function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});


/*app.post('/contact', function(request, response) {
	console.log(request.body);
});*/


/* PLEASE DO NOT COPY AND PASTE THIS CODE. */
// (function() {
// 	if (!window['___grecaptcha_cfg']) {
// 		window['___grecaptcha_cfg'] = {};
// 	};
// 	if (!window['___grecaptcha_cfg']['render']) {
// 		window['___grecaptcha_cfg']['render'] = 'onload';
// 	};
// 	window['__google_recaptcha_client'] = true;
// 	var po = document.createElement('script');
// 	po.type = 'text/javascript';
// 	po.async = true;
// 	po.src = 'https://www.gstatic.com/recaptcha/api2/r20160105165243/recaptcha__en.js';
// 	var s = document.getElementsByTagName('script')[0];
// 	s.parentNode.insertBefore(po, s);
// })();