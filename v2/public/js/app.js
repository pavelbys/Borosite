if (!window.templates) {
	angular.module('templates', []);
}

var BoroniteApp = angular.module('BoroniteApp', ['ngRoute']);

// BoroniteApp.factory('menuItems', ['$location', function($location) {
// 	function MenuItem(name, path) {
// 		this.name = name;
// 		this.path = path;
// 	}

// 	MenuItem.prototype.isSelected = function() {
// 		return this.path === $location.path();
// 	};
// 	MenuItem.prototype.click = function() {
// 		$location.path(this.path);
// 	};

// 	var menuItems = [
// 		new MenuItem('Home', '/home'),
// 		new MenuItem('About', '/about'),
// 		new MenuItem('Contact Us', '/contact')
// 	];

// 	return menuItems;
// }]);

(function() {

	function MenuItem(name, path) {
		this.name = name;
		this.path = path;
	}

	var menuItems = [
		new MenuItem('Home', '/home'),
		new MenuItem('About', '/about'),
		new MenuItem('Contact Us', '/contact'),
		new MenuItem('Careers', '/careers')
	];

	BoroniteApp.value('menuItems', menuItems);

	BoroniteApp.menuItems = menuItems;

}());

/**
 * Configure the Routes
 */
BoroniteApp.config(['$routeProvider', function($routeProvider) {
	// var pages = ['home', 'about', 'contact'];

	var menuItems = BoroniteApp.menuItems;

	function addRoute(menuItem) {
		var path = menuItem.path;
		var name = path.substring(1);
		var url = 'partials' + path + '.html';
		console.log(url);
		$routeProvider.when(path, {
			templateUrl: 'partials' + path + '.html',
			controller: name + 'Ctrl'
		});
	}

	menuItems.forEach(addRoute);

	$routeProvider.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'homeCtrl'
	});

}]);



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