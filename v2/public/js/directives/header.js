BoroniteApp.directive('brHeader', ['menuItems', '$location', function(menuItems, $location) {
	return {
		restrict: 'E',
		scope: {
			selectedMenuItem: '=selected'
		},
		templateUrl: 'js/directives/templates/header.html',
		link: function(scope) {
			console.log('hello from header');
			scope.menuItems = menuItems;

			scope.isSelected = function(menuItem) {
				return menuItem.path === $location.path();
			};

			scope.click = function(menuItem) {
				$location.path(menuItem.path);
			};

			// MenuItem.prototype.isSelected = function() {
			// 	return this.path === $location.path();
			// };
			// MenuItem.prototype.click = function() {
			// 	$location.path(this.path);
			// };

			// function MenuItem(name, url) {
			// 	this.name = name;
			// 	this.url = url;
			// }
			// MenuItem.prototype.isSelected = function() {
			// 	return this.url === $location.path();
			// };
			// MenuItem.prototype.click = function() {
			// 	$location.path(this.url);
			// };

			// scope.menuItems = [
			// 	new MenuItem('Home', '/home'),
			// 	new MenuItem('About', '/about'),
			// 	new MenuItem('Contact Us', '/contact')
			// ];

		}
	};
}]);