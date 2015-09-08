/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jsepEval = function (expression, vars) {
    expression = replaceMany(expression, jsepEval.replace);
    try {
        var parse_tree = jsep(expression);
        return jsepEval.compute(parse_tree, vars);
    } catch (error) {
        return error;
    }
};


jsepEval.compute = function (tree, vars) {
    if (tree.type === 'Literal') {
        return tree.value;
    }

    if (tree.left && tree.right) {
        var leftResult = jsepEval.compute(tree.left, vars);
        var rightResult = jsepEval.compute(tree.right, vars);
        return jsepEval.binaryOp[tree.operator](leftResult, rightResult);
    }
    if (tree.argument) {
        if (tree.argument.elements) {
            var results = tree.argument.elements.map(function (elt) {
                return jsepEval.compute(elt, vars);
            });
            return jsepEval.arrayOp[tree.operator](results);
        }

        var result = jsepEval.compute(tree.argument, vars);
        return jsepEval.unaryOp[tree.operator](result);
    }
    if (tree.type === 'Identifier' && vars) {
        if (tree.name in vars) {
            return vars[tree.name];
        } else {
            throw new Error('undefined variable: ' + tree.name);
        }
    }
    //console.log('weird', tree);
};


jsepEval.binaryOp = {};
jsepEval.unaryOp = {};
jsepEval.arrayOp = {};

jsepEval.replace = {};

jsepEval.extras = {};

jsepEval.addBinaryOp = function (op, precedence, fn) {
    jsep.addBinaryOp(op, precedence);
    jsepEval.binaryOp[op] = fn;
};
jsepEval.addUnaryOp = function (op, fn) {
    jsep.addUnaryOp(op);
    jsepEval.unaryOp[op] = fn;
};
jsepEval.addArrayOp = function (op, fn) {
    jsep.addUnaryOp(op);
    jsepEval.arrayOp[op] = fn;
};

jsepEval.isOp = function (op) {
    return op in jsepEval.binaryOp || op in jsepEval.unaryOp
            || op in jsepEval.arrayOp || op in jsepEval.replace || op in jsepEval.extras;
};


jsepEval.setEqual = function (newOp, existingOp) {
    jsepEval.replace[newOp] = existingOp;
    jsepEval.extras[newOp.trim()] = true;

};

jsepEval.setEqual(' = ', ' === ');
jsepEval.setEqual(' != ', ' !== ');
jsepEval.setEqual('AND', '&&');
jsepEval.setEqual('OR', '||');
jsepEval.setEqual('NOT', '!');

console.log(jsepEval.replace);


jsep.addUnaryOp('@');
jsepEval.setEqual('ONE OF', '@');
jsepEval.setEqual('ONLY ONE', '@');


jsepEval.binaryOp['+'] = function (v1, v2) {
    return v1 + v2;
};
jsepEval.binaryOp['-'] = function (v1, v2) {
    return v1 - v2;
};
jsepEval.binaryOp['*'] = function (v1, v2) {
    return v1 * v2;
};
jsepEval.binaryOp['/'] = function (v1, v2) {
    return v1 / v2;
};
jsepEval.binaryOp['%'] = function (v1, v2) {
    return v1 % v2;
};

jsepEval.binaryOp['&&'] = function (v1, v2) {
    return v1 && v2;
};
jsepEval.binaryOp['||'] = function (v1, v2) {
    return v1 || v2;
};

jsepEval.binaryOp['==='] = function (v1, v2) {
    return v1 === v2;
};

jsepEval.binaryOp['!=='] = function (v1, v2) {
    return v1 !== v2;
};
jsepEval.binaryOp['<'] = function (v1, v2) {
    return v1 < v2;
};
jsepEval.binaryOp['<='] = function (v1, v2) {
    return v1 <= v2;
};
jsepEval.binaryOp['>'] = function (v1, v2) {
    return v1 > v2;
};
jsepEval.binaryOp['>='] = function (v1, v2) {
    return v1 >= v2;
};

jsepEval.unaryOp['!'] = function (v) {
    return !v;
};

jsepEval.unaryOp['-'] = function (v) {
    return -v;
};

jsepEval.arrayOp['@'] = function (args) {
    var result = false;
    for (var i = 0; i < args.length; i++) {
        if (args[i]) {
            if (result) {
                return false;
            }
            result = true;
        }
    }
    return result;
};

for (var key in jsepEval.unaryOp) {
    if (jsepEval.unaryOp.hasOwnProperty(key) && !(key in jsepEval.arrayOp)) {
        jsepEval.arrayOp[key] = function (args) {
            return args.map(function (arg) {
                return jsepEval.unaryOp[key];
            });
        };
    }
}

