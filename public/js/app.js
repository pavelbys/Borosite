angular.module('templates', []);

var BoroniteApp = angular.module('BoroniteApp', ['ngRoute', 'templates']);


(function() {

	var defaultCtrl = 'defaultCtrl';


	function MenuItem(name, path, ctrlName) {
		this.name = name;
		this.path = path;
		this.ctrlName = ctrlName || defaultCtrl;
	}

	var menuItems = [
		new MenuItem('Home', '/home', 'homeCtrl'),
		new MenuItem('About', '/about'),
		new MenuItem('Industries', '/industries'),
		new MenuItem('Careers', '/careers'),
		new MenuItem('Contact Us', '/contact', 'contactCtrl')
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
			controller: menuItem.ctrlName
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

BoroniteApp.controller('defaultCtrl', [function() {

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

	$scope.form = {
		recaptcha: false
	};

	function renderRecaptcha() {
		window.grecaptcha.render('myRecaptcha', {
			sitekey: '6LfwYhUTAAAAAOweuLNkjWY0Kzqbuqbuo9nkfqmt',
			callback: function(res) {
				$scope.form.recaptcha = res;
				$scope.$digest(); // update form
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
		$http.post('/contact', $scope.form, {}).then(function success(response) {
			console.log(response.data);
			if (response.data.success) {
				console.log("success");
				$scope.form.success = true;
			}
		}, function error() {
			console.log('error');
		});
	};

}]);

BoroniteApp.controller('homeCtrl', [function() {

	var items = [];


	(function() {
		function shuffle(array) {
			var currentIndex = array.length,
				temporaryValue, randomIndex;

			// While there remain elements to shuffle...
			while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}

		var imageNames = 'img1 img2 img3 img4 img5 img6 home-logo img3 img4'.split(' '),
			imageSources = imageNames.map(function(name) {
				return 'images/' + name + '.png';
			});

		shuffle(imageSources);

		function addItem(img, src) {
			img.onload = function() {
				var item = {
					src: src,
					w: img.width,
					h: img.height,
					myImg: img
				};
				items.push(item);
			};

		}

		for (var i = 0; i < imageSources.length; i++) {
			var img = new Image();
			img.src = imageSources[i];
			img.index = i;
			addItem(img, imageSources[i]);
			// img.onload = addItem;
		}
	}());



	// var hexagonGrid = new HexagonGrid("HexCanvas", 40);
	// hexagonGrid.drawHexGrid(10, 20, -50, -50, false);
	var sin60 = Math.sqrt(3) / 2;

	function getHexSettings(width, height, radius) {
		var cX = width / 2,
			cY = height / 2;
		var avgRadius = radius * 1.5;
		var halfNumCols = Math.ceil(cX / avgRadius);
		if (halfNumCols % 2 !== 0) {
			halfNumCols++;
		}
		var numColumns = halfNumCols * 2 + 1;
		var totalWidth = (halfNumCols * avgRadius + radius) * 2;
		var vertRadius = sin60 * radius;
		var halfYRadii = cY / vertRadius - 1;
		var halfRows = Math.ceil(halfYRadii / 2);
		var numRows = halfRows * 2 + 1;
		return {
			columns: numColumns,
			rows: numRows,
			topLeft: {
				x: cX - totalWidth / 2,
				y: cY - numRows * vertRadius
			}
		};
	}
	var r = 10;
	var hexagonGrid = new HexagonGrid("HexCanvas", r);
	var canvas = document.getElementById("HexCanvas");
	canvas.width = window.innerWidth;
	var ctx = canvas.getContext("2d");
	var hexInt = setInterval(function() {
		var hexSettings = getHexSettings(canvas.width, canvas.height, r);
		if (r < 80) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			hexagonGrid.setRadius(r);
			hexagonGrid.drawHexGrid(hexSettings.rows, hexSettings.columns, hexSettings.topLeft.x, hexSettings.topLeft.y);
			r *= 1.015;
		} else {
			clearInterval(hexInt);
			var middleRow = Math.floor(hexSettings.rows / 2);

			for (var i = 0, len = items.length; i < len; i++) {
				if (i * 2 < (hexSettings.columns + 2)) {
					hexagonGrid.drawHexAtColRow(i * 2, middleRow, null, items[i].myImg);
				}
			}

			// for (var i = 0; i < hexSettings.columns; i += 2) {
			// 	hexagonGrid.drawHexAtColRow(i, middleRow, null, items[(i) / 2].myImg);
			// }
		}
	}, 17);



	function openPhotoSwipe(col, row) {
		var hexSettings = getHexSettings(canvas.width, canvas.height, r);

		var middleRow = Math.floor(hexSettings.rows / 2);

		if (row !== middleRow) {
			row = middleRow;
			// return;
		}
		if (col % 2 !== 0) {
			col = 2;
		}

		var pswpElement = document.querySelectorAll('.pswp')[0];
		// build items array

		// define options (if needed)
		var options = {
			// history & focus options are disabled on CodePen
			history: false,
			focus: true,
			showAnimationDuration: 0,
			hideAnimationDuration: 0
		};


		var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
		gallery.goTo(col / 2);


	}

	window.openPhotoSwipe = openPhotoSwipe;


	// openPhotoSwipe();
	// document.getElementById('btn').onclick = openPhotoSwipe;
}]);