app.directive('dateInput', function() {
	return {
		restrict: 'E',
		scope: {
			date: '='
		},
		templateUrl: 'js/directives/templates/dateInput.html',
		link: function(scope) {
		}
	};
});