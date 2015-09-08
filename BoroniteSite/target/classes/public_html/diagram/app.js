var paper = new Raphael(document.getElementById('diagramContainer'), 1000, 1000);
document.getElementById('diagramContainer').addEventListener("dblclick", toggleCollapseChildren, false);
var bpmnCollapsed = false;
var dmnCollapsed = true;
var bpmnClones = [];
var dmnClones = [];
var bpmnChildrenCollapsed = false;
var dmnChildrenCollapsed = false;
function toggleCollapseChildren(e) {
    var collapsed;
    var clickedElement = paper.getElementByPoint(e.clientX, e.clientY);
    if (clickedElement) {
        var containingArr = deepSearch(bpmnNodes, clickedElement) ? bpmnNodes : dmnNodes;
        var cloneArr = containingArr === bpmnNodes ? bpmnClones : dmnClones;
        if (containingArr === bpmnNodes) {
            bpmnChildrenCollapsed = !bpmnChildrenCollapsed;
            collapsed = bpmnChildrenCollapsed;
        } else {
            dmnChildrenCollapsed = !dmnChildrenCollapsed;
            collapsed = dmnChildrenCollapsed;
        }
        for (var i = containingSetIndex(containingArr, clickedElement) + 1; i < containingArr.length; i++) {
            if (collapsed) {
                collapseSet(containingArr[i], cloneArr, clickedElement);
                cloneArr.push(containingArr[i].clone().hide());
            } else {
                cloneArr = unshift(cloneArr, containingSetIndex(containingArr, clickedElement) + 1);
                console.log(containingArr,cloneArr)
                for(var j = 0; j < containingArr[i].length; j++) {
                    containingArr[i][j].animate(cloneArr[i][j].attrs, 250);
                    containingArr[i][j].show();
                }
                cloneArr = reshift(cloneArr, containingSetIndex(containingArr, clickedElement) + 1);
                
            }
        }
        
    }
}


function unshift(arr, by) {
    for(var i = 0; i < by; i++) {
        arr.unshift(0);
    }
    return arr;
}
function reshift(arr, by) {
    arr.splice(0,by);  
    return arr;
}

//<editor-fold desc="BPMN Nodes">
var bpmnNodes = [
    paper.set().push(
            paper.text(100, 300, "Start")
            .attr("font-size", 13)
            ,
            paper.circle(100, 250, 35)
            .attr("fill", "#99FF99")
            ),
    paper.set().push(
            paper.path("M 135 250 l 50 0")
            .attr("arrow-end", "block-wide-long"),
            paper.rect(190, 215, 100, 75)
            .attr("fill", "#E0F0FF"),
            paper.text(240, 250, "Determine Credit\nInterest Start\nDate")
            .attr("font-size", 13)
            ),
    paper.set().push(
            paper.path("M 290 250 l 50 0")
            .attr("arrow-end", "block-wide-long"),
            paper.rect(345, 215, 100, 75)
            .attr("fill", "#E0F0FF"),
            paper.text(395, 250, "Determine Credit\nInterest End\nDate")
            .attr("font-size", 13)
            ),
    paper.set().push(
            paper.path("M 445 250 l 50 0")
            .attr("arrow-end", "block-wide-long"),
            paper.rect(500, 200, 125, 105)
            .attr("fill", "#E0F0FF"),
            paper.text(562, 295, "+")
            .attr("font-size", 30)
            .attr("cursor", "pointer"),
            paper.text(560, 250, "Identify\nTransactions for\nCredit Interest\nCalculation")
            .attr("font-size", 13)
            ),
    paper.set().push(
            paper.path("M 625 250 l 50 0")
            .attr("arrow-end", "block-wide-long"),
            paper.rect(680, 215, 100, 75)
            .attr("fill", "#E0F0FF"),
            paper.text(730, 250, "Caluclate Credit\nInterest")
            .attr("font-size", 13)
            ),
    paper.set().push(
            paper.path("M 780 250 l 50 0")
            .attr("arrow-end", "block-wide-long"),
            paper.circle(870, 250, 35)
            .attr("stroke-width", 3.5)
            .attr("fill", "#FF4D4D"),
            paper.text(870, 300, "End")
            .attr("font-size", 13)
            )
];
//</editor-fold>
//<editor-fold desc="DMN Nodes">
var dmnNodes = [
    paper.set().push(
            paper.rect(375, 500, 150, 75)
            .attr("fill", "#3385FF"),
            paper.text(450, 545, "Transactions for\nCredit Interest\nCalculation")
            .attr("font-size", 13)
            .attr("fill", "white"),
            paper.text(480, 510, "-")
            .attr("font-size", 30)
            .attr("cursor", "pointer")
            .attr("fill", "white")
            ),
    paper.set().push(
            paper.path("M 575 650 l 25 -25 l 140 0 l 0 50 l -25 25 l -140 0 l 0 -50")
            .attr("fill", "#3385FF"),
            paper.text(660, 660, "Refundable Credit\nRules")
            .attr("font-size", 13)
            .attr("fill", "white"),
            paper.text(590, 690, "+")
            .attr("font-size", 30)
            .attr("fill", "white")
            .attr("cursor", "pointer"),
            paper.path("M 575 650 l -75 -75")
            .attr("arrow-end", "block-wide-long")
            .attr("stroke-dasharray", "--")
            ),
    paper.set().push(
            paper.path("M 800 650 q 25 15 50 0 t 50 0 l 0 -75 l -100 0 l 0 75")
            .attr("fill", "#3385FF"),
            paper.text(850, 610, "PRP 460-002")
            .attr("font-size", 13)
            .attr("fill", "white")
            ),
    paper.set().push(
            paper.path("M 800 625 l -60 30")
            .attr("stroke-dasharray", "--")
            .attr("arrow-end", "oval-wide-long")
            )

];
//</editor-fold>
if (window.location.hash.substring(1)) {
    if (window.location.hash.substring(1) === "true") {
        show(bpmnNodes);
        collapseDiagram(dmnNodes, dmnClones, bpmnInitPath, bpmnNodes, 10, 0);
        bpmnCollapsed = false;
        dmnCollapsed = true;
    } else {
        show(dmnNodes);
        collapseDiagram(bpmnNodes, bpmnClones, dmnInitPath, dmnNodes, 20, 0);
        getById(dmnNodes, 20).attr("text", "+");
        bpmnCollapsed = true;
        dmnCollapsed = false;
        getById(bpmnNodes, 10).attr("text", "-");
    }
} else {
    collapseDiagram(dmnNodes, dmnClones, bpmnInitPath, bpmnNodes, 10, 0);
}

getById(bpmnNodes, 10).node.onclick = function () {
    dmnCollapsed = !dmnCollapsed;
    if (dmnCollapsed) {
        getById(bpmnNodes, 10).attr("text", "+");
        collapseDiagram(dmnNodes, dmnClones, bpmnInitPath, bpmnNodes, 10, 250);
    } else {
        getById(bpmnNodes, 10).attr("text", "-");
        expand(dmnNodes, dmnClones, bpmnInitPath, bpmnToDmn, 250);
    }
};

getById(dmnNodes, 23).node.onclick = function () {
    window.location.href = '../index.html';
};

getById(dmnNodes, 20).node.onclick = function () {
    bpmnCollapsed = !bpmnCollapsed;
    if (bpmnCollapsed) {
        getById(dmnNodes, 20).attr("text", "+");
        collapseDiagram(bpmnNodes, bpmnClones, dmnInitPath, dmnNodes, 20, 250);
    } else {
        getById(dmnNodes, 20).attr("text", "-");
        expand(bpmnNodes, bpmnClones, dmnInitPath, dmnToBpmn, 250);
    }
};

function collapseDiagram(nodes, clones, initialPath, buttonArr, buttonId, timeout) {
    var x = getById(buttonArr, buttonId).attrs.x;
    var y = getById(buttonArr, buttonId).attrs.y;
    var p = "M " + x.toString() + " " + y.toString() + " l 0 0";
    nodes.forEach(function (set) {
        clones.push(set.clone().hide());
        set.forEach(function (elem) {
            elem.animate({"width": 0, "height": 0, "x": x, "y": y, "r": 0, "cx": x, "cy": y, "font-size": 0, "path": p}, timeout);
            setTimeout(function () {
                elem.hide();
            }, timeout);
        });
    });
    if (connector) {
        connector.animate({"path": initialPath}, timeout);
        setTimeout(function () {
            connector.hide();
        }, timeout);
    }
    getById(buttonArr, buttonId).attr("text", "+");
}

function collapseSet(set, clones, clickedElem) {
    var destX, destY;
    switch (clickedElem.type) {
        case "rect":
            destX = clickedElem.attrs.x + clickedElem.attrs.width;
            destY = clickedElem.attrs.y + clickedElem.attrs.height / 2;
            break;
        case "circle":
            destX = clickedElem.attrs.cx + clickedElem.attrs.r;
            destY = clickedElem.attrs.cy;
            break;
        case "text":
            destX = clickedElem.attrs.x;
            destY = clickedElem.attrs.y;
            break;
        default:
            destX = clickedElem.attrs.path[0][1];
            destY = clickedElem.attrs.path[0][2];

    }

    var p = "M " + destX + " " + destY + " l 0 0";
    set.forEach(function (elem) {
        elem.animate({"width": 0, "height": 0, "x": destX, "y": destY, "r": 0, "cx": destX, "cy": destY, "font-size": 0, "path": p}, 250);
        setTimeout(function () {
            elem.hide();
        }, 250);
    });
}

function expandset(set, startIndex, clones, clickedElem) {
    
}


function expand(nodes, clones, initialPath, newPath, timeout) {
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < nodes[i].items.length; j++) {
            nodes[i][j].animate(clones[i][j].attrs, timeout);
            nodes[i][j].show();
        }
    }

    connector.attrs.path = initialPath;
    connector.animate({"path": newPath}, 250);
    connector.show();
}

function hide(arr) {
    arr.forEach(function (elem) {
        elem.hide();
    });
}
function show(arr) {
    arr.forEach(function (elem) {
        elem.show();
    });
}

function getById(arr, id) {
    var matchingElement = null;
    arr.forEach(function (set) {
        set.forEach(function (elem) {
            if (elem.id === id) {
                matchingElement = elem;
            }
        });
    });
    return matchingElement;
}

function deepSearch(arr, item) {
    var found = false;
    arr.forEach(function (set) {
        set.forEach(function (elem) {
            if (elem === item) {
                found = true;
            }
        });
    });
    return found;
}

function countNodes(arr) {
    var count = 0;
    arr.forEach(function (set) {
        set.forEach(function (elem) {
            count++;
        });
    });
    return count;
}

function containingSetIndex(arr, elem) {
    var contSetIndex = 0;
    var tracker = 0;
    arr.forEach(function (set) {
        set.forEach(function (e) {
            if (e === elem) {
                contSetIndex = tracker;
            }
        });
        tracker++;
    });
    return contSetIndex;
}

var bpmnInitPath = "M 562 300 l 0 0";
var dmnInitPath = "M 480 510 l 0 0";
var bpmnToDmn = "M 562 300 l -75 200";
var dmnToBpmn = "M 480 510 l 75 -200";
var connector = paper.path()
        .attr("stroke-dasharray", "--")
        .hide();
