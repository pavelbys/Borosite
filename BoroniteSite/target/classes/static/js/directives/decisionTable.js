app.directive('decisionTable', function($timeout) {
    function DtDrag(elt) {
        this.elt = elt;
        this.isTarget = function(target) {
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
        templateUrl: 'js/directives/templates/decisionTable.html',
        link: function(scope) {

            assert(scope.table instanceof DecisionTable);

            var savedState = scope.table.copy();

            scope.undoRedo = new CommandUndoRedo();

            function saveState() {
                var prevState = savedState.copy();
                savedState = scope.table.copy();
                return function() {
                    scope.table = prevState;
                    return saveState();
                };
            }

            scope.afterChange = function() {
                scope.undoRedo.saveAction(saveState());
            };

            scope.undo = function() {
                scope.undoRedo.undo();
            };

            scope.redo = function() {
                scope.undoRedo.redo();
            };

            scope.selected = {
                rule: scope.table.rules[0],
                attribute: scope.table.attributes()[0],
                editing: false,
                focused: false
            };

            scope.focusEditor = function() {
                scope.selected.editing = true;
            };

            scope.blurEditor = function() {
                $timeout(function() {
                    if (!scope.selected.focused) {
                        scope.selected.editing = false;
                        if (!scope.table.equals(savedState)) {
                            scope.afterChange();
                        }
                    }
                }, 10);
            };

            scope.blurCell = function() {
                if (!scope.table.equals(savedState)) {
                    scope.afterChange();
                }
                scope.selected.editing = false;
                scope.selected.focused = false;
                scope.focusRuleInput = false;
            };

            scope.selectedCell = function(rule, attribute) {
                return scope.selected.rule.toString() === rule.toString() && scope.selected.attribute.toString() === attribute.toString();
            };

            scope.editingCell = function(rule, attribute) {
                return scope.selectedCell(rule, attribute) && scope.selected.editing;
            };

            scope.selectCell = function(rule, attribute) {
                scope.selected.rule = rule;
                scope.selected.attribute = attribute;
            };


            scope.editClass = function(dtClass) {
                alert('todo');
            };

            scope.hitPolicyOptions = 'U A P F R O C C+ C# C< C>'.split(' ');

            scope.doneAddingRule = function() {
                scope.addingRule = false;
                scope.newRuleName = '';
            };

            scope.addRule = function(name) {
                var values = [].fill('-', 0, scope.table.conditionsSpan() + scope.table.resultsSpan());
                scope.table.addRule(name, values);
                scope.doneAddingRule();
                scope.afterChange();
            };

            scope.addRuleKeyPress = function(event) {
                if (event.keyCode === 13) {
                    if (scope.newRuleName) {
                        scope.addRule(scope.newRuleName);
                    }
                }
            };

            scope.deleteRule = function(rule, index) {
                scope.table.rules.splice(index, 1);
                scope.afterChange();
            };

            scope.addCondition = function() {
                alert('todo');
            };

            scope.addResult = function() {
                alert('todo');
            };

            scope.sortRules = function(attribute, descending) {
                scope.table.rules.sort(function(r1, r2) {
                    return compareStrings(r1.values[attribute], r2.values[attribute]);
                });
                if (descending) {
                    scope.table.rules.reverse();
                }
            };

            scope.testDrag = function() {
                console.log('dragstart');
            };

            scope.removeRuleSort = function() {
                scope.table.rules.sort(function(r1, r2) {
                    return compareStrings(r1.toString(), r2.toString());
                });
            };

            scope.attrDragging = function(attribute) {
                return attribute.dragging || attribute.getParent().dragging;
            };

            scope.attrDragOver = function(attribute) {
                return attribute.dragOver || attribute.getParent().dragOver;
            };

            scope.cellDragging = function(rule, attribute) {
                return rule.dragging || scope.attrDragging(attribute);
            };

            scope.cellDragOver = function(rule, attribute) {
                return rule.dragOver || scope.attrDragOver(attribute);
            };

            scope.dragFunctions = {
                dragstart: function(elt) {
                    elt.dragging = true;
                    currentlyDragging = new DtDrag(elt);
                },
                dragend: function(elt) {
                    elt.dragging = false;
                    currentlyDragging = emptyDrag;
                },
                dragenter: function(elt) {
                    if (currentlyDragging.isTarget(elt)) {
                        elt.dragOver = true;
                    }
                },
                dragleave: function(elt, event, rect) {
                    if (!strictWithin(event, rect, -1)) {
                        elt.dragOver = false;
                    }
                },
                drop: function(elt) {
                    elt.dragOver = false;
                    if (currentlyDragging.isTarget(elt)) {
                        elt.getSiblings().moveElts(currentlyDragging.elt, elt);
                        scope.afterChange();
                    }
                }
            };
        }
    };
});