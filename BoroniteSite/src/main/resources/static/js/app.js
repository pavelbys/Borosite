var app = angular.module('webTestApp', ['RecursionHelper']);
//var app = angular.module('RAEApp', ['RecursionHelper']);
// var app = angular.module('demo', ['ngSanitize', 'ui.select']);


app.controller('webTestController', function($scope) {
    $scope.testTable = new DecisionTable('Test Table')
        .addConditionClass('person', 'age height'.split(' '))
        .addConditionClass('color', 'red green blue alpha'.split(' '))
        .addResultClass('holiday', 'hours rate'.split(' '))
        .addResultClass('sick leave', 'hours rate'.split(' '))
        .addResultClass('', 'prim1 prim2'.split(' '))
        .addRule('R1', '17 6 123 123 123 0.5 40 20 40 20 true false'.split(' '))
        .addRule('R2', '32 6 123 123 123 0.5 40 20 40 20 2.3 str'.split(' ')).copy();

    $scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    $scope.multipleDemo = {};
    $scope.multipleDemo.colors = ['Blue', 'Red'];


    // $scope.root = new Node(branchOptions[0])
    //     .addChildNode(new Node(branchOptions[1])
    //         .addLeaf(conditionOptions[4])
    //         .addLeaf(conditionOptions[3]))
    //     .addChildNode(new Node(branchOptions[1])
    //         .addLeaf(conditionOptions[4])
    //         .addLeaf(conditionOptions[3]));

    function InputOutput(input, output) {
        this.input = input;
        this.output = output;
    }

    $scope.root = new Node(new InputOutput(branchOptions[0], ''))
        .addChildNode(new Node(new InputOutput(branchOptions[1], ''))
            .addLeaf(new InputOutput('', ''))
            .addLeaf(new InputOutput('', '')))
        .addChildNode(new Node(new InputOutput(branchOptions[1], ''))
            .addLeaf(new InputOutput('', ''))
            .addLeaf(new InputOutput('', '')));


    console.log($scope.testTable);
    var jsonTable = JSON.parse(JSON.stringify($scope.testTable));
    console.log(DecisionTable.prototype.copy.call(jsonTable));

});

app.directive('focusMe', function($timeout) {
    return {
        scope: {
            trigger: '@focusMe'
        },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if (value === "true") {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
});