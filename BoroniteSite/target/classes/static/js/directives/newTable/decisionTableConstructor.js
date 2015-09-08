function getId(list) {
    if (list.length === 0) {
        return 0;
    }
    return list.map(function (elt) {
        return elt.id;
    }).max() + 1;
}

function DtOptGroup(name, description) {
    this.name = name;
    this.description = description;
    this.options = [];
    this.addOption = function (name, id, description) {
        this.options.push({
            name: name,
            id: id,
            description: description
        });
        return this;
    };
}
var hitPolicyOptionGroups = [
    new DtOptGroup('Single hit', 'only one result will be returned')
            .addOption('Unique', 'U', 'Only a single rule can be matched')
            .addOption('Any', 'A', 'multiple rules can match, but they must all have the same output')
            .addOption('Priority', 'P', 'Multiple rules can match, with different outputs. The output that comes first in the supplied output values list is returned.')
            .addOption('First', 'F', 'return the first match in rule order'),
    new DtOptGroup('Multiple hit', 'a collection of results will be returned')
            .addOption('Collect', 'C', 'return a list of the outputs in arbitrary order')
            .addOption('Rule order', 'R', 'return a list of outputs in rule order')
            .addOption('Output order', 'O', 'return a list of outputs in the order of the output values list'),
    new DtOptGroup('Aggregation', 'results will be combined into an aggregate value')
            .addOption('Sum', 'C+', 'return the sum of the outputs')
            .addOption('Count', 'C#', 'return the count of the outputs')
            .addOption('Minimum', 'C<', 'return the minimum-valued output')
            .addOption('Maximum', 'C>', 'return the maximum-valued output')
];

function DtCategory(name) {
    this.name = name;
    this.classes = [];
}

(function addDtCategoryPrototypeMethods() {

    DtCategory.prototype.addClass = function (name, attributeNames) {
        var thisCategory = this;
        var newClass = new DtClass(name, getId(this.classes), function () {
            return thisCategory;
        });

        attributeNames.forEach(function (name) {
            newClass.addAttribute(name);
        });

        this.classes.push(newClass);

        return this;
    };

    DtCategory.prototype.equals = function (otherCategory) {
        if (this.name !== otherCategory.name || this.classes.length !== otherCategory.classes.length) {
            return false;
        }
        for (var i = 0; i < this.classes.length; i++) {
            if (!this.classes[i].equals(otherCategory.classes[i])) {
                return false;
            }
        }
        return true;
    };

    DtCategory.prototype.toString = function () {
        return this.name;
    };

    DtCategory.prototype.removeClass = function (cLass) {
        this.classes.remove(cLass);
    };

    DtCategory.prototype.removeClassByName = function (className) {
        var i;
        for (i = 0; i < this.classes.length; i++) {
            if (this.classes[i].name === className) {
                this.removeClass(this.classes[i]);
                i--;
            }
        }
    };

})();

function DtClass(name, id, getParent) {
    assert(getParent() instanceof DtCategory, 'getParent must return a DtCategory');

    this.name = name;
    this.id = id;
    this.attributes = [];
    this.getParent = getParent;
}

(function addDtClassPrototypeMethods() {
    DtClass.prototype.addAttribute = function (name) {
        var thisClass = this;
        var newAttribute = new DtAttribute(name, getId(thisClass.attributes), function () {
            return thisClass;
        });
        this.attributes.push(newAttribute);
        return this;
    };

    DtClass.prototype.equals = function (otherClass) {
        if (this.name !== otherClass.name || this.attributes.length !== otherClass.attributes.length) {
            return false;
        }
        for (var i = 0; i < this.attributes.length; i++) {
            if (!this.attributes[i].equals(otherClass.attributes[i])) {
                return false;
            }
        }
        return true;
    };

    DtClass.prototype.getSiblings = function () {
        return this.getParent().classes;
    };

    DtClass.prototype.toString = function () {
        return this.getParent().toString() + '_' + this.id;
    };

    DtClass.prototype.removeAttribute = function (attribute) {
        this.attributes.remove(attribute);
    };
})();

function DtAttribute(name, id, getParent) {
    assert(getParent() instanceof DtClass, 'getParent must return a DtClass');

    this.name = name;
    this.id = id;
    this.getParent = getParent;

}

(function addDtAttributePrototypeMethods() {
    DtAttribute.prototype.getSiblings = function () {
        return this.getParent().attributes;
    };

    DtAttribute.prototype.toString = function () {
        return this.getParent().toString() + '_' + this.id;
    };

    DtAttribute.prototype.equals = function (otherAttr) {
        return this.name === otherAttr.name;
    };
})();

function DtRule(name, id, ownerTable) {
    this.name = name;
    this.id = id;

    this.values = {};
    this.getSiblings = function () {
        return ownerTable.rules;
    };
}

(function addDtRulePrototypeMethods() {
    DtRule.prototype.toString = function () {
        return 'rule_' + this.id;
    };

    DtRule.prototype.equals = function (otherRule, valueEquals) {
        if (this.name !== otherRule.name || this.id !== otherRule.id) {
            return false;
        }
        if (Object.keys(this.values).length !== Object.keys(otherRule.values).length) {
            return false;
        }
        for (var key in this.values) {
            if (this.values.hasOwnProperty(key)) {
                if (!valueEquals(this.values[key], otherRule.values[key])) {
                    return false;
                }
            }
        }
        return true;
    };
})();

function DecisionTable2(name, hitPolicy, conditions, results) {
    this.name = name;
    this.hitPolicy = hitPolicy || hitPolicyOptionGroups[0].options[0];

    this.rules = [];

    this.conditions = conditions || new DtCategory('Conditions');
    this.results = results || new DtCategory('Results');

}

(function addDecisionTablePrototypeMethods() {
    DecisionTable2.prototype.copy = function (valueCopy) {
        valueCopy = valueCopy || function (v) {
            return v;
        };

        var newTable = new DecisionTable2(this.name, this.hitPolicy);

        function attrName(attr) {
            return attr.name;
        }
        this.conditions.classes.forEach(function (c) {
            newTable.addConditionClass(c.name, c.attributes.map(attrName));
        });
        this.results.classes.forEach(function (c) {
            newTable.addResultClass(c.name, c.attributes.map(attrName));
        });
        this.rules.forEach(function (rule) {
            var valuesArray = [];
            for (var key in rule.values) {
                if (rule.values.hasOwnProperty(key)) {
                    valuesArray.push(valueCopy(rule.values[key]));
                }
            }
            newTable.addRule(rule.name, valuesArray);
        });

        return newTable;
    };
    DecisionTable2.prototype.exportToExcel = function () {
        console.log("export started");
        var oExcel = new ActiveXObject("Excel.Application");
        var oBook = oExcel.Workbooks.Add;
        var oSheet = oBook.Worksheets(1);
        oSheet.Cells(1, 1).value = this.name;

        var attributes = this.attributes();
        var classes = this.classes();
        var k, l;
        var kTracker = 2;
        for (l = 0; l < classes.length; l++) {
            for (k = 0; k < classes[l].attributes.length; k++) {
                oSheet.Cells(1, k + kTracker).value = classes[l].name;
                oSheet.Cells(2, k + kTracker).value = classes[l].attributes[k].name;
            }
            kTracker += classes[l].attributes.length;
        }
        var i, j;
        for (i = 0; i < this.rules.length; i++) {
            oSheet.Cells(i + 2, 1).value = this.rules[i].name;
            for (j = 0; j < attributes.length; j++) {
                oSheet.Cells(i + 3, j + 2).value = this.rules[i].values[attributes[j]];
            }
        }
        oExcel.Visible = true;
        oExcel.UserControl = true;
        console.log("export done");
    };
    DecisionTable2.prototype.equals = function (otherTable, valueEquals) {
        valueEquals = valueEquals || function (v1, v2) {
            return v1 === v2;
        };

        if (this.name !== otherTable.name || this.hitPolicy !== otherTable.hitPolicy || this.rules.length !== otherTable.rules.length) {
            return false;
        }

        for (var i = 0; i < this.rules.length; i++) {
            if (!this.rules[i].equals(otherTable.rules[i], valueEquals)) {
                return false;
            }
        }

        return this.conditions.equals(otherTable.conditions) && this.results.equals(otherTable.results);
    };
    DecisionTable2.prototype.addConditionClass = function (name, attributeNames) {
        this.conditions.addClass(name, attributeNames);
        if (hasCycle(newTables, function (table) {
            return table.classes().map(function (cLass) {
                return cLass.name;
            });
        })) {
            alert("Cycle Created!");
            this.conditions.removeClassByName(name);
        }
        return this;
    };
    DecisionTable2.prototype.addResultClass = function (name, attributeNames) {
        this.results.addClass(name, attributeNames);
        if (hasCycle(newTables, function (table) {
            return table.classes().map(function (cLass) {
                return cLass.name;
            });
        })) {
            alert("Cycle Created!");
            this.results.removeClassByName(name);
        }
        return this;
    };
    DecisionTable2.prototype.classes = function () {
        return this.conditions.classes.concat(this.results.classes);
    };

    DecisionTable2.prototype.attributes = function () {
        var attributes = [];
        this.classes().forEach(function (c) {
            attributes.pushAll(c.attributes);
        });
        return attributes;
    };

    DecisionTable2.prototype.conditionsSpan = function () {
        var count = 0;
        this.conditions.classes.forEach(function (c) {
            count += c.attributes.length;
        });
        return count;
    };

    DecisionTable2.prototype.resultsSpan = function () {
        var count = 0;
        this.results.classes.forEach(function (c) {
            count += c.attributes.length;
        });
        return count;
    };

    DecisionTable2.prototype.addRule = function (name, valuesArray) {
        var newRule = new DtRule(name, getId(this.rules), this);
        if (valuesArray.length !== this.attributes().length) {
            throw new Error('need the same number of values as attributes');
        }
        this.attributes().forEach(function (attr, i) {
            newRule.values[attr] = valuesArray[i];
        });
        this.rules.push(newRule);
        return this;
    };

//    DecisionTable2.prototype.addCompleteRule = function(newRule)  {
//        var newRuleForm = new DtRule(newRule.name, getID(this.rules), this);
//        var i;
//        for(i = 0; i < newRule.conditions.length; i++)   {
//            if(this.classes().map(function(cLass){return cLass.name;}).contains(newRule.conditions[i].object.name))  {
//                if(this.attributes().map(function(att){return att.name;}).contains(newRule.conditions[i].attribute.name))    {
//                    newRuleForm.values[newRule.conditions[i].attribute.name] = 
//                            newRule.conditions[i].conditional + newRule.conditions[i].value;
//                }
//                else    {
//                    return 7;
//                }
//            }
//            else    {
//                
//            }
//        }
//        for(i = 0; i < newRule.actions.length; i++) {
//            if
//        }
//        this.rules.push(newRuleForm);
//        this.fillWithDefault();
//    };

    DecisionTable2.prototype.fillWithDefault = function () {
        var i;
        for (i = 0; i < this.rules.length; i++) {
            this.attributes().forEach(function (attr, j) {
                if (!this.rules[i].values[attr]) {
                    this.rules[i].values[attr] = "-";
                }
            }, this);
        }
    };

    DecisionTable2.prototype.hasParentTable = function () {
        for (var key in newTables) {
            if (newTables[key].classes().map(function (cLass) {
                return cLass.name;
            }).contains(this.name)) {
                return true;
            }
        }
        return false;
    };



    DecisionTable2.prototype.getParentTables = function () {
        if (this.hasParentTable()) {
            var parentsDict = {};
            var q = [this.name];
            while (q.length > 0) {
                var thisTableName = q.pop();
                if (!(thisTableName in parentsDict)) {
                    parentsDict[thisTableName] = [];
                }
                for (var key in newTables) {
                    if (newTables[key].classes().map(function (cLass) {
                        return cLass.name;
                    }).contains(thisTableName)) {
                        q.push(key);
                        if (!parentsDict[thisTableName]) {
                            parentsDict[thisTableName] = [key];
                        }
                        else {
                            parentsDict[thisTableName].push(key);
                        }
                    }
                }
            }
            return invertGraph(parentsDict);
        }
        else {
            return null;
        }

    };

})();



function CommandUndoRedo() {
    var undos = [],
            redos = [];

    this.saveAction = function (reaction) {
        if (typeof reaction !== "function") {
            throw new TypeError("Return type of action must be a function");
        }
        undos.unshift(reaction);
        redos = [];
    };

    this.canUndo = function () {
        return undos.length > 0;
    };

    this.undo = function () {
        if (this.canUndo()) {
            var reaction = undos.shift();
            redos.unshift(reaction());
        } else {
            throw new Error("Can't undo!");
        }
    };

    this.canRedo = function () {
        return redos.length > 0;
    };

    this.redo = function () {
        if (this.canRedo()) {
            var action = redos.shift();
            undos.unshift(action());
        } else {
            throw new Error("Can't undo!");
        }
    };
}