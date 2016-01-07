BoroniteApp.factory('bnLogo', ['svgUtils', function(svgUtils) {
	'use strict';

	function makeHexagon(center, edge) {
		var incr = Math.PI / 3;

		return new svgUtils.Path()
			.moveTo(center.x, center.y)
			.addMove(edge, 4 * incr)
			.addLine(edge, 0 * incr)
			.addLine(edge, 1 * incr)
			.addLine(edge, 2 * incr)
			.addLine(edge, 3 * incr)
			.addLine(edge, 4 * incr)
			.addLine(edge, 5 * incr)
			.closePath();
	}

	var center = new svgUtils.Point(0, 0),
		offset = new svgUtils.Point(-12, 0),
		outerHexCutEdge = 47,
		rect = {
			width: 62,
			height: 7
		};



	return {
		outerHex: makeHexagon(center, 60),
		outerHexCut: makeHexagon(offset, outerHexCutEdge),
		innerHex: makeHexagon(center, 40),
		innerHexCut: makeHexagon(offset, 18),
		upperRect: new svgUtils.Path()
			.moveTo(offset.x, offset.y)
			.addMove(outerHexCutEdge, 2 * Math.PI / 3)
			.addLine(rect.width, Math.PI)
			.addLine(rect.height, Math.PI / 2)
			.addLine(rect.width + 4, 0)
			.closePath(),
		lowerRect: new svgUtils.Path('todo'),
		middleRect: new svgUtils.Path('todo')
	};

}]);