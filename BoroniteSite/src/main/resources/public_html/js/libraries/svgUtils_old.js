/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var svgUtils = svgUtils || {};

svgUtils.Point = (function() {
    function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Point.dist = function(point1, point2) {
        var dx = point2.x - point1.x;
        var dy = point2.y - point1.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    };

    Point.fromJson = function(pointJson) {
        var pointObj = JSON.parse(pointJson);
        return new Point(pointObj.x, pointObj.y);
    };

    Point.prototype.toJson = function() {
        return JSON.stringify(this);
    };

    Point.prototype.copy = function() {
        return new Point(this.x, this.y);
    };
    Point.prototype.distTo = function(point) {
        return Point.dist(this, point);
    };
    Point.prototype.move = function(dx, dy) {
        this.x += (dx || 0);
        this.y += (dy || 0);
        return this;
    };
    return Point;
})();


svgUtils.PointGroup = function(command, points) {
    this.command = command || 'l';
    this.points = points || [];

    // Object.defineProperty(this, 'string', {
    //     get: function() {
    //         var pointsString = '';
    //         for (var i = 0; i < this.points.length; i++) {
    //             pointsString += ' ' + this.points[i].x + ' ' + this.points[i].y;
    //         }
    //         return this.command + pointsString;
    //     }
    // });
};

svgUtils.PointGroup.prototype.getString = function(precision) {
    var pointsString = '';
    for (var i = 0; i < this.points.length; i++) {
        pointsString += ' ' + this.points[i].x.toFixed(precision) + ' ' + this.points[i].y.toFixed(precision);
    }
    return this.command + pointsString;
};

svgUtils.Arc = (function() {

    function Arc(rx, ry, xRotation, largeArcFlag, sweepFlag, x, y, abs) {
        this.rx = rx || 0;
        this.ry = ry || 0;
        this.xRotation = xRotation || 0;
        this.largeArcFlag = largeArcFlag || 0;
        this.sweepFlag = sweepFlag || 0;
        this.x = x || 0;
        this.y = y || 0;
        this.abs = abs;

        // Object.defineProperty(this, 'string', {
        //     get: function() {
        //         return (this.abs ? 'A' : 'a') + [this.rx, this.ry, this.xRotation, this.largeArcFlag, this.sweepFlag, this.x, this.y].join(' ');
        //     }
        // });
    }

    Arc.prototype.getString = function(precision) {
        var points = [this.rx, this.ry, this.xRotation, this.largeArcFlag, this.sweepFlag, this.x, this.y].map(function(point) {
            return point.toFixed(precision);
        });
        return (this.abs ? 'A' : 'a') + points.join(' ');
    };

    Arc.prototype.to = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };

    Arc.prototype.radius = function(rx, ry) {
        this.rx = rx;
        this.ry = ry || rx; //if no second parameter, set both radii equal
        return this;
    };

    Arc.prototype.xRotation = function(xRotation) {
        this.xRotation = xRotation;
        return this;
    };

    Arc.prototype.useLargeArc = function() {
        this.largeArcFlag = 1;
        return this;
    };

    Arc.prototype.useSmallArc = function() {
        this.largeArcFlag = 0;
        return this;
    };

    Arc.prototype.sweep = function() {
        this.sweepFlag = 1;
        return this;
    };

    Arc.prototype.setSweep = function(sweep) {
        if (sweep) {
            this.sweepFlag = 1;
        } else {
            this.sweepFlag = 0;
        }
        return this;
    };

    Arc.prototype.absoluteCoordinates = function() {
        this.abs = true;
        return this;
    };

    return Arc;

})();

svgUtils.Path = (function() {

    function Path(pointGroups, precision) {
        this.startX = null;
        this.startY = null;

        this.curX = 0;
        this.curY = 0;

        this.pointGroups = pointGroups || [];

        this.precision = precision || 2;

        this.string = '';

        // Object.defineProperties(this, {
        // _changed: {
        //     value: false,
        //     writable: true,
        //     configurable: false,
        //     enumerable: false
        // },
        // _string: {
        //     value: '',
        //     writable: true,
        //     configurable: false,
        //     enumerable: false
        // },
        // string: {
        //     get: function() {
        //         if (this._changed) {
        //             this._changed = false;
        //             this._string = '';

        //             for (var i = 0; i < this.pointGroups.length; i++) {
        //                 this._string += this.pointGroups[i].getString(this.precision) + ' ';
        //             }
        //         }
        //         return this._string;
        //     }
        // }
        // });
    }

    Path.prototype.setPrecision = function(precision) {
        this.precision = precision;
    };

    Path.prototype.clear = function() {
        this.startX = null;
        this.startY = null;
        this.curX = 0;
        this.curY = 0;
        // this.pointGroups = [];

        this.string = '';

        // this._changed = true;
        return this;
    };

    Path.prototype.addPointGroup = function(pointGroup) {
        // this._changed = true;
        this.pointGroups.push(pointGroup);
        // this.string = '';
        // for (var i = 0; i < this.pointGroups.length; i++) {
        // this.string += pointGroup.getString(this.precision) + ' ';
        // }
        return this;
    };

    Path.prototype.updateString = function() {
        this.string = '';
        for (var i = 0; i < this.pointGroups.length; i++) {
            this.string += this.pointGroups[i].getString(this.precision) + ' ';
        }
        return this;
    };

    Path.prototype.addCommand = function(command, points, abs) {
        if (abs) {
            command = command.toUpperCase();
        }
        this.pointGroups.push(new svgUtils.PointGroup(command, points));
        return this;
    };

    Path.prototype.setPos = function(x, y, abs) {
        console.assert(x || (x === 0), 'x is undefined');
        console.assert(y || (y === 0), 'y is undefined');

        if (this.startX === null && this.startY === null) {
            this.startX = x;
            this.startY = y;
        }

        if (abs) {
            this.curX = x;
            this.curY = y;
        } else {
            this.curX += x;
            this.curY += y;
        }
        // console.log('is now', this.curX, this.curY);
    };

    Path.prototype.moveTo = function(x, y, abs) {
        this.setPos(x, y, abs);
        return this.addCommand('m', [new svgUtils.Point(x, y)], abs);
    };

    Path.prototype.closePath = function() {
        this.curX = this.startX;
        this.curY = this.startY;
        return this.addCommand('z', [], false).updateString();
    };

    Path.prototype.lineTo = function(x, y, abs) {
        this.setPos(x, y, abs);
        return this.addCommand('l', [new svgUtils.Point(x, y)], abs);
    };

    Path.prototype.curveTo = function(x1, y1, x2, y2, x, y, abs) {
        this.setPos(x, y, abs);
        return this.addCommand('c', [new svgUtils.Point(x1, y1), new svgUtils.Point(x2, y2), new svgUtils.Point(x, y)], abs);
    };
    Path.prototype.smoothCurveTo = function(x2, y2, x, y, abs) {
        this.setPos(x, y, abs);
        return this.addCommand('s', [new svgUtils.Point(x2, y2), new svgUtils.Point(x, y)], abs);
    };

    Path.prototype.stdCurveTo = function(x, y, flatnessX, flatnessY, sweep, abs, debug) {
        var x1, y1, x2, y2;
        x1 = flatnessX;
        y1 = y + flatnessY;
        x2 = x - flatnessX;
        y2 = -flatnessY;

        if (abs) {
            x1 += this.curX;
            y2 += this.curY;
        }
        if (typeof debug === 'object') {
            debug.x1 = x1;
            debug.y1 = y1;
            debug.x2 = x2;
            debug.y2 = y2;
        }

        if (sweep) {
            return this.curveTo(x2, y2, x1, y1, x, y, abs);
        } else {
            return this.curveTo(x1, y1, x2, y2, x, y, abs);
        }
    };

    Path.prototype.quadCurveTo = function(x1, y1, x, y, abs) {
        this.setPos(x, y, abs);
        return this.addCommand('q', [new svgUtils.Point(x1, y1), new svgUtils.Point(x, y)], abs);
    };
    Path.prototype.smoothQuadCurveTo = function(x, y, abs) {
        this.setPos(x, y, abs);
        return this.addCommand('t', [new svgUtils.Point(x, y)], abs);
    };

    Path.prototype.arc = function(rx, ry, xRotation, largeArcFlag, sweepFlag, x, y, abs) {
        this.setPos(x, y, abs);
        this.pointGroups.push(new svgUtils.Arc(rx, ry, xRotation, largeArcFlag, sweepFlag, x, y, abs));
        return this;
    };

    Path.prototype.addArc = function(arc) {
        this.setPos(arc.x, arc.y);
        this.pointGroups.push(arc);
        return this;
    };

    return Path;

})();

svgUtils.Transform = (function() {

    function Transform(transformations) {

        this.transformations = transformations || [];

        Object.defineProperty(this, 'string', {
            get: function() {
                var str = '';
                for (var i = 0; i < this.transformations.length; i++) {
                    str += this.transformations[i].string + ' ';
                }
                return str;
            }
        });
    }

    Transform.prototype.translate = function(dx, dy) {
        this.transformations.push({
            x: dx,
            y: dy || 0,
            get string() {
                return 'translate(' + this.x + ' ' + this.y + ')';
            }
        });
        return this;
    };

    Transform.prototype.scale = function(scaleX, scaleY) {
        this.transformations.push({
            x: scaleX,
            y: scaleY || 0,
            get string() {
                return 'scale(' + this.x + ' ' + this.y + ')';
            }
        });
        return this;
    };

    Transform.prototype.rotate = function(angle, centerX, centerY) {
        this.transformations.push({
            a: angle,
            x: centerX || 0,
            y: centerY || 0,
            get string() {
                return 'rotate(' + this.a + ' ' + this.x + ' ' + this.y + ')';
            }
        });
        return this;
    };

    Transform.prototype.skewX = function(skewX) {
        this.transformations.push({
            x: skewX,
            get string() {
                return 'skewX(' + this.x + ')';
            }
        });
        return this;
    };

    Transform.prototype.skewY = function(skewY) {
        this.transformations.push({
            y: skewY,
            get string() {
                return 'skewY(' + this.y + ')';
            }
        });
        return this;
    };

    return Transform;

})();