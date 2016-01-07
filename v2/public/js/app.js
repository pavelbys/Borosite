var BoroniteApp = angular.module('BoroniteApp', ['ngRoute']);

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
			controller: 'PageCtrl'
		});
	}

	pages.forEach(addRoute);

	$routeProvider.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'RedirectCtrl'
	});

}]);



BoroniteApp.controller('RedirectCtrl', function($location) {
	$location.path('/home');
});

BoroniteApp.controller('PageCtrl', function($scope, $location) {
	console.log("Page Controller reporting for duty.");
});