/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.directive('functionCreator2', function () {
    "use strict";
    return {
        restrict: 'E',
        scope: true,
        templateUrl: "js/directives/newTable/templates/functionCreator2.html",
        link: function (scope) {
            scope.func = "";
            scope.functionName = "";
            scope.subFunctionList = [new FunctionCreator("NumberofDaysBetween", ["Date 1", "Date 2"], "NumberofDaysBetween(Date 1 - Date 2)"),
                new FunctionCreator("Min", ["a", "b"], "Min(a,b)"), new FunctionCreator("Max", ["a", "b"], "Max(a,b)"),
                new FunctionCreator("in", ["a", "b"], "in[a,b]")];
            scope.conditionals = ["=", ">", "<", "!="];
            scope.operators = ["+", "-", "*", "/"];
            scope.bools = ["and", "or", "not"];
            scope.parentheses = ["(", ")", "[", "]"];
            scope.variables = [];

            scope.state = "functionCreation";
            scope.funcState = "";
            scope.functionView = false;
            scope.conditionObjects = conditionObjects;
            scope.actionObjects = actionObjects;
            scope.acAndCondObjects = acAndCondObjects;

            /**
             * Add a complete condition to the rule.
             * removes the object, acttribute, value, and conditional from scope
             * side effect: sets state to 'rule initialization'
             * disables dropdown choices
             */
            scope.finishFunction = function () {
                if (scope.funcState === 'conditionFunctionCreation') {
                    var newFunc = new FunctionForConditionCreator(scope.functionName, scope.func);
                    undoRedo.saveAction(pushItemAndAdjustDisabled(scope, scope.conditions, newFunc,
                            [scope.functionName, scope.selected.rule.values[scope.selected.attribute], scope.variables],
                            ["functionName", "func", "variables"], [], "functionCreation", "ruleInit"));
                }
                else if (scope.funcState === 'actionFunctionCreation') {
                    var newFunc = new FunctionForActionCreator(scope.functionName, scope.func);
                    undoRedo.saveAction(pushItemAndAdjustDisabled(scope, scope.actions, newFunc,
                            [scope.functionName, scope.func, scope.variables],
                            ["functionName", "func", "variables"], [], "functionCreation", "ruleInit"));
                }
            };


            /**
             * Cancel the creation of a function
             * side effects: removes local variables from scope
             *  sets state to 'rule initilization'
             */
            scope.cancelFunction = function () {
                undoRedo.saveAction(cancelCreation(scope, ["function", "functionName", "variables"],
                        [scope.function, scope.functionName, scope.variables], "functionCreation", "ruleInit", []));
            };


            scope.insertSymbol = function (symbol) {
                var currentFunc = document.getElementById('currentFunc2');
                var textSelected = getInputSelection(currentFunc);
                var originalText = currentFunc.value.substring(textSelected.start, textSelected.end);
                undoRedo.saveAction(insertSymbolToFunction(scope,
                        {text: currentFunc.value,
                            textSelected: textSelected,
                            newSymbol: symbol,
                            originalTex: originalText,
                            htmlObject: currentFunc
                        }));
            };


            scope.getFuncArgs = function (subFunction) {
//                scope.setState("getFuncArgs");
//                argString = "(";
//                for (var i = 0; i < subFunction.argList.length; i++)    {
//                    argString += input;
//                    argString += ",";
//                }
//                argString = argString.substring(argString.length - 1) + ")";
//                builtFunc = subFunction.formula + argString;
                scope.insertSymbol(subFunction.formula);
            };

            scope.addVariable = function () {
                undoRedo.saveAction(setState(scope.setState, scope.state, "variableCreation"));
            };
            
            
            scope.setState = function(state)    {
                scope.state = state;
            };
            scope.setFuncState = function(funcState)    {
                scope.funcState = funcState;
            };
            scope.setView = function(viewState) {
                scope.functionView = viewState;
            };
            
            scope.exposeFunctionEditor = function() {
                undoRedo.saveAction(setState(scope.setView, scope.functionView, !scope.functionView));
            };
        }
    };
});