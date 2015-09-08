function DecisionTable(name, hitPolicy, conditions, results, rules) {
    this.name = name;
    this.hitPolicy = hitPolicy || 'U';

    this.rules = rules || [];

    var thisTable = this;

    function getId(list) {
        if (list.length === 0) {
            return 0;
        }
        return list.map(function(elt) {
            return elt.id;
        }).max() + 1;
    }

    function Category(name) {
        this.name = name;
        this.classes = [];
        this.toString = function() {
            return this.name;
        };

        var thisCategory = this;

        this.addClass = function(name, attributeNames) {

            var newClass = new DtClass(name, getId(this.classes), [], function() {
                return thisCategory;
            });

            attributeNames.forEach(newClass.addAttribute);

            this.classes.push(newClass);

            return this;
        };
    }

    this.conditions = conditions || new Category('Conditions');
    this.results = results || new Category('Results');

    function assert(bool) {
        if (!bool) {
            throw new Error('assertion failure');
        }
    }

    function DtClass(name, id, attributes, getParent) {
        assert(getParent() instanceof Category);

        this.name = name;
        this.id = id;
        this.attributes = attributes;
        this.getParent = getParent;

        this.getSiblings = function() {
            return this.getParent().classes;
        };

        this.toString = function() {
            return this.getParent().toString() + '_' + this.id;
        };

        var thisClass = this;

        this.addAttribute = function(name) {
            var newAttribute = new Attribute(name, getId(thisClass.attributes), function() {
                return thisClass;
            });
            thisClass.attributes.push(newAttribute);
            return thisClass;
        };
    }

    function Attribute(name, id, getParent) {
        assert(getParent() instanceof DtClass);

        this.name = name;
        this.id = id;
        this.getParent = getParent;
        this.getSiblings = function() {
            return this.getParent().attributes;
        };

        this.toString = function() {
            return this.getParent().toString() + '_' + this.id;
        };
    }

    function Rule(name, id, values) {
        this.name = name;
        this.id = id;

        this.values = values;
        this.getSiblings = function() {
            return thisTable.rules;
        };

        this.toString = function() {
            return 'rule_' + this.id;
        };
    }

    this.addConditionClass = function(name, attributeNames) {
        this.conditions.addClass(name, attributeNames);
        return this;
    };

    this.addResultClass = function(name, attributeNames) {
        this.results.addClass(name, attributeNames);
        return this;
    };

    this.classes = function() {
        return this.conditions.classes.concat(this.results.classes);
    };

    this.attributes = function() {
        var attributes = [];
        this.classes().forEach(function(c) {
            attributes.pushAll(c.attributes);
        });
        return attributes;
    };

    this.addRule = function(name, valuesArray) {
        var thisTable = this;
        var newRule = new Rule(name, getId(this.rules), 'rule', {}, function() {
            return thisTable.rules;
        });
        if (valuesArray.length !== this.attributes().length) {
            throw new Error('need the same number of values as attributes');
        }
        this.attributes().forEach(function(attr, i) {
            newRule.values[attr] = valuesArray[i];
        });
        this.rules.push(newRule);
        return this;
    };

    this.conditionsSpan = function() {
        var count = 0;
        this.conditionClasses.forEach(function(c) {
            count += c.attributes.length;
        });
        return count;
    };

    this.resultsSpan = function() {
        var count = 0;
        this.resultClasses.forEach(function(c) {
            count += c.attributes.length;
        });
        return count;
    };


}