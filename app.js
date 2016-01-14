var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');


// Run development server
// without optimizations on port 3000
var app = express();
var public_folder = (process.env.NODE_ENV == 'development') ? './public' : './dist';

app.use(express.static(public_folder));

var server = app.listen((process.env.PORT || 3000), function() {
	var port = server.address().port;

	console.log('Development app running on http://localhost:%s', port);
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