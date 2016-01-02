(function() {
  var handlers = {
    'dragstart': false,
    'dragend': false,
    'dragenter': false,
    'dragleave': false,
    'dragover': true,
    'drop': false
  };
  function makeDirective(name, preventDefault) {
    app.directive(name, ['$parse', function($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var fn = $parse(attr[name]);
          element.on(name, function(event) {
            if (preventDefault) {
              event.preventDefault();
            }
            scope.$apply(function() {
              fn(scope, {
                $event: event,
                $boundingRect: element[0].getBoundingClientRect()
              });
            });
          });
        }
      };
    }]);
  }

  for (var key in handlers) {
    if (handlers.hasOwnProperty(key)) {
      makeDirective(key, handlers[key]);
    }
  }
  
  app.directive('dragoverFix', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.on('dragover', function(event) {
          event.preventDefault();
        });
      }
    };
  });

})();

app.directive('bindEvents', function() {
  function bindListener(name, fn, arg, element, scope) {
    element.on(name, function(event) {
      scope.$apply(function() {
        fn(arg, event, element[0].getBoundingClientRect(), element);
      });
    });
  }
  return {
    restrict: 'A',
    scope: {
      data: '=bindEvents'
    },
    link: function(scope, element, attr) {
      for (var key in scope.data.functions) {
        if (scope.data.functions.hasOwnProperty(key)) {
          bindListener(key, scope.data.functions[key], scope.data.arg, element, scope);
        }
      }
    }
  };
});