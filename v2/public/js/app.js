// Gulp uses this module to preload all templates
angular.module('templates', []);

var BoroniteApp = angular.module('BoroniteApp', ['ngRoute', 'templates']);

/*BoroniteApp.run(function ($templateCache){
	$templateCache.put('templates/header.html', 'testet');
});*/

/**
 * Configure the Routes
 */
BoroniteApp.config(['$routeProvider', function($routeProvider) {
	var pages = ['home', 'about', 'contact'];

	function addRoute(page) {
		var url = 'partials/' + page + '.html';
		console.log(url);
		$routeProvider.when('/' + page, {
			templateUrl: 'partials/' + page + '.html',
			controller: page + 'Ctrl'
		});
	}

	pages.forEach(addRoute);

	$routeProvider.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	});

}]);



BoroniteApp.controller('RedirectCtrl', function($location) {
	$location.path('/home');
});

BoroniteApp.controller('homeCtrl', [function() {

}]);

BoroniteApp.controller('aboutCtrl', [function() {

}]);



BoroniteApp.controller('contactCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
	console.log("contact Controller reporting for duty.");
	// $scope.form = {};

	// if (window.grecaptcha) {
	// 	console.log('yo');
	// 	window.grecaptcha.render('myRecaptcha', {
	// 		sitekey: '6LfM6xQTAAAAAJRd4Ne72ny29AwzWLe40JGqSdQ8',
	// 		callback: function(res) {
	// 			alert(res);
	// 		},
	// 		theme: 'dark'
	// 	});
	// } else {
	// window.recaptchaLoaded = function() {
	function renderRecaptcha() {
		window.grecaptcha.render('myRecaptcha', {
			sitekey: '6LfM6xQTAAAAAJRd4Ne72ny29AwzWLe40JGqSdQ8',
			callback: function(res) {
				alert(res);
			},
			theme: 'dark'
		});
	}

	if (window.grecaptcha) {
		renderRecaptcha();
	} else {
		window.recaptchaLoaded = renderRecaptcha;
	}



	$scope.submit = function() {
		console.log($scope.form);
		$http.post('/contact', $scope.form, {}).then(function success() {
			console.log('success');
		}, function error() {
			console.log('error');
		});

	};
}]);