BoroniteApp.directive('brHeader', ['$location', function($location) {
	return {
		restrict: 'E',
		scope: {
			selectedMenuItem: '=selected'
		},
		templateUrl: 'templates/header.html',
		link: function(scope) {
			console.log('hello from header');

			function MenuItem(name, url) {
				this.name = name;
				this.url = url;
			}
			MenuItem.prototype.isSelected = function() {
				return this.url === $location.path();
			};
			MenuItem.prototype.click = function() {
				$location.path(this.url);
			};

			scope.menuItems = [
				new MenuItem('Home', '/home'),
				new MenuItem('About', '/about'),
				new MenuItem('Contact Us', '/contact')
			];

		}
	};
}]);