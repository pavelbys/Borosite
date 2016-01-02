app.directive('popUp', function () {
    'use strict';
    return {
        restrict: 'EA',
        scope:  {
            width: '=popUp'
        },
        link: function (scope, element) {
            var background = element[0];
            var content = background.children[0];

            var backgroundStyle = {
                position: 'fixed',
                top: '0px',
                left: '0px',
                margin: '0px',
                padding: '0px',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            };

            var contentStyle = {
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '5px'
            };

            var key;

            for (key in backgroundStyle) {
                if (backgroundStyle.hasOwnProperty(key)) {
                    background.style[key] = backgroundStyle[key];
                }
            }
            element.ready(function () {
                for (key in contentStyle) {
                    if (contentStyle.hasOwnProperty(key)) {
                        content.style[key] = contentStyle[key];
                    }
                }
            });
        }
    };
});