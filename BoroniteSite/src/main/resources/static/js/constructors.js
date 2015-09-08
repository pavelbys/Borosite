function getId(list) {
    if (list.length === 0) {
        return 0;
    }
    return list.map(function(elt) {
        return elt.id;
    }).max() + 1;
}

function DtCategory(name) {
    this.name = name;
    this.classes = [];
}

(function addDtCategoryPrototypeMethods() {

    DtCategory.prototype.addClass = function(name, attributeNames) {
        var thisCategory = this;
        var newClass = new DtClass(name, getId(this.classes), function() {
            return thisCategory;
        });

        attributeNames.forEach(function(name) {
            newClass.addAttribute(name);
        });

        this.classes.push(newClass);

        return this;
    };

    DtCategory.prototype.equals = function(otherCategory) {
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

    DtCategory.prototype.toString = function() {
        return this.name;
    };

})();

function DtClass(name, id, getParent) {
    assert(getParent() instanceof DtCategory, 'getParent must return a Category');

    this.name = name;
    this.id = id;
    this.attributes = [];
    this.getParent = getParent;
}

(function addDtClassPrototypeMethods() {
    DtClass.prototype.addAttribute = function(name) {
        var thisClass = this;
        var newAttribute = new DtAttribute(name, getId(thisClass.attributes), function() {
            return thisClass;
        });
        this.attributes.push(newAttribute);
        return this;
    };

    DtClass.prototype.equals = function(otherClass) {
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

    DtClass.prototype.getSiblings = function() {
        return this.getParent().classes;
    };

    DtClass.prototype.toString = function() {
        return this.getParent().toString() + '_' + this.id;
    };
})();

function DtAttribute(name, id, getParent) {
    assert(getParent() instanceof DtClass, 'getParent must return a DtClass');

    this.name = name;
    this.id = id;
    this.getParent = getParent;

}

(function addDtAttributePrototypeMethods() {
    DtAttribute.prototype.getSiblings = function() {
        return this.getParent().attributes;
    };

    DtAttribute.prototype.toString = function() {
        return this.getParent().toString() + '_' + this.id;
    };

    DtAttribute.prototype.equals = function(otherAttr) {
        return this.name === otherAttr.name;
    };
})();

function DtRule(name, id, ownerTable) {
    this.name = name;
    this.id = id;

    this.values = {};
    this.getSiblings = function() {
        return ownerTable.rules;
    };
}

(function addDtRulePrototypeMethods() {
    DtRule.prototype.toString = function() {
        return 'rule_' + this.id;
    };

    DtRule.prototype.equals = function(otherRule, valueEquals) {
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

function DecisionTable(name, hitPolicy, conditions, results) {
    this.name = name;
    this.hitPolicy = hitPolicy || 'U';

    this.rules = [];

    var thisTable = this;

    this.conditions = conditions || new DtCategory('Conditions');
    this.results = results || new DtCategory('Results');

}

(function addDecisionTablePrototypeMethods() {
    DecisionTable.prototype.copy = function(valueCopy) {
        valueCopy = valueCopy || function(v) {
            return v;
        };

        var newTable = new DecisionTable(this.name, this.hitPolicy);

        function attrName(attr) {
            return attr.name;
        }
        this.conditions.classes.forEach(function(c) {
            newTable.addConditionClass(c.name, c.attributes.map(attrName));
        });
        this.results.classes.forEach(function(c) {
            newTable.addResultClass(c.name, c.attributes.map(attrName));
        });
        this.rules.forEach(function(rule) {
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
    DecisionTable.prototype.equals = function(otherTable, valueEquals) {
        valueEquals = valueEquals || function(v1, v2) {
            return v1 === v2;
        };
        if (otherTable.name !== this.name) {
            return false;
        }

        if (this.name !== otherTable.name || this.hitPolicy !== otherTable.hitPolicy) {
            return false;
        }

        for (var i = 0; i < this.rules.length; i++) {
            if (!this.rules[i].equals(otherTable.rules[i], valueEquals)) {
                return false;
            }
        }

        return this.conditions.equals(otherTable.conditions) && this.results.equals(otherTable.results);
    };
    DecisionTable.prototype.addConditionClass = function(name, attributeNames) {
        this.conditions.addClass(name, attributeNames);
        return this;
    };
    DecisionTable.prototype.addResultClass = function(name, attributeNames) {
        this.results.addClass(name, attributeNames);
        return this;
    };
    DecisionTable.prototype.classes = function() {
        return this.conditions.classes.concat(this.results.classes);
    };

    DecisionTable.prototype.attributes = function() {
        var attributes = [];
        this.classes().forEach(function(c) {
            attributes.pushAll(c.attributes);
        });
        return attributes;
    };

    DecisionTable.prototype.conditionsSpan = function() {
        var count = 0;
        this.conditions.classes.forEach(function(c) {
            count += c.attributes.length;
        });
        return count;
    };

    DecisionTable.prototype.resultsSpan = function() {
        var count = 0;
        this.results.classes.forEach(function(c) {
            count += c.attributes.length;
        });
        return count;
    };

    DecisionTable.prototype.addRule = function(name, valuesArray) {
        var newRule = new DtRule(name, getId(this.rules), this);
        if (valuesArray.length !== this.attributes().length) {
            throw new Error('need the same number of values as attributes');
        }
        this.attributes().forEach(function(attr, i) {
            newRule.values[attr] = valuesArray[i];
        });
        this.rules.push(newRule);
        return this;
    };

})();



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