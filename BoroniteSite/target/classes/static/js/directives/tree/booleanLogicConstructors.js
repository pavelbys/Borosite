function Variable(key, value) {
    this.key = key;
    this.value = value;
}

function DtDate(month, day, year) {
    this.month = month;
    this.day = day;
    this.year = year;
}

DtDate.prototype.toString = function () {
    var month = this.month.toString(),
            day = this.day.toString(),
            year = this.year.toString();
    if (this.month < 10) {
        month = '0' + month;
    }
    if (this.day < 10) {
        day = '0' + day;
    }
    while (year.length < 4) {
        year = '0' + year;
    }

    return month + '/' + day + '/' + year;
};
DtDate.isDate = function (string) {
    var arr = string.split('/');
    if (arr.length !== 3) {
        return false;
    }
    for (var i = 0; i < 3; i++) {
        if (isNaN(arr[i]) || parseInt(arr[i]) < 0) {
            return false;
        }
    }
    return arr[0].length === 2 && arr[1].length === 2 && arr[2].length === 4;

};
DtDate.fromString = function (string) {
    if (!DtDate.isDate(string)) {
        throw new Error('improper format');
    }
    var arr = string.split('/').map(function (str) {
        return parseInt(str);
    });
    return new DtDate(arr[0], arr[1], arr[2]);
};
DtDate.prototype.compareTo = function (otherDate) {
    var result = this.year - otherDate.year;
    if (result === 0) {
        result = this.month - otherDate.month;
    }
    if (result === 0) {
        result = this.day - otherDate.day;
    }
    return result;

};

DtDate.prototype.isValid = function () {
    return this.month > 0 && this.month <= 12 && this.day > 0 && this.day <= 31 && this.year > 0;
};

DtDate.prototype.copy = function () {
    return new DtDate(this.month, this.day, this.year);
};

DtDate.toComparableNumber = function (string) {
    var dtDate = DtDate.fromString(string);
    return dtDate.year * 10000 + dtDate.month * 100 + dtDate.day;
};

DtDate.fromComparableNumber = function (number) {
    var string = number.toString();
    while (string.length < 8) {
        string = '0' + string;
    }
    var year = parseInt(string.slice(0, 4));
    var month = parseInt(string.slice(4, 6));
    var day = parseInt(string.slice(6, 8));
    return new DtDate(month, day, year);
};

function InputOutput(input, output) {
    this.input = input;
    this.output = output;
}

/**
 * [Branch description]
 * @param {[type]} name     [description]
 * @param {[type]} operator [description]
 * @param {[type]} prefix   [description]
 * @param {function} test (array[boolean] -> boolean)
 */
function Branch(name, operator, prefix, suffix, group, test) {
    this.name = name;
    this.operator = operator;
    this.prefix = prefix;
    this.suffix = suffix;
    this.group = group;
    this.test = test;
}

Branch.prototype.makeString = function (conditions) {
    var string = conditions.join(this.operator);
    if (conditions.length > 1 && this.group) {
        string = '(' + string + ')';
    }
    string = this.prefix + string + this.suffix;

    return string;
};

Branch.prototype.copy = function () {
    return new Branch(this.name, this.operator, this.prefix, this.test);
};

var branchOptions = [
    new Branch('any', ' OR ', '', '', true, function (bools) {
        for (var i = 0; i < bools.length; i++) {
            if (bools[i]) {
                return true;
            }
        }
        return false;
    }),
    new Branch('all', ' AND ', '', '', true, function (bools) {
        for (var i = 0; i < bools.length; i++) {
            if (!bools[i]) {
                return false;
            }
        }
        return true;
    }),
    new Branch('none', ' OR ', 'NOT(', ')', true, function (bools) {
        for (var i = 0; i < bools.length; i++) {
            if (bools[i]) {
                return false;
            }
        }
        return true;
    }),
    new Branch('only one', ', ', 'ONLY ONE [', ']', false, function (bools) {
        var onlyOne = false;
        for (var i = 0; i < bools.length; i++) {
            if (bools[i]) {
                if (onlyOne) {
                    return false;
                }
                onlyOne = true;
            }
        }
        return onlyOne;
    })
];

/**
 * [Condition description]
 * @param {[type]} name     [description]
 * @param {[type]} operator [description]
 * @param {[type]} value    [description]
 * @param {function} test (v1, v2 -> boolean)
 */
function Condition(name) {
    this.name = name;
}
Condition.prototype.makeString = function (v1, v2) {
    return v1.toString() + ' ' + this.operator + ' ' + v2.toString();
};

Condition.prototype.copy = function () {
    return new Condition(this.name, this.operator, this.test);
};
