angular.module('templates', []);

var BoroniteApp = angular.module('BoroniteApp', ['ngRoute', 'templates']);


(function() {

	function MenuItem(name, path) {
		this.name = name;
		this.path = path;
	}

	var menuItems = [
		new MenuItem('Home', '/home'),
		new MenuItem('About', '/about'),
		new MenuItem('Applications', '/applications'),
		new MenuItem('Careers', '/careers'),
		new MenuItem('Contact Us', '/contact')
	];

	BoroniteApp.value('menuItems', menuItems);

	BoroniteApp.menuItems = menuItems;

}());

/**
 * Configure the Routes
 */
BoroniteApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	// var pages = ['home', 'about', 'contact'];

	var menuItems = BoroniteApp.menuItems;

	function addRoute(menuItem) {
		var path = menuItem.path;
		var name = path.substring(1);
		var url = 'partials' + path + '.html';
		$routeProvider.when(path, {
			templateUrl: 'partials' + path + '.html',
			controller: name + 'Ctrl'
		});
	}

	menuItems.forEach(addRoute);

	$routeProvider.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'RedirectController'
	});

	$locationProvider.hashPrefix('!');

	// $locationProvider.html5Mode(true);

}]);

BoroniteApp.controller('RedirectController', ['$location', function($location) {
	$location.path('/home');
}]);

BoroniteApp.controller('homeCtrl', [function() {

}]);

BoroniteApp.controller('aboutCtrl', [function() {

}]);

BoroniteApp.controller('menuController', ['$scope', 'menuItems', '$location', function($scope, menuItems, $location) {
	$scope.menuItems = menuItems;

	$scope.isSelected = function(menuItem) {
		return menuItem.path === $location.path();
	};

	$scope.click = function(menuItem) {
		$location.path(menuItem.path);
	};
}]);

BoroniteApp.controller('contactCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
	$scope.form = {
		recaptcha: false,
		success: false
	};

	function renderRecaptcha() {
		window.grecaptcha.render('myRecaptcha', {
			sitekey: '6LfwYhUTAAAAAOweuLNkjWY0Kzqbuqbuo9nkfqmt',
			callback: function(res) {
				console.log(res);
				$scope.form.recaptcha = res;
				console.log($scope.form);
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
			$scope.form.success = true;
		}, function error() {
			console.log('error');
		});
	};

}]);