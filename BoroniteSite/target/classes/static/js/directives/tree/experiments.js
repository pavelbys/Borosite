


function BooleanType(name, conditionOptions, mathOptions, invalid, toNumber, fromNumber) {
    this.name = name;
    this.conditionOptions = conditionOptions;
    this.mathOptions = mathOptions;

    this.invalid = invalid || function () {
        return false
    };

    this.operators = {};
    var thisType = this;

    conditionOptions.forEach(function (option) {
        thisType.operators[option.operator] = function (v1, v2) {
            return fromNumber(option.test(toNumber(v1), toNumber(v2)));
        };
    });

    mathOptions.forEach(function (option) {
        thisType.operators[option] = function (v1, v2) {
            return fromNumber(mathOperators[options](toNumber(v1), toNumber(v2)));
        };
    });

}
BooleanType.prototype.add = function (v1, v2) {
    if (v1.add) {
        return v1.add(v2);
    }
    return v1 + v2;
}

function BooleanData(root, type, input, options) {
    this.root = root;
    this.type = type;
    this.input = input;
    this.options = options;
}

var dropdownExample = new BooleanData(
        scope.testRoot,
        new BooleanType('dropdown', conditionOptions.slice(0, 2), [], false),
        'person', ['employed', 'unemployed', 'self employed']
        );

var numberExample = new BooleanData(
        scope.testRoot,
        new BooleanType('text', conditionOptions, Object.keys(mathOperators), function (string) {
            if (isNaN(string)) {
                return 'must be a number';
            }
            return false;
        }, function (string) {
            return parseFloat(string);
        }, function (number) {
            return number.toString();
        }),
        'number', []
        );

var dateExample = new BooleanData(
        scope.testRoot,
        new BooleanType('text', conditionOptions, ['+', '-'], function (string) {
            if (!DtDate.isDate(string)) {
                return 'invalid format';
            }
            return false;
        }, function (string) {
            return DtDate.toComparableNumber(string);
        }, function (number) {
            return DtDate.fromComparableNumber(number);
        }),
        new DtDate(7, 8, 2015), []
        );



// scope.booleanData = {
//     root: scope.testRoot,
//     type: new BooleanType('number', conditionOptions),
//     inputValue: 0,
//     valueRestrictions: []
// };

// dropdown example
// scope.testRoot.conditionType = 'text';
// scope.testRoot.conditionOptions = conditionOptions.slice(0, 2);
// scope.testRoot.valueOptions = ['employed', 'unemployed', 'self employed'];
// scope.testRoot.template = 'employed';
// scope.testRoot.conditionValue = 'employed';

// number example
scope.testRoot.conditionType = 'number';
scope.testRoot.conditionOptions = conditionOptions;
scope.testRoot.template = 0;
scope.testRoot.conditionValue = 0;

// date example
// scope.testRoot.conditionType = 'date';
// scope.testRoot.conditionOptions = conditionOptions;
// scope.testRoot.template = new DtDate(7, 7, 2015);
// scope.testRoot.conditionValue = scope.testRoot.template.copy();