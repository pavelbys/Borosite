app.directive('conditionInput', function() {
	return {
		restrict: 'E',
		scope: {
			node: '='
		},
		templateUrl: 'js/directives/templates/conditionInput.html',
		link: function(scope) {
		}
	};
});