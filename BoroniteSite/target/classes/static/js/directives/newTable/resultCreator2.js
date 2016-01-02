app.directive('resultCreator2', function () {
    "use strict";
    return {
        restrict: 'E',
        scope: true,
        templateUrl: "js/directives/newTable/templates/resultCreator2.html",
        link: function (scope) {
            scope.resultObjects = actionObjectList;
            scope.currentObject = null;
            scope.currentAttribute = null;
            
            
            scope.addResult = function ()   {
                var classNameList = scope.table.classes().map(function(cLass){return cLass.name;});
                if(classNameList.contains(scope.currentObject.name))   {
                    var thisClass = scope.table.classes()[classNameList.indexOf(scope.currentObject.name)];
                    var attributeNameList = thisClass.attributes.map(function(attribute){return attribute.name;});
                    if(!attributeNameList.contains(scope.currentAttribute.name)) {
                         thisClass.addAttribute(scope.currentAttribute.name);
                    }
                }
                else {
                     scope.table.addResultClass(scope.currentObject.name, [scope.currentAttribute.name]);
                }
                scope.table.fillWithDefault();
                scope.currentObject = null;
                scope.currentAttribute = null;
                scope.columnBool(false);
            };
        }
    };
}
);

