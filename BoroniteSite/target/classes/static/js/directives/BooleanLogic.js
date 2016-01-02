(function MakeBooleanLogicDirectives() {


    //hard-coded objects for rule creation
    var age = new AttributeCreator("age", [">", "<", "="]);
    var height = new AttributeCreator("height", ["!=", "="]);
    var age2 = new AttributeCreator("age", [">", "<", "="]);

    var bob = new ObjectCreator("bob", [age, height]);
    var allen = copy(bob);
    allen.name = "Allen";
    var library = new ObjectCreator("library", [angular.copy(age)]);
    var sam = new ObjectCreator("Sam", [age2]);

    var conditionObjectList = [bob, allen];
    var actionObjectList = [new ObjectCreator("Sam", [age2]), library];
    var actionList = [new ActionCreator(library, copy(age), 5), new ActionCreator(sam, copy(age), 15), new ActionCreator(sam, copy(age), 15), new ActionCreator(sam, copy(age), 15)];



    var bobCondition1 = new ConditionCreator(bob, age, ">", 6);
    var bobCondition2 = new ConditionCreator(bob, height, "=", 5);

    var allenCondition1 = new ConditionCreator(allen, age2, "<", 22);
    var allenCondition2 = new ConditionCreator(allen, height, "!=", 7);

    //var undoRedo = new CommandUndoRedo();
    var d3Update;
    var toggle;

    function updateTruth(node) {
        var bools = node.childNodes.map(function (n) {
            return n.value.isTrue;
        });
        if (headerInfo[node.value.data]) {
            var result = headerInfo[node.value.data].evaluate(bools);
            node.value.isTrue = result;
        }
    }

    function HeaderInfo(mergeable, plural, operator, trueCount, prefix, suffix) {
        this.mergeable = mergeable;
        this.plural = plural;
        this.operator = operator;
        this.evaluate = function (bools) {
            var count = 0;
            for (var i = 0; i < bools.length; i++) {
                count += bools[i];
            }
            return trueCount(count, bools);
        };
        this.makeString = function (conditions) {
            var string = conditions.join(' ' + operator + ' ');
            if (conditions.length > 1) {
                string = '(' + string + ')';
            }
            if (prefix || suffix) {
                string = '(' + prefix + string + suffix + ')';
            }
        };
    }
    var headerInfo = {
        'any': new HeaderInfo(true, true, '||', function (count) {
            return count > 0;
        }),
        'all': new HeaderInfo(true, true, '&&', function (count, bools) {
            return count === bools.length;
        }),
        'none': new HeaderInfo(true, true, '&&', function (count) {
            return count === 0;
        }, '!'),
        'only one': new HeaderInfo(false, false, '+', function (count) {
            return count === 1;
        }, '=== 1')
    };
    var headerOptions = Object.keys(headerInfo);

    function NodeValue(data, isTrue) {
        this.data = data;
        if (!isTrue) {
            this.isTrue = false;
        } else {
            this.isTrue = true;
        }
        this.toString = function () {
            return this.data.toString();
        };
    }
    app.controller("BooleanLogicController_new", function ($scope) {
        $scope.treeCollapsed = false;
        $scope.toggleCollapse = function() {
            $scope.treeCollapsed = !$scope.treeCollapsed;
            if(!$scope.treeCollapsed) {
                document.getElementById('a').value = "+ TREE";
            } else {
                document.getElementById('a').value = "- TREE";
            }
        };

        var conditionsGroup = new Group('Conditions', [new Button('go to subtable'), new Button('create subtable')]);

        $scope.exampleTable = new Table('U')
                .addColGroup('Conditions', 'C1 C2 C3'.split(' '))
                .addColGroup('Actions', 'A1 A2'.split(' '))
                .buildRow('Rules', 'R1', 'foo bar derp baz glorp'.split(' '))
                .buildRow('Rules', 'R2', 'pi true false maybe yes'.split(' '))
                .buildRow('Rules', 'R2', 'tau false true absolutely not'.split(' '))
                .buildRow('Rules', 'R2', 'tis hard to find words'.split(' '));

        //bobCondition1 = new Condition(bob, age, 16, '>');
        //bobCondition2 = new Condition(bob, height, 6, '=');

        //allenCondition1 = new Condition(allen, age, 17, '<=');
        //allenCondition2 = new Condition(allen, height, 9, '>=');

        $scope.root = new Node(new NodeValue("any", false))
                .addChildNode(new Node(new NodeValue("all", false))
                        .addLeaf(new NodeValue(bobCondition1, false))
                        .addLeaf(new NodeValue(bobCondition2, false)))
                .addChildNode(new Node(new NodeValue("only one", false))
                        .addLeaf(new NodeValue(allenCondition1, false))
                        .addLeaf(new NodeValue(allenCondition2, false)))
                .addLeaf(new NodeValue(copy(bobCondition1), false))
                .addLeaf(new NodeValue(copy(bobCondition2), false))
                .addLeaf(new NodeValue(copy(allenCondition1), false))
                .addLeaf(new NodeValue(copy(allenCondition2), false));

        $scope.itunesData = {
            table: $scope.testTable,
            root: $scope.root,
            actions: actionList
        };

        $scope.broadcastClick = function (event) {
            $scope.$broadcast('click', {
                clickEvent: event
            });
        };
    });
    app.directive("booleanLogic", function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: 'js/directives/templates/booleanLogic.html',
            link: function (scope, element) {
                scope.undoRedo = undoRedo;
                scope.tableKeyWords = ['U', 'A', 'C+'];

                scope.undo = function () {
                    undoRedo.undo();
                    scope.data.root.forEach(updateTruth);
                    d3Update(scope.data.root);
                };
                scope.redo = function () {
                    undoRedo.redo();
                    scope.data.root.forEach(updateTruth);
                    d3Update(scope.data.root);
                };

                scope.d3LeftPos = function () {
                    return element[0].getBoundingClientRect().width + 20 + 'px';
                };

                document.addEventListener('keyup', function (event) {
                    scope.$apply(function () {
                        if (event.ctrlKey) {
                            event.preventDefault();
                            switch (event.keyCode) {
                                case 90:
                                    if (undoRedo.canUndo()) {
                                        scope.undo();
                                    }
                                    break;
                                case 89:
                                    if (undoRedo.canRedo()) {
                                        scope.redo();
                                    }
                                    break;
                            }
                        }
                    });
                });

                toggle = function (d) {

                    if (d.collapsed) {
                        d._children = d.children;
                        d.children = [];
                    } else {
                        d.children = d._children;
                        d._children = [];
                    }
                };

                d3Update = makeD3Tree(scope.data.root);
            }
        };
    });
    app.directive("actions", function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: "js/directives/templates/actions.html",
            link: function (scope) {
                scope.currentlyEditing = -1;
                scope.newActionVisible = false;
                scope.newAction = new ActionCreator(null, null, null);
                scope.actionObjectList = actionObjectList;
                scope.actionDropdownsSelected = true;

                var valueWatcher = new DeepWatcher(scope.data.actions);

                scope.editAction = function (index) {
                    scope.currentlyEditing = index;
                };

                scope.deleteAction = function (index) {
                    scope.currentlyEditing = -1;
                    undoRedo.saveAction(scope.data.actions.removeRedoableElement(scope.data.actions[index]));
                };

                scope.moveActions = function (from, to) {
                    function move(fromIndex, toIndex) {
                        scope.data.actions.move(fromIndex, toIndex);
                        return function () {
                            return move(toIndex, fromIndex);
                        };
                    }
                    undoRedo.saveAction(move(from, to));
                };

                scope.doneEditing = function () {
                    if (valueWatcher.stateChanged()) {
                        undoRedo.saveAction(valueWatcher.saveState());
                    }
                    scope.currentlyEditing = -1;
                };

                scope.addAction = function () {
                    scope.newActionVisible = true;
                };

                scope.newActionComplete = function () {
                    var newActionFinished = new ActionCreator(scope.newAction.object, scope.newAction.attribute,
                            scope.newAction.value);
                    undoRedo.saveAction(scope.data.actions.addUndoableElement(newActionFinished));

                    scope.newActionCancel();
                };

                scope.newActionCancel = function () {
                    scope.newActionVisible = false;
                    scope.actionDropdownsSelected = true;
                    scope.newAction = new ActionCreator(null, null, null);
                };

                document.addEventListener('keyup', function (event) {
                    scope.$apply(function () {
                        if (event.keyCode === 13 && !scope.actionDropdownsSelected) {
                            scope.newActionComplete();
                        }
                    });

                });
            }
        };
    });
    app.directive("branch", function (RecursionHelper) {

        function NodeDrag(root, node) {
            this.root = root;
            this.node = node;
        }
        var emptyNode = new Node('', []);
        var emptyDrag = new NodeDrag(emptyNode, emptyNode);
        var currentlyDragging = emptyDrag;
        return {
            restrict: "E",
            scope: {
                node: '='
            },
            templateUrl: "js/directives/templates/branch.html",
            compile: function (element) {
                return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {
                    scope.headerInfo = headerInfo;
                    scope.headerOptions = headerOptions;
                    scope.conditionObjectList = conditionObjectList;
                    scope.newConditionVisible = false;
                    scope.conditionDropdownsSelected = true;
                    scope.newCondition = new ConditionCreator(null, null, null, null);

                    scope.isBranch = function (node) {
                        return headerInfo.hasOwnProperty(node.value.data);
                    };

                    scope.isCondition = function (node) {
                        return !scope.isBranch(node);
                    };

                    var valueWatcher = new AngularWatcher(scope.node.value);
                    scope.headerChanged = function () {
                        updateTruth(scope.node);
                        undoRedo.saveAction(valueWatcher.saveState());
                        d3Update(scope.node);
                    };

                    scope.toggleCollapse = function () {
                        scope.node.collapsed = !scope.node.collapsed;
                        toggle(scope.node);
                        d3Update(scope.node);
                    };

                    scope.addCondition = function () {
                        scope.newConditionVisible = true;
                    };

                    scope.newConditionComplete = function () {
                        var newConditionFinished = new ConditionCreator(scope.newCondition.object, scope.newCondition.attribute,
                                scope.newCondition.conditional, scope.newCondition.value);
                        if (scope.node.isLeaf()) {
                            scope.node.children = scope.node.childNodes;
                        }
                        undoRedo.saveAction(scope.node.addChild(new Node(new NodeValue(newConditionFinished, false))));
                        d3Update(scope.node);
                        scope.newConditionCancel();
                    };

                    scope.newConditionCancel = function () {
                        scope.newConditionVisible = false;
                        scope.conditionDropdownsSelected = true;
                        scope.newCondition = new ConditionCreator(null, null, null, null);
                    };

                    scope.addBranch = function () {
                        if (scope.node.isLeaf()) {
                            scope.node.children = scope.node.childNodes;
                        }
                        undoRedo.saveAction(scope.node.addChild(new Node(new NodeValue("any", false))));
                        d3Update(scope.node);
                    };

                    scope.isMergeable = function () {
                        return headerInfo[scope.node.value.data].mergeable && !scope.node.isRoot() && scope.node.parent.value.data === scope.node.value.data;
                    };
                    scope.mergeWithParent = function () {
                        var node = scope.node;
                        var children = node.childNodes;
                        var parent = node.parent;

                        function merge() {
                            parent.deleteChild(node);
                            for (var i = 0; i < children.length; i++) {
                                parent.addChild(children[i]);
                            }
                            return unMerge;
                        }

                        function unMerge() {
                            for (var i = 0; i < children.length; i++) {
                                parent.deleteChild(children[i]);
                            }
                            parent.addChild(node);
                            return merge;
                        }
                        undoRedo.saveAction(merge());
                        d3Update(scope.node);
                    };

                    scope.deleteSelf = function () {
                        undoRedo.saveAction(scope.node.parent.deleteChild(scope.node));
                        d3Update(scope.node);
                    };

                    scope.dragStart = function (node) {
                        currentlyDragging = new NodeDrag(node.getRoot(), node);
                    };

                    scope.dragOver = function () {
                        if (currentlyDragging.root.containsNode(scope.node) && !currentlyDragging.node.containsNode(scope.node)) {
                            scope.draggingOver = true;
                        }
                    };

                    scope.dragLeave = function () {
                        scope.draggingOver = false;
                    };

                    scope.drop = function () {
                        scope.draggingOver = false;

                        function move(node, newParent) {
                            var curParent = node.parent;
                            curParent.deleteChild(node);
                            newParent.addChild(node);
                            return function () {
                                return move(node, curParent);
                            };
                        }
                        if (currentlyDragging.root.containsNode(scope.node) && !currentlyDragging.node.containsNode(scope.node)) {
                            if (currentlyDragging.node.parent !== scope.node) {
                                undoRedo.saveAction(move(currentlyDragging.node, scope.node));
                                d3Update(scope.node);
                            }
                            currentlyDragging = emptyDrag;
                        }
                    };

                    document.addEventListener('keyup', function (event) {
                        scope.$apply(function () {
                            if (event.keyCode === 13 && !scope.conditionDropdownsSelected) {
                                scope.newConditionComplete();
                            }
                        });

                    });

                    scope.$watch(function () {
                        return scope.node.value.isTrue;
                    }, function (newValue) {
                        if (scope.node.hasParent()) {
                            updateTruth(scope.node.parent);
                            d3Update(scope.node.parent);
                        }
                    });
                });
            }
        };
    });

    app.directive("condition", function () {
        return {
            restrict: 'E',
            scope: {
                node: '='
            },
            templateUrl: "js/directives/templates/condition.html",
            link: function (scope) {
                var valueWatcher = new DeepWatcher(scope.node.value);

                scope.conditionObjectList = conditionObjectList;

                scope.doneEditing = function () {
                    if (valueWatcher.stateChanged()) {
                        undoRedo.saveAction(valueWatcher.saveState());
                        d3Update(scope.node);
                    }
                    scope.editing = false;
                };
                scope.$watch(function () {
                    return scope.node.value.isTrue;
                }, function (newValue) {
                    updateTruth(scope.node.parent);
                    d3Update(scope.node.parent);
                });
                scope.truthChanged = function () {
                    undoRedo.saveAction(valueWatcher.saveState());
                };

                scope.deleteSelf = function () {
                    undoRedo.saveAction(scope.node.parent.deleteChild(scope.node));
                    d3Update(scope.node);
                };
            }
        };
    });

    app.directive("preview", function () {
        return {
            restrict: 'E',
            templateUrl: "js/directives/templates/preview.html",
            link: function (scope) {
                scope.editing = false;
                scope.addRow = function () {
                    var table = document.getElementById('previewTable');
                    var newRow = table.insertRow(-1);
                    for (var i = 0; i < 3; i++) {
                        newRow.insertCell(i).innerHTML = "-";
                    }
                };

                scope.editCell = function (table) {
                    scope.editing = true;
                };
            }
        };
    });
})();