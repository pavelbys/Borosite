if (!Array.prototype.remove) {
    Array.prototype.remove = function(elt) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === elt) {
                this.splice(i, 1);
            }
        }
        return this;
    };
}

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
}

(function addNodePrototypeMethods() {
    Node.prototype.isRoot = function() {
        return this.parent === undefined;
    };
    Node.prototype.hasParent = function() {
        return !this.isRoot();
    };
    Node.prototype.isLeaf = function() {
        return this.childNodes.length === 0;
    };
    Node.prototype.addChild = function(node) {
        node.parent = this;
        this.childNodes.push(node);
        var thisNode = this;
        return function() {
            return thisNode.deleteChild(node);
        };
    };

    Node.prototype.addChildNode = function(node) {
        node.parent = this;
        this.childNodes.push(node);
        return this;
    };
    Node.prototype.addLeaf = function(value) {
        return this.addChildNode(new Node(value, [], this));
    };

    Node.prototype.deleteChild = function(node) {
        this.childNodes.remove(node);
        var thisNode = this;
        return function() {
            return thisNode.addChild(node);
        };
    };

    Node.prototype.getRoot = function() {
        if (this.isRoot()) {
            return this;
        }
        return this.parent.getRoot();
    };

    Node.prototype.containsNode = function(node) {
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

    Node.prototype.forEach = function(callback) {
        callback(this);
        for (var i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].forEach(callback);
        }
        return this;
    };

    Node.prototype.map = function(callback) {
        var newNode = callback(this);
        for (var i = 0; i < this.childNodes.length; i++) {
            newNode.addChildNode(this.childNodes[i].map(callback));
        }
        return newNode;
    };

})();
