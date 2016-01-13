var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');


// Run development server
// without optimizations on port 3000
var dev_app = express();

dev_app.use(express.static('./public'));

var dev_server = dev_app.listen(3000, function() {
	var port = dev_server.address().port;

	console.log('Development app running on http://localhost:%s', port);
});


// Run production server
// optimized uses port 5000 locally (and the port given by heroku online)
var dist_app = express();

dist_app.use(compression());
dist_app.use(bodyParser.json());

dist_app.use(express.static('./dist'));

var dist_server = dist_app.listen((process.env.PORT || 5000), function() {
	var port = dist_server.address().port;

	console.log('Production app running on http://localhost:%s', port);
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