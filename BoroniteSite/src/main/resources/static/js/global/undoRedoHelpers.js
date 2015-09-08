var undoRedo = new CommandUndoRedo();


function cancelRule($scope) {
    var storage = saveShallowState($scope);
    $scope.conditions = [];
    $scope.actions = [];
    $scope.ruleName = "";
    $scope.setState('ruleComplete');
    return function () {
        return undoCancelRule($scope, storage);
    };
}
function undoCancelRule($scope, storage) {
    $scope.conditions = storage.conditions;
    $scope.actions = storage.actions;
    $scope.ruleName = storage.ruleName;
    $scope.setState('ruleInit');
    return function () {
        return cancelRule($scope);
    };
}
function saveShallowState(state) {
    var storage = {};
    for (var key in state) {
        if (state.hasOwnProperty(key)) {
            storage[key] = state[key];
        }
    }
    return storage;
}
function deleteAction($scope, action) {
    $scope.actions.remove(action);
    return function () {
        return undoDeleteAction($scope, action);
    };
}
function undoDeleteAction($scope, action) {
    $scope.actions.push(action);
    return function () {
        return deleteAction($scope, action);
    };
}
function deleteCondition($scope, condition) {
    $scope.conditions.remove(condition);
    return function () {
        return undoDeleteCondition($scope, condition);
    };
}
function undoDeleteCondition($scope, condition) {
    $scope.conditions.push(condition);
    return function () {
        return deleteCondition($scope, condition);
    };
}
function setState(setStateFunc, oldState, newState) {
    setStateFunc(newState);
    return function () {
        return undoSetState(setStateFunc, oldState, newState);
    };
}
function undoSetState(setStateFunc, oldState, newState) {
    setStateFunc(oldState);
    return function () {
        return setState(setStateFunc, oldState, newState);
    };
}
function setFuncStateHelper(setState, setFuncState, oldState, newState, oldFuncState, newFuncState) {
    setState(newState);
    setFuncState(newFuncState);
    return function () {
        return undoSetFuncState(setState, setFuncState, oldState, newState, oldFuncState, newFuncState);
    };
}
function undoSetFuncState(setState, setFuncState, oldState, newState, oldFuncState, newFuncState) {
    setState(oldState);
    setFuncState(oldFuncState);
    return function () {
        return setFuncStateHelper(setState, setFuncState, oldState, newState, oldFuncState, newFuncState);
    };
}
function pushItemAndAdjustDisabled($scope, arr, item, itemFields,
        itemFieldNames, dispBools, oldState, newState) {
    arr.push(item);
    var i;
    for (i = 0; i < itemFieldNames.length; i++) {
        reInitialize($scope, itemFieldNames[i]);
        if(itemFieldNames[i] === 'variables')   {
            $scope[itemFieldNames[i]] = [];
        }
    }
    $scope.setState(newState);
    i = 0;
    toggleBools($scope, dispBools, true);
    return function () {
        return undoPushItemAndAdjustDisabled($scope, arr, item, itemFields,
                itemFieldNames, dispBools, oldState, newState);
    };
}
function undoPushItemAndAdjustDisabled($scope, arr, item, itemFields,
        itemFieldNames, dispBools, oldState, newState) {
    arr.remove(item);
    var i = 0;
    for (i; i < itemFieldNames.length; i++) {
        $scope[itemFieldNames[i]] = itemFields[i];
    }
    $scope.setState(oldState);
    i = 0;
    toggleBools($scope, dispBools, false);
    return function () {
        return pushItemAndAdjustDisabled($scope, arr, item, itemFields,
                itemFieldNames, dispBools, oldState, newState);
    };
}
function assignFieldItem($scope, fieldString, fieldItem, dispBools) {
    $scope[fieldString] = fieldItem;
    var i;
    toggleBools($scope, dispBools, false);
    return function () {
        return undoAssignFieldItem($scope, fieldString, fieldItem, dispBools);
    };
}
function undoAssignFieldItem($scope, fieldString, fieldItem, dispBools) {
    delete $scope[fieldString];
    var i;
    toggleBools($scope, dispBools, true);
    return function () {
        return assignFieldItem($scope, fieldString, fieldItem, dispBools);
    };
}
function cancelCreation($scope, fields, items, oldState, newState, dispBools) {
    var i = 0;
    for (i; i < fields.length; i++) {
        //TODO: figure out why $scope.variables is not removed
        reInitialize($scope, fields[i]);
        if (fields[i] === "variables") {
            $scope[fields[i]] = [];
        }
    }
    $scope.setState(newState);
    toggleBools($scope, dispBools, true);
    return function () {
        return undoCancelCreation($scope, fields, items, oldState, newState, dispBools);
    };
}
function undoCancelCreation($scope, fields, items, oldState, newState, dispBools) {
    var i = 0;
    for (i; i < fields.length; i++) {
        $scope[fields[i]] = items[i];
    }
    $scope.setState(oldState);
    toggleBools($scope, dispBools, false);
    return function () {
        return cancelCreation($scope, fields, items, oldState, newState, dispBools);
    };
}
function insertSymbolToFunction($scope, textDetails) {
    //textDetails.htmlObject.focus();
    $scope.selected.rule.values[$scope.selected.attribute] = textDetails.text.substring(0, textDetails.textSelected.start) + textDetails.newSymbol
            + textDetails.text.substring(textDetails.textSelected.end);
    return function () {
        return undoInsertSymbolToFunction($scope, textDetails);
    };
}
function undoInsertSymbolToFunction($scope, textDetails) {
    //textDetails.htmlObject.focus();
    $scope.selected.rule.values[$scope.selected.attribute] = textDetails.text.substring(0, textDetails.textSelected.start) + textDetails.originalText
            + textDetails.text.substring(textDetails.textSelected.end);
    return function () {
        return insertSymbolToFunction($scope, textDetails);
    };
}
function assignVariableAndState($scope, id, item, oldState, newState) {
    $scope.setState(newState);
    $scope[id] = item;
    return function () {
        return undoAssignVariableAndState($scope, id, item, oldState, newState);
    };
}
function undoAssignVariableAndState($scope, id, item, oldState, newState) {
    delete $scope[id];
    $scope.setState(oldState);
    return function () {
        return assignVariableAndState($scope, id, item, oldState, newState);
    };
}
function addCompleteRule ($scope, newRule)  {
    $scope.currentTable.addCompleteRule(newRule);
    $scope.conditions = [];
    $scope.actions = [];
    var tempVariables = angular.copy($scope.variables);
    $scope.variables = [];
    $scope.ruleName = "";
    $scope.state = "ruleComplete";
    $scope.funcState = "";
    return function ()  {
        return undoAddCompleteRule($scope, newRule, tempVariables);
    };
}
function undoAddCompleteRule ($scope, newRule, tempVariables)  {
    $scope.currentTable.removeRule(newRule);
    $scope.conditions = newRule.conditions;
    $scope.actions = newRule.actions;
    $scope.variables = tempVariables;
    $scope.ruleName = newRule.name;
    $scope.state = "ruleInit";
    $scope.funcState = "";
    return function ()  {
        return addCompleteRule($scope, newRule);
    };
}






function reInitialize(obj, name)    {
    if(typeof obj[name] === 'string')   {
        obj[name] = "";
    }
    else if(obj[name] instanceof Array)   {
        obj[name] = [];
    }
    else    {
        delete obj[name];
    }
}
function toggleBools($scope, dispBools, val)    {
    var i;
    for(i = -0; i < dispBools.length; i++)  {
        $scope[dispBools[i]] = val;
    }
}