/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*jslint white: true */


/*--------------------------------------------------------*
 *                     Array Helpers                      *
 *--------------------------------------------------------*/
//This function calls itself immediately
(function AddHelpersToArrayPrototypeIfTheyDontAlreadyExist() {
    var functions = {
        indexOf: function (element) {
            var i = 0;
            for (i = 0; i < this.length; i++) {
                if (this[i] === element) {
                    return i;
                }
            }
            return -1;
        },
        contains: function (element) {
            return this.indexOf(element) >= 0;
        },
        includes: function (element) {
            return this.indexOf(element) >= 0;
        },
        replaceAll: function (oldVal, newVal) {
            var i = 0;
            for (i = 0; i < this.length; i++) {
                if (this[i] === oldVal) {
                    this[i] = newVal;
                }
            }
            return this;
        },
        remove: function (element) {
            if (this.contains(element)) {
                this.splice(this.indexOf(element), 1);
            }
            return this;
        },
        move: function (from, to) {
            var temp = this[from],
                    i = 0;
            if (from <= to) {
                for (i = from; i < to; i++) {
                    this[i] = this[i + 1];
                }
            } else {
                for (i = from; i > to; i--) {
                    this[i] = this[i - 1];
                }
            }
            this[to] = temp;
            return this;
        },
        moveElts: function (from, to) {
            if (this.includes(from) && this.includes(to)) {
                this.move(this.indexOf(from), this.indexOf(to));
            }
            return this;
        },
        forEach: function (apply) {
            var i = 0;
            for (i = 0; i < this.length; i++) {
                apply(this[i]);
            }
            return this;
        },
        map: function (map) {
            var newArr = [];
            var i = 0;
            for (i = 0; i < this.length; i++) {
                newArr.push(map(this[i]));
            }
            return newArr;
        },
        flatten: function () {
            if (this.length === 0) {
                return [];
            } else {
                if (this[0] instanceof Array) {
                    return this[0].flatten().concat(this.splice(1).flatten());
                } else {
                    return [this[0]].concat(this.splice(1).flatten());
                }
            }
        },
        addUndoableElement: function (element, index) {
            if (index < this.length && index >= 0) {
                this.splice(index, 0, element);
            } else {
                this.push(element);
            }
            var thisArr = this;
            return function () {
                return thisArr.removeRedoableElement(element);
            };
        },
        removeRedoableElement: function (element) {
            var index = Math.max(this.indexOf(element), 0);

            this.remove(element);
            var thisArr = this;
            return function () {
                return thisArr.addUndoableElement(element, index);
            };
        },
        pushAll: function (elements) {
            var i = 0;
            for (i = 0; i < elements.length; i++) {
                this.push(elements[i]);
            }
            return this;
        },
        removeDuplicates: function () {
            var set = {},
                    result = [],
                    i = 0;

            for (i = 0; i < this.length; i++) {
                if (set[this[i]] === undefined) {
                    set[this[i]] = true;
                    result.push(this[i]);
                }
            }
            this.splice(0, this.length + 1);
            for (i = 0; i < result.length; i++) {
                this.push(result[i]);
            }
            return this;
        },
        withDuplicatesRemoved: function () {
            var set = {},
                    newArray = [],
                    i = 0;

            for (i = 0; i < this.length; i++) {
                if (set[this[i]] === undefined) {
                    set[this[i]] = true;
                    newArray.push(this[i]);
                }
            }
            return newArray;
        },
        copy: function (copier) {
            var newArray = [],
                    i = 0;
            for (i = 0; i < this.length; i++) {
                if (typeof copier === "function") {
                    newArray.push(copier(this[i]));
                } else if (typeof this[i].copy === "function") {
                    newArray.push(this[i].copy());
                } else {
                    newArray.push(this[i]);
                }
            }
            return newArray;
        },
        shallowCopy: function () {
            var newArray = [],
                    i = 0;
            for (i = 0; i < this.length; i++) {
                newArray.push(this[i]);
            }
            return newArray;
        },
        deepCopy: function () {
            return JSON.parse(JSON.stringify(this));
        },
        fill: function (value, start, end) {
            start = start || 0;
            end = end || this.length;
            for (var i = start; i < end; i++) {
                this[i] = value;
            }
            return this;
        },
        max: function () {
            if (this.length === 0) {
                return -Infinity;
            }
            var curMax = this[0];
            this.reduce(function (prev, cur) {
                if (cur > prev) {
                    curMax = cur;
                }
                return curMax;
            });
            return curMax;
        }
    };
    for (var key in functions) {
        if (functions.hasOwnProperty(key) && !Array.prototype[key]) {
            Array.prototype[key] = functions[key];
        }
    }
}());


function arrayEquals(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}

function equals(obj1, obj2) {
    if (typeof obj1 === "object" && typeof obj2 === "object") {
        for (var key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if (!obj2.hasOwnProperty(key) || !equals(obj1[key], obj2[key])) {
                    return false;
                }
            }
        }
        return true;
    } else {
        return obj1 === obj2;
    }
}

function copy(obj) {
    if (typeof obj === "object") {
        if (typeof obj.copy === "function") {
            return obj.copy();
        }
        var newObj = new obj.constructor();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = copy(obj[key]);
            }
        }
        return newObj;
    } else {
        return obj;
    }
}

function TestClass(name) {
    this.name = name;
    this.getName = function () {
        return this.name;
    };
}

function assert(bool, msg) {
    if (!bool) {
        throw new Error('assertion failure: ' + msg);
    }
}

/*--------------------------------------------------------*
 *                    String Helpers                      *
 *--------------------------------------------------------*/
/**
 * Compares to strings using the localeCompare method, but converts them to lowercase first.
 * @param {String} str1
 * @param {String} str2
 * @returns {Number} the result of calling localeCompare on the two strings once they have been converted to lower case.
 */
function compareStrings(str1, str2) {
    var newStr1 = str1.toLowerCase();
    var newStr2 = str2.toLowerCase();
    return newStr1.localeCompare(newStr2);
}

function replaceAll(string, substring, replacement) {
    while (string.indexOf(substring) >= 0) {
        string = string.replace(substring, replacement);
    }
    return string;
}

function replaceMany(string, map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            string = replaceAll(string, key, map[key]);
        }
    }
    return string;
}

function replaceManyBack(string, map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            string = replaceAll(string, map[key], key);
        }
    }
    return string;
}

function position(string, substring, replacer, lastIndex) {
    var count = 1;
    var i = string.indexOf(substring);
    while (i >= 0 && i < lastIndex) {
        count++;
        string = string.replace(substring, replacer);
        i = string.indexOf(substring);
    }
    return count;
}


/*--------------------------------------------------------*
 *                 HTML element Helpers                   *
 *--------------------------------------------------------*/
/**
 * Checks if a mouse clicked inside a bounding box.
 * @param  {number}  clickX [description]
 * @param  {number}  clickY [description]
 * @param  {BoundingClientRect}  rect  an object with the properties left, right, top, and bottom of type number. For an html element, this is obtained by calling element.getBoundingClientRect();
 * @return {Boolean} true if the click was inside the bounding box.
 */
// function isWithin(clickX, clickY, rect) {
//     var horizontal = clickX <= rect.right && clickX >= rect.left;
//     var vertical = clickY <= rect.bottom && clickY >= rect.top;
//     return horizontal && vertical;
// }

function isWithin(mouseEvent, clientRect) {
    var horiz = event.clientX >= clientRect.left && event.clientX <= clientRect.right;
    var vert = event.clientY >= clientRect.top && event.clientY <= clientRect.bottom;
    return horiz && vert;
}

function strictWithin(event, rect, tol) {
    if (tol === undefined) {
        tol = 0;
    }
    var horiz = event.clientX > (rect.left + tol) && event.clientX < (rect.right + tol);
    var vert = event.clientY > (rect.top + tol) && event.clientY < (rect.bottom + tol);
    return horiz && vert;
}

/**
 * Traverses an html tree by going down the first branch n times, returning the nth element.
 * @param  {[type]} element the root node of the search
 * @param  {[type]} n       the number of generations to span
 * @return {[type]}         the 0th child n generations down from element
 */
function getNthChildDown(element, n) {
    var curElement = element;
    var i = 0;
    while (curElement && i < n) {
        curElement = curElement.children[0];
        i++;
    }
    if (i === n) {
        return curElement;
    }
    return null;
}


/*--------------------------------------------------------*
 *                     Graph Helpers                      *
 *--------------------------------------------------------*/
/**
 * Check if a node has an incoming edge
 * @param {(string-> string array) dictionary} graph
 * @param {(string-> string array) dictionary} node
 * @returns {Boolean} if there exists incoming edge
 */
function hasIncomingEdge(graph, node) {
    for (var key in graph) {
        var childDict = graph[key];
        for (var childKey in childDict) {
            if (graph[key][childKey] === node) {
                return true;
            }
        }
    }
    return false;
}

/**
 * convert current table set to a graph
 * @param {(string -> table) dictionary} tables
 * @param {function table -> string array} getChildKeys
 * @returns {graph}
 */
function tableToGraph(tables, getChildKeys) {
    var graph = {};
    for (var tableName in tables) {
        if (!(tableName in graph)) {
            graph[tableName] = {};
        }
        var arr = getChildKeys(tables[tableName]);
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] in graph) {
                graph[tableName][arr[i]] = graph[arr[i]];
            } else {
                graph[arr[i]] = {};
                graph[tableName][arr[i]] = graph[arr[i]];
            }
        }
    }
    return graph;
}


/**
 * Takes the current set of tables and a function to extract the column names from a table
 * @param {table dictionary} tables
 * @param {function: table->string array} getChildKeys
 * @returns {Boolean} if cycle exists
 */

function hasCycle(tables, getChildKeys) {

    var graph = tableToGraph(tables, getChildKeys);

    var l = []; //topological ordering
    var s = []; //set of nodes with no incoming edges
    for (var key in graph) {
        if (!hasIncomingEdge(graph, graph[key])) {
            s.push(graph[key]);
        }
    }
    while (s.length > 0) {
        var node = s.pop();
        l.push(node);
        for (var key in node) {
            var linkedNode = node[key];
            delete node[key];
            if (!hasIncomingEdge(graph, linkedNode)) {
                s.push(linkedNode);
            }
        }

    }
    //Next, check for edges in graph => cycle exists
    var key, childKey;
    for (key in graph) {
        var subgraph = graph[key];
        for (childKey in subgraph) {
            if (subgraph.hasOwnProperty(childKey)) {
                return true;
            }
        }
    }
    return false;
}






function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
            textInputRange, len, endRange;

    if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() === el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}


function invertGraph(dict) {
    var inverseDict = {};
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            var i;
            for (i = 0; i < dict[key].length; i++) {
                if (inverseDict[dict[key][i]]) {
                    inverseDict[dict[key[i]]].push(key);
                }
                else {
                    inverseDict[dict[key][i]] = [key];
                }
            }
        }
    }
    return inverseDict;
}

function graphToRandArray(graph) {
    var arr = [];
    var starts = [];
    for (var key in graph) {
        if (!hasIncomingEdge(graph, graph[key])) {
            starts.push(key);
        }
    }
    arr.push(starts[0]);
    var currentNode = starts[0];
    while (graph[currentNode]) {
        currentNode = graph[currentNode][0];
        arr.push(currentNode);
    }
    return arr;
}