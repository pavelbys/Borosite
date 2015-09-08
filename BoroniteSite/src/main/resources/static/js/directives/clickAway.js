app.directive("clickAway", ["$timeout", "$parse", function($timeout, $parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			var fn = $parse(attr["clickAway"]);
			scope.$on('click', function(event, args) {
				if (!isWithin(args.clickEvent.originalEvent, element[0].getBoundingClientRect())) {
					fn(scope, {
						$event: event
					});
				}
			});
		}
	}
}]);