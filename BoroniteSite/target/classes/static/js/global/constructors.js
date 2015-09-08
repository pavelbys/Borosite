/*jslint white: true */
function Button(text, click, hide) {
    this.text = text;
    this.click = click;
    this.hide = hide;
    this.toString = function() {
        return this.text;
    };
}

function Group(name, buttons) {
    this.name = name;
    this.buttons = buttons;
}

function Row(name, group, values) {
    if (!values) {
        values = {};
    }
    this.name = name;
    this.values = values;
    this.group = group;
}

function Col(name, group) {
    this.name = name;
    this.group = group;
    this.toString = function() {
        return this.name + '_' + this.group;
    };
}

function Table(rowsName) {
    this.rowsName = rowsName;
    this.cols = [];
    this.rows = [];

    this.colGroups = [];
    this.rowGroups = [];

    this.addColGroup = function(group, colNames) {
        for (var i = 0; i < colNames.length; i++) {
            this.cols.push(new Col(colNames[i], group));
        }
        this.colGroups.push(group);
        return this;
    };

    var thisTable = this;

    function compareColsByGroup(c1, c2) {
        return thisTable.colGroups.indexOf(c1.group) - thisTable.colGroups.indexOf(c2.group);
    }

    function compareRowsByGroup(r1, r2) {
        return thisTable.rowGroups.indexOf(r1.group) - thisTable.rowGroups.indexOf(r2.group);
    }

    this.addCol = function(newCol) {
        this.cols.push(newCol);

        if (this.rowGroups.indexOf(newCol.group) === -1) {
            this.rowGroups.push(newCol.group);
        }
        this.cols.sort(compareColsByGroup);
        return function() {
            thisTable.cols.remove(newCol);
            return function() {
                return thisTable.addCol(newCol);
            };
        };
    };

    this.addRow = function(newRow) {
        if (this.rowGroups.indexOf(newRow.group) === -1) {
            this.rowGroups.push(newRow.group);
        }
        this.rows.push(newRow);
        this.rows.sort(compareRowsByGroup);
        return this;
    };

    this.buildRow = function(group, name, values) {

        var row = new Row(name, group);
        for (var i = 0; i < values.length; i++) {
            row.values[this.cols[i]] = values[i];
        }

        if (this.rowGroups.indexOf(group) === -1) {
            this.rowGroups.push(group);
        }
        this.rows.push(row);
        this.rows.sort(compareRowsByGroup);
        return this;
    };

    this.colGroupSize = function(group) {
        var count = 0;
        for (var i = 0; i < this.cols.length; i++) {
            if (this.cols[i].group === group) {
                count++;
            }
        }
        return count;
    };

    this.rowGroupSize = function(group) {
        var count = 0;
        for (var i = 0; i < this.rows.length; i++) {
            if (this.rows[i].group === group) {
                count++;
            }
        }
        return count;
    };
}

function DecisionTable2(name) {
    this.name = name;
    this.hitPolicy = 'U';
    this.hitPolicyOptions = 'U A P F R O C C+ C# C< C>'.split(' ');

    function Attribute(name, originalIndex, ownerToString) {
        this.name = name;
        this.originalIndex = originalIndex;
        this.ownerObj = ownerObj;
        this.toString = function() {
            return ownerToString() + '_' + this.originalIndex.toString();
        };

    }

    function ConditionObj(name, originalIndex) {
        this.name = name;
        this.originalIndex = originalIndex;
        this.toString = function() {
            return 'Conditions_' + this.originalIndex;
        };

        this.attributes = [];

        this.size = function() {
            return this.attributes.length;
        };

        this.addAttribute = function(name) {
            this.attributes.push(new Attribute(name, this.attributes.length, this.toString));
        };
    }

    function Action(name, originalIndex) {
        this.name = name;
        this.originalIndex = originalIndex;
        this.toString = function() {
            return 'Actions_' + this.originalIndex;
        };
    }

    function Rule(name, originalIndex) {
        this.name = name;
        this.originalIndex = originalIndex;
        this.toString = function() {
            return 'Rules_' + this.originalIndex;
        };
    }

    function Group(name, originalIndex, parentToString) {
        this.name = name;
        this.originalIndex = originalIndex;

        if (parentToString) {
            this.parentToString = parentToString;
        } else {
            this.parentToString = function() {
                return 'root';
            };
        }

        this.toString = function() {
            return this.parentToString() + '_' + this.originalIndex;
        };

        this.subGroups = [];

        this.size = function() {
            return this.subGroups.length
        }

        this.addSubGroup = function(group) {
            group.parentToString = this.toString;
            this.subGroups.push(group);
        };

        this.makeSubGroup = function(name) {
            var newGroup = new Group(name, this.subGroups.length, this.toString);
            this.subGroups.push(newGroup);
            return this;
        };
    }

    function Group(name, id, getParentId) {
        this.name = name;
        this.id = id;
        if (getParentId) {
            this.getParentId = getParentId;
        } else {
            this.getParentId = function() {
                return 'root';
            };
        }
        this.subGroups = [];

        this.colSpan = function() {
            this.subGroups.reduce(function(prev, cur) {
                return prev + cur.colSpan();
                d
            }, 0);
            return Math.max(1, this.subGroups.length);
        };



    }

    this.conditions = new Group('Conditions', 0);
    this.actions = new Group('Actions', 1);
    this.colGroups = [this.conditions, this.actions];

    this.rules = [];

    this.cells = {};

    this.addCondition = function(name, attributeNames) {
        var newCondition = new ConditionObj(name, this.conditions.length);

        this.conditions.makeSubGroup(name);

        var attributes = attributeNames.forEach(function(name) {
            newCondition.addAttribute(name);
        });

        this.conditions.push(newCondition);

        this.rules.forEach(function(rule) {
            this.cells[rule][newCondition] = '-';
        });
        return this;
    };

    this.addAction = function(name) {
        var newAction = new Action(name, this.actions.length);
        this.actions.push(newAction);
        this.rules.forEach(function(rule) {
            this.cells[rule][newAction] = '-';
        });
        return this;
    };

    this.addRule = function(name, values) {
        var newRule = new Rule(name, this.rules.length);
        this.rules.push(newRule);

    };


}

/**
 * Create a decision table.
 * @param {string} name
 * @param {array of string} ruleNames
 * @param {array of string} conditionNames
 * @param {array of string} actionNames
 * @param {dictionary of string->string->string} cellsDict
 * @param {dictionary of string->string} colDict
 * @returns {DecisionTable}
 */
function DecisionTable(name, ruleNames, conditionNames, actionNames, cellsDict, colDict) {
    "use strict";
    var i = 0;

    if (name === undefined || ruleNames === undefined || conditionNames === undefined || actionNames === undefined || cellsDict === undefined || colDict === undefined) {
        console.log("Arguments: ", "name", name, "ruleNames", ruleNames,
            "conditionNames", conditionNames, "actionNames", actionNames,
            "cellsDict", cellsDict, "colDict", colDict);
        throw new Error("Missing an argument");
    }
    this.name = name;
    this.ruleNames = ruleNames;
    this.conditionNames = conditionNames;
    this.actionNames = actionNames;
    this.cellsDict = cellsDict;
    this.colDict = colDict;

    function OriginalRowIndices() {
        this.nextIndex = 0;
        this.add = function(row) {
            this[row] = this.nextIndex;
            this.nextIndex++;
        };
    }

    this.originalRowIndices = new OriginalRowIndices();

    for (i = 0; i < this.ruleNames.length; i++) {
        this.originalRowIndices.add(this.ruleNames[i]);
    }
}

/**
 * Object containing functions that operate on DecisionTable objects.
 */
var DecisionTables = {
    toJSON: function(decisionTable) {
        return JSON.stringify(decisionTable);
    },
    fromJSON: function(decisionTableJSON) {
        var tableObj = JSON.parse(decisionTableJSON);
        return new DecisionTable(tableObj.name, tableObj.ruleNames, tableObj.conditionNames, tableObj.actionNames, tableObj.cellsDict, tableObj.colDict);
    },
    copy: function(decisionTable) {
        return DecisionTables.fromJSON(DecisionTables.toJSON(decisionTable));
    },
    fillWithDefault: function(decisionTable) {
        var fillOneCell = function(ruleName, conditionName) {
            if (decisionTable.cellsDict[ruleName][conditionName] === undefined) {
                decisionTable.cellsDict[ruleName][conditionName] = "-";
                console.log(ruleName, conditionName, decisionTable.cellsDict[ruleName][conditionName]);
            }
        };

        decisionTable.ruleNames.forEach(function(ruleName) {
            decisionTable.conditionNames.forEach(function(conditionName) {
                fillOneCell(ruleName, conditionName);
            });
            decisionTable.actionNames.forEach(function(actionName) {
                fillOneCell(ruleName, actionName);
            });
        });
    },
    addRule: function(decisionTable, ruleName) {
        decisionTable.ruleNames.push(ruleName);
        decisionTable.originalRowIndices.add(ruleName);
        decisionTable.cellsDict[ruleName] = {};
        DecisionTables.fillWithDefault(decisionTable);
        addChangeHistory(decisionTable);
    },
    addCondition: function(decisionTable, conditionName, tables) {
        if (decisionTable.conditionNames.contains(conditionName)) {
            throw new Error("Condition already exists");
        }
        if (decisionTable.actionNames.contains(conditionName)) {
            throw new Error("Action of the same name already exists");
        }
        decisionTable.conditionNames.push(conditionName);
        decisionTable.cellsDict[conditionName] = [];
        if (hasCycle(tables, function(table) {
                return tables[table.name].conditionNames.concat(tables[table.name].actionNames);
            })) {
            decisionTable.conditionNames.remove(conditionName);
            delete decisionTable.cellsDict[conditionName];
            alert("That condition name would create an infinite loop in the name structure.");
        }

        DecisionTables.fillWithDefault(decisionTable);
        addChangeHistory(decisionTable);
    },
    addAction: function(decisionTable, actionName, tables) {
        if (decisionTable.actionNames.contains(actionName)) {
            throw new Error("Action already exists");
        }
        if (decisionTable.conditionNames.contains(actionName)) {
            throw new Error("Condition of the same name already exists");
        }
        decisionTable.actionNames.push(actionName);
        decisionTable.cellsDict[actionName] = [];
        if (hasCycle(tables, function(table) {
                return tables[table.name].conditionNames.concat(tables[table.name].actionNames);
            })) {
            decisionTable.conditionNames.remove(actionName);
            delete decisionTable.cellsDict[actionName];
            alert("That action name would create an infinite loop in the name structure.");
        }
        DecisionTables.fillWithDefault(decisionTable);
        addChangeHistory(decisionTable);
    },
    deleteRule: function(decisionTable, ruleName) {
        decisionTable.ruleNames.remove(ruleName);
        delete decisionTable.cellsDict[ruleName];
        addChangeHistory(decisionTable);
    },
    deleteColumn: function(decisionTable, columnName) {
        var ruleName = "";
        decisionTable.conditionNames.remove(columnName); //helper function
        decisionTable.actionNames.remove(columnName); //helper function
        for (ruleName in decisionTable.cellsDict) {
            delete decisionTable.cellsDict[ruleName][columnName];
        }
        delete decisionTable.colDict[columnName];
        addChangeHistory(decisionTable);
    },
    changeRuleName: function(decisionTable, oldRuleName, newRuleName) {
        var cellsDict = decisionTable.cellsDict;

        decisionTable.ruleNames.replaceAll(oldRuleName, newRuleName); //helper. since rulenames are unique, replaceAll can be used (instead of replaceOne);

        cellsDict[newRuleName] = cellsDict[oldRuleName];
        delete cellsDict[oldRuleName];
        addChangeHistory(decisionTable);
    },
    changeColumnName: function(decisionTable, oldColumnName, newColumnName) {
        var cellsDict = decisionTable.cellsDict,
            ruleName = "";

        decisionTable.conditionNames.replaceAll(oldColumnName, newColumnName); //helper. since columnNames are unique, replaceAll can be used (instead of replaceOne);
        decisionTable.actionNames.replaceAll(oldColumnName, newColumnName); //helper. since columnNames are unique, replaceAll can be used (instead of replaceOne);

        for (ruleName in cellsDict) {
            cellsDict[ruleName][newColumnName] = cellsDict[ruleName][oldColumnName];
            delete cellsDict[ruleName][oldColumnName];
        }
        decisionTable.colDict[newColumnName] = decisionTable.colDict[oldColumnName];
        delete decisionTable.colDict[oldColumnName];
        addChangeHistory(decisionTable);
    },
    restoreRuleOrder: function(decisionTable) {
        decisionTable.ruleNames.sort(function(r1, r2) {
            return decisionTable.originalRowIndices[r1] - decisionTable.originalRowIndices[r2];
        });
        addChangeHistory(decisionTable);
    }
};

/**
 * An implementation of a doubly-linked tree. Each node has a value, an array of child nodes, and a reference to its parent node.
 * As a result, care must be taken to serialize nodes with JSON. Use the Nodes object, which has toJSON and fromJSON methods.
 * Also, adding children must be done in a specific way, so do not add elements to the children array yourself; use the addChildNode or addLeaf methods instead.
 * @param {[type]} value    [description]
 * @param {[type]} parent   [description]
 */
function Node(value, parent) {
    this.value = value;
    this.childNodes = [];
    this.children = this.childNodes;
    this.parent = parent;

    var thisNode = this;

    this.isRoot = function() {
        return this.parent === undefined;
    };

    this.hasParent = function() {
        return !this.isRoot();
    };

    this.isLeaf = function() {
        return this.childNodes.length === 0;
    };

    this.addChild = function(node) {
        node.parent = this;
        this.childNodes.push(node);

        return function() {
            return thisNode.deleteChild(node);
        };
    };

    this.addChildNode = function(node) {
        node.parent = thisNode;
        this.childNodes.push(node);
        return this;
    };
    this.addLeaf = function(value) {
        return this.addChildNode(new Node(value, [], this));
    };

    this.deleteChild = function(node) {
        this.childNodes.remove(node);
        return function() {
            return thisNode.addChild(node);
        };
    };

    this.getRoot = function() {
        if (this.isRoot()) {
            return this;
        }
        return this.parent.getRoot();
    };

    this.containsNode = function(node) {
        if (node === this) {
            return true;
        }
        for (var i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i].containsNode(node)) {
                return true;
            }
        }
        return false;
    };

    this.forEach = function(callback) {
        callback(this);
        for (var i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].forEach(callback);
        }
        return this;
    };

    this.map = function(callback) {
        var newNode = callback(this);
        for (var i = 0; i < this.childNodes.length; i++) {
            newNode.addChildNode(this.childNodes[i].map(callback));
        }
        return newNode;
    }
}

var Nodes = {
    toJSON: function(node, valueKey, childrenKey) {
        var nodeObj = Nodes.toSinglyLinkedObject(node, valueKey, childrenKey);
        return JSON.stringify(nodeObj);
    },
    fromJSON: function(jsonNode, valueKey, childrenKey) {
        var nodeObj = JSON.parse(jsonNode);
        return Nodes.fromSinglyLinkedObject(nodeObj, valueKey, childrenKey);
    },
    toSinglyLinkedObject: function(node, valueKey, childrenKey, excludeEmptyChildren) {
        if (!valueKey) {
            valueKey = "value";
        }
        if (!childrenKey) {
            childrenKey = "children";
        }
        var obj = {};
        obj[valueKey] = node.value;
        if (!(node.childNodes.length === 0 && excludeEmptyChildren)) {
            obj[childrenKey] = node.childNodes.map(function(child) {
                return Nodes.toSinglyLinkedObject(child, valueKey, childrenKey, excludeEmptyChildren);
            });
        }
        return obj;
    },
    fromSinglyLinkedObject: function(nodeObj, valueKey, childrenKey) {
        if (!valueKey) {
            valueKey = "value";
        }
        if (!childrenKey) {
            childrenKey = "children";
        }
        var node = new Node(nodeObj[valueKey]);
        if (nodeObj[childrenKey]) {
            nodeObj[childrenKey].forEach(function(child) {
                node.addChildNode(Nodes.fromSinglyLinkedObject(child, valueKey, childrenKey));
            });
        }

        return node;
    },
    deepCopy: function(node, valueCopy) {
        if (!valueCopy) {
            valueCopy = function(v) {
                return v;
            };
        }

        var nodeCopy = new Node(valueCopy(node.value));

        for (var i = 0; i < node.childNodes.length; i++) {
            nodeCopy.addChildNode(Nodes.deepCopy(node.childNodes[i], valueCopy));
        }
        return nodeCopy;
    },
    deepEquals: function(node1, node2, valueEquals) {
        if (!valueEquals) {
            valueEquals = function(v1, v2) {
                return v1 === v2;
            };
        }
        if (!valueEquals(node1.value, node2.value) || node1.children.length !== node2.children.length) {
            return false;
        }
        for (var i = 0; i < node1.childNodes.length; i++) {
            if (!Nodes.deepEquals(node1.childNodes[i], node2.childNodes[i])) {
                return false;
            }
        }
        return true;
    }
};


(function nodesTests() {
    var testNode = new Node('foo')
        .addChildNode(new Node("all")
            .addLeaf('bar')
            .addLeaf('derp'));

    var testNode2 = new Node('foo')
        .addChildNode(new Node("all")
            .addLeaf('bar')
            .addLeaf('derp'));

    console.log(Nodes.deepEquals(testNode, testNode2));

    console.log(Nodes.deepEquals(testNode, Nodes.deepCopy(testNode)));

});

function DragInfo(obj, onDrop, validTargets, validateTarget) {
    this.obj = obj;
    this.onDrop = onDrop;
    this.validTargets = validTargets;

    this.isValidTarget = function(candidate) {
        var result = true;
        if (validateTarget) {
            result &= validateTarget(candidate);
        }
        return result && candidate !== this.obj && this.validTargets.indexOf(candidate) !== -1;
    };
}

function UndoRedo(initialState, deepCopy, equals) {
    var current,
        undos = [],
        redos = [];

    if (!deepCopy) {
        deepCopy = angular.copy;
    }

    if (!equals) {
        equals = function(state1, state2) {
            return state1 === state2;
        };
    }
    current = deepCopy(initialState);

    function firstUndo() {
        if (undos.length > 0) {
            return undos[0];
        }
        return null;
    }

    this.saveState = function(state) {
        if (!equals(state, current)) {
            undos.unshift(current);
            current = deepCopy(state);
            redos = [];
        }
    };

    this.canUndo = function() {
        return undos.length > 0; // && !first;
    };

    this.undo = function() {
        if (this.canUndo()) {
            redos.unshift(current);
            current = undos.shift();
            return deepCopy(current);
        } else {
            throw new Error("Can't undo!");
        }
    };

    this.canRedo = function() {
        return redos.length > 0;
    };

    this.redo = function() {
        if (this.canRedo()) {
            undos.unshift(current);
            current = redos.shift();
            return deepCopy(current);
        } else {
            throw new Error("Can't redo!");
        }
    };

    this.print = function() {
        console.log(undos, current, redos);
    };
}

function CommandUndoRedo() {
    var undos = [],
        redos = [];

    this.saveAction = function(reaction) {
        if (typeof reaction !== "function") {
            throw new TypeError("Return type of action must be a function");
        }
        undos.unshift(reaction);
        redos = [];
    };

    this.canUndo = function() {
        return undos.length > 0;
    };

    this.undo = function() {
        if (this.canUndo()) {
            var reaction = undos.shift();
            redos.unshift(reaction());
        } else {
            throw new Error("Can't undo!");
        }
    };

    this.canRedo = function() {
        return redos.length > 0;
    };

    this.redo = function() {
        if (this.canRedo()) {
            var action = redos.shift();
            undos.unshift(action());
        } else {
            throw new Error("Can't undo!");
        }
    };
}

function AngularWatcher(obj) {

    var thisObj = this;

    var oldValues = {};

    function copyValues(from, to) {
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = from[key];
            }
        }
        for (key in to) {
            if (to.hasOwnProperty(key)) {
                if (from[key] === undefined) {
                    delete to[key];
                }
            }
        }
        return to;
    }

    function valuesEqual(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
            return false;
        }
        for (var key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }
        }
        return true;
    }

    copyValues(obj, oldValues);

    this.stateChanged = function() {
        return !valuesEqual(obj, oldValues);
    };

    this.saveState = function() {
        var prevState = copyValues(oldValues, {});
        copyValues(obj, oldValues);
        return function() {
            copyValues(prevState, obj);
            return thisObj.saveState();
        };
    };
}

function DeepWatcher(obj) {

    var thisObj = this;

    var oldValues = {};

    function assert(bool) {
        if (!bool) {
            throw new Error('assertion error');
        }
    }

    function copyArray(from, to) {
        assert(from instanceof Array);
        if (!(to instanceof Array)) {
            to = [];
        }

        for (var i = 0; i < from.length; i++) {
            to[i] = copyValues(from[i], to[i]);
        }

        if (to.length > from.length) {
            to.splice(to.length - 1, to.length);
        }

        return to;
    }

    function copyObject(from, to) {
        assert(typeof from === 'object');
        if (from.name === 'Conditions') {
            console.log(from, to);
        }
        if (typeof to !== 'object') {
            to = {};
        }
        var key;
        for (key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = copyValues(from[key], to[key]);
            }
        }
        // for (key in to) {
        //     if (to.hasOwnProperty(key) && !from.hasOwnProperty(key)) {
        //         delete to[key];
        //     }
        // }
        return to;
    }

    function copyValues(from, to) {
        if (from instanceof Array) {
            return copyArray(from, to);
        } else if (from instanceof String) {
            to = from;
            return to;
        } else if (from instanceof Number) {
            to = from;
            return to;
        } else if (typeof from === 'object') {
            return copyObject(from, to);
        } else {
            return from;
        }
    }

    function valuesEqual(obj1, obj2) {
        if (typeof obj1 === 'object' && typeof obj2 === 'object') {
            for (var key in obj1) {
                if (key !== '$$hashKey' && obj1.hasOwnProperty(key)) {
                    if (!valuesEqual(obj1[key], obj2[key])) {
                        return false;
                    }
                }
            }
            for (key in obj2) {
                if (key !== '$$hashKey' && obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        } else {
            return obj1 === obj2;
        }
    }

    copyValues(obj, oldValues);

    this.stateChanged = function() {
        return !valuesEqual(obj, oldValues);
    };

    this.saveState = function() {
        var prevState = copyValues(oldValues, {});
        copyValues(obj, oldValues);
        return function() {
            copyValues(prevState, obj);
            return thisObj.saveState();
        };
    };
}

var operatorFunctions = {
    '&&': function(v1, v2) {
        return v1 && v2;
    },
    '||': function(v1, v2) {
        return v1 || v2;
    },
    '=': function(v1, v2) {
        return v1 === v2;
    },
    '==': function(v1, v2) {
        return v1 === v2;
    },
    '===': function(v1, v2) {
        return v1 === v2;
    },
    '!=': function(v1, v2) {
        return v1 !== v2;
    },
    '!==': function(v1, v2) {
        return v1 !== v2;
    }
};

/**
 * Create an object
 * @param {string} name
 * @param {AttributeCreator array} attributes
 * @returns {ObjectCreator}
 */
function ObjectCreator(name, attributes) {
    this.name = name;
    this.attributes = attributes;

    this.copy = function() {
        return new ObjectCreator(this.name, this.attributes.copy());
    };
};

/**
 * Create an attribute
 * @param {string} name
 * @param {string array} conditionals
 * @returns {AttributeCreator}
 */
function AttributeCreator(name, conditionals) {
    this.name = name;
    this.conditionals = conditionals;

    this.copy = function() {
        return new AttributeCreator(this.name, this.conditionals.copy());
    };
};

//proposal
/**
 * @param {string} name        [description]
 * @param {string} unit        [description]
 */
function Attribute(name, unit) {
    this.name = name;
    this.unit = unit;

    this.copy = function() {
        return new Attribute(this.name, this.unit);
    };
}

/**
 * Create a value
 * @param {string} name
 * @param {string arary} conditionals
 * @returns {ValueCreator}
 * 
 * No Longer Used
 */
function ValueCreator(name, conditionals) {
    this.name = name;
    this.conditionals = conditionals;

    this.copy = function() {
        return new ValueCreator(this.name, this.conditionals.copy());
    };
};

/**
 * Create a rule with a rule name, list of conditions, and list of actions
 * @param {string} name
 * @param {ConditionCreator array} conditions
 * @param {ActionCreator array} actions
 * @returns {RuleCreator}
 */
function RuleCreator(name, conditions, actions) {
    this.name = name;
    this.conditions = conditions;
    this.actions = actions;

    this.copy = function() {
        return new RuleCreator(this.name, this.conditions.copy(), this.actions.copy());
    };
};


/**
 * Create a condition, with name, given object, attribute, vlaue, and conditional
 * @param {ObjectCreator} object
 * @param {AttributeCreator} attribute
 * @param {ValueCreator} value
 * @param {string} conditional
 * @returns {ConditionCreator}
 */
function ConditionCreator(object, attribute, conditional, value) {
    this.object = object;
    this.attribute = attribute;
    this.conditional = conditional;
    this.value = value;

    /**
     * Overrides the toString method in order to display the same way in both the itunes tree and the d3 tree.
     * @return {string} a string representation of this condition.
     */
    this.toString = function() {
        return this.object.name + ": " + this.attribute.name + " " + this.conditional + " " + this.value;
    };

    this.copy = function() {
        return new ConditionCreator(this.object.copy(), this.attribute.copy(), this.conditional, this.value);
    };

};

//proposal
/**
 * @param {ObjectCreator} object      [description]
 * @param {Attribute} attribute   [description]
 * @param {number} value       [description]
 * @param {string} conditional [description]
 */
function Condition(object, attribute, value, conditional) {
    this.object = object;
    this.attribute = attribute;
    this.value = value;
    this.conditional = conditional;

    this.toString = function() {
        return this.object.name + ": " + this.attribute.name + " " + this.conditional + " " + this.value + " " + this.attribute.unit;
    };
};



function FunctionForConditionCreator(name, func) {
    return new ConditionCreator(new ObjectCreator(name, []), new AttributeCreator("", []), new ValueCreator(func, []), "");
};

function FunctionCreator(name, argList, formula) {
    this.name = name;
    this.argList = argList;
    this.formula = formula;
};


/**
 * Create a result/action given name and object, attribute, and value
 * @param {ObjectCreator} object
 * @param {AttributeCreator} attribute
 * @param {ValueCreator} value
 * @returns {ActionCreator}
 */
function ActionCreator(object, attribute, value) {
    this.object = object;
    this.attribute = attribute;
    this.value = value;

    this.toString = function() {
        return this.object.name + ": " + this.attribute.name + " is " + this.value;
    };
}