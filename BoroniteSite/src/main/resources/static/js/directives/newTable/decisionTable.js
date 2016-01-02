app.directive('decisionTableNew', function ($timeout) {
    function DtDrag(elt) {
        this.elt = elt;
        this.isTarget = function (target) {
            return this.elt.getSiblings().includes(target);
        };
    }
    var emptyDrag = new DtDrag(null);
    var currentlyDragging = emptyDrag;
    return {
        restrict: 'E',
        scope: {
            table: '='
        },
        templateUrl: 'js/directives/newTable/templates/decisionTable.html',
        link: function (scope) {
            assert(scope.table instanceof DecisionTable2, 'table must be a DecisionTable2');

            var savedState = scope.table.copy();

            scope.addColumnBool = false;
            scope.columnBool = function (boo) {
                scope.addColumnBool = boo;
            };
            scope.addCategory = "";
            scope.changeCategory = function (str) {
                scope.addCategory = str;
            };

            scope.hitPolicyOptionGroups = hitPolicyOptionGroups;



            scope.testRoot = new Node(new InputOutput(branchOptions[0], ''))
                    .addLeaf(new InputOutput('', ''));



            scope.selected = {
                rule: scope.table.rules[0],
                attribute: scope.table.attributes()[0],
                editing: false,
                focused: false,
                formulaEditing: false
            };

            function saveState() {
                var prevState = savedState.copy();
                savedState = scope.table.copy();
                return function () {
                    scope.table = prevState;
                    return saveState();
                };
            }

            scope.afterChange = function () {
                if (!scope.table.equals(savedState)) {
                    undoRedo.saveAction(saveState());
                }
            };


            scope.undo = function () {
                undoRedo.undo();
            };

            scope.redo = function () {
                undoRedo.redo();
            };

            scope.focusEditor = function () {
                scope.selected.focused = false;
                scope.selected.editing = true;
            };

            scope.blurEditor = function () {
                $timeout(function () {
                    if (!scope.selected.focused) {
                        scope.selected.editing = false;
                        scope.afterChange();
                    }
                }, 10);
            };

            scope.selectedCell = function (rule, attribute) {
                return scope.selected.rule.toString() === rule.toString() && scope.selected.attribute.toString() === attribute.toString();
            };

            scope.editingCell = function (rule, attribute) {
                return scope.selectedCell(rule, attribute) && scope.selected.editing;
            };

            scope.clickCell = function (rule, attribute) {
                if (scope.selectedCell(rule, attribute)) {
                    scope.selected.editing = true;
                    scope.selected.focused = true;
                    scope.selected.formulaEditing = false;
                } else {
                    scope.selected.rule = rule;
                    scope.selected.attribute = attribute;
                }
            };

            scope.blurCell = function () {
                scope.selected.editing = false;
                scope.selected.focused = false;
                scope.focusRuleInput = false;
                scope.afterChange();
            };

            scope.editClass = function (dtClass) {
                alert('todo');
            };

            scope.doneAddingRule = function () {
                scope.addingRule = false;
                scope.newRuleName = '';
            };

            scope.addRule = function (name) {
                var values = [].fill('-', 0, scope.table.conditionsSpan() + scope.table.resultsSpan());
                scope.table.addRule(name, values);
                scope.doneAddingRule();
                scope.afterChange();
            };
            scope.addRuleKeyPress = function (event) {
                if (event.keyCode === 13) {
                    if (scope.newRuleName) {
                        scope.addRule(scope.newRuleName);
                    }
                }
            };

            scope.deleteRule = function (rule, index) {
                scope.table.rules.splice(index, 1);
                scope.afterChange();
            };

            scope.addCondition = function () {
                alert('todo');
            };

            scope.addResult = function () {
                alert('todo');
            };

            scope.categories = [{
                    name: 'Conditions',
                    description: 'todo add a conditions description',
                    span: function () {
                        return scope.table.conditionsSpan();
                    },
                    click: scope.addCondition
                }, {
                    name: 'Results',
                    description: 'todo add a results description',
                    span: function () {
                        return scope.table.resultsSpan();
                    },
                    click: scope.addResult
                }];

            scope.sortRules = function (attribute, descending) {
                scope.table.rules.sort(function (r1, r2) {
                    return compareStrings(r1.values[attribute], r2.values[attribute]);
                });
                if (descending) {
                    scope.table.rules.reverse();
                }
            };

            scope.testDrag = function () {
                console.log('dragstart');
            };

            scope.removeRuleSort = function () {
                scope.table.rules.sort(function (r1, r2) {
                    var str1 = r1.toString();
                    var str2 = r2.toString();
                    var index1 = str1.substring(str1.lastIndexOf('_') + 1);
                    var index2 = str2.substring(str2.lastIndexOf('_') + 1);
                    console.log(index1, index2);
                    return index1 - index2;
                });
            };

            scope.attrDragging = function (attribute) {
                return attribute.dragging || attribute.getParent().dragging;
            };

            scope.attrDragOver = function (attribute) {
                return attribute.dragOver || attribute.getParent().dragOver;
            };

            scope.cellDragging = function (rule, attribute) {
                return rule.dragging || scope.attrDragging(attribute);
            };
            scope.cellDragOver = function (rule, attribute) {
                return rule.dragOver || scope.attrDragOver(attribute);
            };
            scope.dragFunctions = {
                dragstart: function (elt) {
                    elt.dragging = true;
                    currentlyDragging = new DtDrag(elt);
                }, dragend: function (elt) {
                    elt.dragging = false;
                    currentlyDragging = emptyDrag;
                },
                dragenter: function (elt) {
                    if (currentlyDragging.isTarget(elt)) {
                        elt.dragOver = true;
                    }
                },
                dragleave: function (elt, event, rect) {
                    if (!(event instanceof MouseEvent)) {
                        event = event.originalEvent;
                    }
                    if (!strictWithin(event, rect, -1)) {
                        elt.dragOver = false;
                    }
                },
                drop: function (elt) {
                    elt.dragOver = false;
                    if (currentlyDragging.isTarget(elt)) {
                        elt.getSiblings().moveElts(currentlyDragging.elt, elt);
                        scope.afterChange();
                    }
                }
            };

            scope.hasSubTable = function (subTableName) {
                return newTables[subTableName] !== undefined;
            };

            scope.goToSubTable = function (subTableName) {
                scope.table = newTables[subTableName];
            };

            scope.createSubTable = function (subTableName) {
                var newSubTable = new DecisionTable2(subTableName);
                scope.table = newSubTable;
                newTables[subTableName] = newSubTable;
            };


            document.addEventListener('keydown', function (event) {
                scope.$apply(function () {
                    if (event.keyCode >= 37 && event.keyCode <= 40 && !scope.selected.editing) {
                        event.preventDefault();
                        var attrIndex = scope.table.attributes().indexOf(scope.selected.attribute);
                        var ruleIndex = scope.table.rules.indexOf(scope.selected.rule);
                        switch (event.keyCode) {
                            case 37:
                                if (attrIndex > 0) {
                                    scope.selected.attribute = scope.table.attributes()[attrIndex - 1];
                                }
                                break;
                            case 38:
                                if (ruleIndex > 0) {
                                    scope.selected.rule = scope.table.rules[ruleIndex - 1];
                                }
                                break;
                            case 39:
                                if (attrIndex < scope.table.attributes().length - 1) {
                                    scope.selected.attribute = scope.table.attributes()[attrIndex + 1];
                                }
                                break;
                            case 40:
                                if (ruleIndex < scope.table.rules.length - 1) {
                                    scope.selected.rule = scope.table.rules[ruleIndex + 1];
                                }
                                break;
                        }
                        //scope.selected.focused = false;
                    }
                });
            });

            document.addEventListener('keyup', function (event) {
                scope.$apply(function () {
                    if (event.keyCode === 13) {
                        scope.focusRuleInput = true;
                        scope.selected.editing = !scope.selected.editing;
                        scope.selected.focused = true;
                    }
                });
            });
        }
    };
});