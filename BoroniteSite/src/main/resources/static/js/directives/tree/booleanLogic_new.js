(function makeBooleanLogicDirectives() {
    function addColorToExpression(input, vars) {
        var expressionArr = input.split(' ').map(function (elt) {
            var color = 'black';
            if (elt in vars) {
                color = 'blue';
            }
            if (jsepEval.isOp(elt)) {
                color = 'rgba(0,255,0,1)';
            }

            return {
                color: color,
                text: elt
            };
        });

        var html = '';
        expressionArr.forEach(function (elt) {
            html = html + '<span style="color: ' + elt.color + '">' + elt.text + ' </span>';
        });

        return html;
    }

    app.directive('booleanLogicTree', function () {
        return {
            restrict: 'E',
            scope: {
                root: '='
            },
            templateUrl: 'js/directives/tree/blTree.html',
            link: function (scope, element) {
                console.log(scope.root);
                scope.makeExpression = function (node) {
                    //todo collapse wherever possible
                    if (node.isLeaf() && !node.isRoot()) {
                        return node.value.input || 'null';
                    }
                    var arr = node.children.map(function (n) {
                        return scope.makeExpression(n);
                    });
                    return node.value.input.makeString(arr);
                };

                scope.vars = [];
                scope.vars.push(new Variable('age', '24'));

                scope.varsObj = {};

                scope.varsString = function () {
                    var string = '';
                    for (var key in scope.varsObj) {
                        if (scope.varsObj.hasOwnProperty(key)) {
                            string = string + ', ' + key + ' = ' + scope.varsObj[key];
                        }
                    }
                    return string.substring(2);
                };

                scope.updateVarsObj = function () {
                    for (var key in scope.varsObj) {
                        delete scope.varsObj[key];
                    }
                    scope.vars.forEach(function (variable) {
                        variable.result = jsepEval(variable.value, scope.varsObj);
                        if (variable.result instanceof Error) {
                            variable.title = variable.result.message;
                            variable.result = 'error';
                        } else {
                            variable.title = '';
                        }
                        scope.varsObj[variable.key] = variable.result;
                    });
                    return scope.varsObj;
                };

                scope.evaluatedExpression = 'null';

                scope.evaluateExpression = function () {
                    var expression = scope.makeExpression(scope.root);
                    var result = jsepEval(expression, scope.updateVarsObj());
                    if (result instanceof Error) {
                        var resultObj = JSON.parse(JSON.stringify(result));
                        return 'Error at index ' + resultObj.index; //todo
                    }
                    scope.evaluatedExpression = result;
                    return result;
                };

                scope.addColor = function (variable) {
                    variable.value = decodeEntities(variable.value);
                    variable.colorHtml = addColorToExpression(variable.value, scope.varsObj);
                };

                scope.vars.forEach(function (variable) {
                    scope.addColor(variable);
                });

                scope.addVar = function () {
                    var newVar = new Variable('placeholder', ' ');
                    scope.vars.push(newVar);
                    scope.updateVarsObj();
                    scope.addColor(newVar);
                };

                scope.deleteVar = function (variable) {
                    scope.vars.remove(variable);
                    scope.updateVarsObj();
                };
            }
        };
    });

    app.directive('branch', function (RecursionHelper) {
        function NodeDrag(root, node) {
            this.root = root;
            this.node = node;
        }
        var emptyNode = new Node('', []);
        var emptyDrag = new NodeDrag(emptyNode, emptyNode);
        var currentlyDragging = emptyDrag;
        return {
            restrict: 'E',
            scope: {
                node: '=',
                vars: '=?'
            },
            templateUrl: 'js/directives/tree/branch.html',
            compile: function (element) {
                return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {
                    scope.isBranch = function (node) {
                        return node.value.input instanceof Branch;
                    };

                    scope.isCondition = function (node) {
                        return !scope.isBranch(node);
                    };

                    scope.options = branchOptions;


                    scope.node.collapsed = false;
                    scope.toggleCollapse = function () {
                        scope.node.collapsed = !scope.node.collapsed;
                    };

                    scope.addCondition = function () {
                        scope.node.addLeaf(new InputOutput('', ''));
                    };

                    scope.addBranch = function () {
                        if (scope.node.isLeaf()) {
                            scope.node.children = scope.node.childNodes;
                        }
                        scope.node.addChild(new Node(new InputOutput(scope.options[0], '')));
                    };

                    scope.deleteSelf = function () {
                        scope.node.parent.deleteChild(scope.node);
                    };

                });
            }
        };
    });

    app.directive('condition', function () {
        return {
            restrict: 'E',
            scope: {
                node: '=',
                vars: '=?'
            },
            templateUrl: 'js/directives/tree/condition.html',
            link: function (scope, element) {


                scope.addColor = function () {
                    scope.node.value.input = decodeEntities(scope.node.value.input);
                    scope.colorHtml = addColorToExpression(scope.node.value.input, scope.vars);
                };

                scope.addColor();

                var root = scope.node.getRoot();
                if (typeof root.template === 'object') {
                    scope.node.conditionValue = root.template.copy();
                } else {
                    scope.node.conditionValue = root.template;
                }

                scope.deleteSelf = function () {
                    scope.node.parent.deleteChild(scope.node);
                };

                scope.output = '';

                scope.inputChanged = function () {
                    scope.output = jsepEval(scope.node.value.input, scope.vars);
                    if (scope.output instanceof Error) {
                        scope.output = scope.output.message;
                    }
                    console.log(scope.output);
                };
            }
        };
    });

})();