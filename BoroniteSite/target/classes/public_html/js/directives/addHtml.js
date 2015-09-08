app.directive('addHtml', function () {
    return {
        restrict: 'A',
        scope: {
            html: '=addHtml'
        },
        link: function (scope, element) {
            scope.$watch('html', function (newVal) {
                element[0].innerHTML = scope.html;
            });
        }
    };
});