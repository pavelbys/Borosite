var Boronite = Boronite || {};


Boronite.MenuItem = function(name, templateUrl, directive, text) {
	this.name = name;
	this.templateUrl = templateUrl;
	this.directive = directive;
	this.text = text;
};

Boronite.menuItems = [
	new Boronite.MenuItem('Home', 'home.html', 'bn-home', 'Some text for home'),
	new Boronite.MenuItem('Our Team', 'ourTeam.html', 'bn-our-team', 'A description of our team'),
	new Boronite.MenuItem('About BNNTs', 'about.html', 'bn-about', 'More information about Boronite'),
	new Boronite.MenuItem('Contact Us', 'contactUs.html', 'bn-contact-us', 'A form for contacting us')
];


Boronite.appDiv = $('#appDiv');

Boronite.menuItems.forEach(function(menuItem) {
	var script = '<script type="text/ng-template" id="' + menuItem.directive + '">';
	script += '<div class="' + menuItem.directive + '"></div>';
	script += '</script>';
	Boronite.appDiv.append(script);
});


Boronite.app = angular.module('BoroniteApp', []);

Boronite.app.controller('BoroniteCtrl', function($scope) {
	$scope.menuItems = Boronite.menuItems;
	$scope.selectedMenuItem = $scope.menuItems[0];

	$scope.test = 'this is a test';

	$scope.clickedMenuItem = function(item) {
		$scope.selectedMenuItem = item;
	};

	$scope.body = $('body');

});

Boronite.app.directive('bnHome', function() {
	return {
		restrict: 'C',
		templateUrl: 'home.html',
		link: function(scope, element) {
			scope.test = '';

			scope.makeHexagons = function(width, center, numx, numy) {
				var ht = width * 0.87; //approx sqrt(3)
				var dx = width / 2;

				offsetCenter = new svgUtils.Point(center.x - (width * 1.5), center.y - ht);

				scope.hexagon = new svgUtils.Path()
					.moveTo(0, ht)
					.lineTo(dx, -ht)
					.lineTo(width, 0)
					.lineTo(dx, ht)
					.lineTo(-dx, ht)
					.lineTo(-width, 0)
					.closePath();


				var i, j, point1, point2, point3, point4,
					offsetx = 0,
					offsety = 0;

				var row = [offsetCenter];

				for (i = 1; i < numx / 2; i++) {
					offsetx += width * 3;
					point1 = new svgUtils.Point(offsetCenter.x + offsetx, offsetCenter.y);
					point2 = new svgUtils.Point(offsetCenter.x - offsetx, offsetCenter.y);
					row.push(point1, point2);
				}

				scope.points = row;

				function offsetDown(point) {
					return new svgUtils.Point(point.x + offsetx, point.y + offsety);
				}

				function offsetUp(point) {
					return new svgUtils.Point(point.x + offsetx, point.y - offsety);
				}

				for (j = 1; j < numy / 2; j++) {
					offsety += ht;
					if (j % 2 === 0) {
						offsetx = 0;
					} else {
						offsetx = width * 1.5;
					}

					scope.points = scope.points.concat(row.map(offsetDown), row.map(offsetUp));
				}

				return scope.points;

			};

			scope.makeHoneycombDashedLines = function(width, numx, numy) {
				scope.lineStyle = 'stroke-dasharray: ' + width + ' ' + (2 * width) + ';';
				var lines = [];

				var ht = width * Math.sqrt(3) / 2; //approx sqrt(3)
				var dx = width / 2;

				var i, path,
					offsety = 0,
					totalWidth = 3 * width * numx;

				var offsetFix = 1.7;

				for (i = 0; i < numy; i++) {
					//horizontal path 1
					path = new svgUtils.Path()
						.moveTo(-offsetFix, offsety)
						.lineTo(totalWidth, 0)
						.updateString();

					lines.push(path);

					//horizontal path 2
					path = new svgUtils.Path()
						.moveTo(dx + width - offsetFix, offsety + ht)
						.lineTo(totalWidth, 0)
						.updateString();

					lines.push(path);

					offsety += ht * 2;
				}

				var totalHeight = ht * numy * 2,
					totalDx = dx * numy * 2,
					offsetx = width * 2 - totalDx - width - dx;


				for (i = 0; i < numx + 2 * totalDx / (width * 3); i++) {
					if (offsetx < totalWidth) {
						//diagonal right 1
						path = new svgUtils.Path()
							.moveTo(offsetx, 0)
							.lineTo(totalDx, totalHeight)
							.updateString();

						lines.push(path);

						//diagonal right 2
						path = new svgUtils.Path()
							.moveTo(offsetx, ht * 2)
							.lineTo(totalDx, totalHeight)
							.updateString();

						lines.push(path);

						//diagonal right 3
						path = new svgUtils.Path()
							.moveTo(offsetx + dx + width, ht)
							.lineTo(totalDx, totalHeight)
							.updateString();

						lines.push(path);
					}

					if ((offsetx + totalDx) > totalDx) {
						//diagonal left 1
						path = new svgUtils.Path()
							.moveTo(offsetx - width, 0)
							.lineTo(-totalDx, totalHeight)
							.updateString();

						lines.push(path);

						//diagonal left 1
						path = new svgUtils.Path()
							.moveTo(offsetx - width, ht * 2)
							.lineTo(-totalDx, totalHeight)
							.updateString();

						lines.push(path);

						//diagonal left 3
						path = new svgUtils.Path()
							.moveTo(offsetx + dx, ht)
							.lineTo(-totalDx, totalHeight)
							.updateString();

						lines.push(path);
					}

					offsetx += width * 3;
				}

				scope.dashedLines = lines;

			};

			scope.makeHoneycomb = function(width, numx, numy) {

				var ht = width * 0.87; //approx sqrt(3)
				var dx = width / 2;

				var honeycomb = new svgUtils.Path();
				honeycomb.moveTo(0, 0);

				var i, j;
				for (j = 0; j < numy; j++) {
					honeycomb.moveTo(0, ht * (j - 1), true);
					if ((j % 2) === 0) {
						honeycomb.moveTo(-(width + dx), 0);
					}

					for (i = 0; i < numx; i++) {
						honeycomb.lineTo(dx, ht)
							.lineTo(width, 0)
							.lineTo(dx, -ht)
							.moveTo(width, 0);
					}
				}
				// console.log(honeycomb);
				honeycomb.updateString();
				return honeycomb;
			};

			scope.makeHoneycombLines = function(width, numx, numy) {
				var lines = [];
				var ht = width * 0.87; //approx sqrt(3)
				var dx = width / 2;

				var i, j, path;
				for (j = 0; j < numy; j++) {
					path = new svgUtils.Path();
					path.moveTo(0, ht * (j - 1), true);
					if ((j % 2) === 0) {
						path.moveTo(-(width + dx), 0);
					}

					for (i = 0; i < numx; i++) {
						path.lineTo(dx, ht)
							.lineTo(width, 0)
							.lineTo(dx, -ht)
							.moveTo(width, 0);
					}
					path.updateString();
					lines.push(path);
				}
				// console.log(lines);
				// console.log(honeycomb);
				// honeycomb.updateString();
				return lines;
			};

			scope.scale = 1;

			var initialScale = 0.4;

			var prevScale = 1;

			var startWidth = 9;

			// scope.honeycomb = scope.makeHoneycomb(startWidth, 40, 21);
			// 
			// scope.honeycombLines = scope.makeHoneycombLines(startWidth, 40, 21);


			var svg = element.find('svg');

			setTimeout(function() {
				var center = new svgUtils.Point(svg[0].offsetWidth / 2, svg[0].offsetHeight / 2);

				var numx = svg[0].offsetWidth / (startWidth * 3);
				var numy = svg[0].offsetHeight / (2 * startWidth * 0.86);
				numx /= initialScale;
				numy /= initialScale;
				// numx /= scope.scale;
				// numy /= scope.scale;
				// scope.makeHexagons(startWidth, center, numx, numy);
				scope.makeHoneycombDashedLines(startWidth, numx, numy);
				scope.$digest();
			}, 0);

			var maxScale = 20;

			scope.showImages = false;

			function updateTransform() {

				if (scope.scale < 1) {
					scope.scale = 1;
				}

				if (scope.scale >= maxScale) {
					scope.scale = maxScale;
					scope.showImages = true;
					clearInterval(zoomInterval);
				}

				var s = scope.scale;

				var x = svg[0].offsetWidth / initialScale / 2;
				var y = svg[0].offsetHeight / initialScale / 2;

				//(800-(s*800))
				scope.transform = 'scale(' + initialScale + ') matrix(' + s + ', 0, 0, ' + s + ', ' + (x - (s * x)) + ', ' + (y - (s * y)) + ')';

			}
			updateTransform();



			var zoomInterval = setInterval(function() {
				var dif = maxScale - scope.scale;
				var change = dif / 120;
				if (change < 0.15) {
					change = 0.15;
				}
				scope.scale += change;

				updateTransform();
				scope.$digest();
			}, 15);



			scope.imgWidth = 204.8 * 0.75;
			scope.imgHeight = 166.4 * 0.75;

			var edgeWidth = 70;


			function makeHexPath(edgeWidth, start) {
				var path = new svgUtils.Path();
				path.moveTo(start.x, start.y)
					.addLine(edgeWidth, 0)
					.addLine(edgeWidth, -Math.PI / 3)
					.addLine(edgeWidth, -Math.PI * 2 / 3)
					.addLine(edgeWidth, -Math.PI)
					.addLine(edgeWidth, -Math.PI * 4 / 3)
					.addLine(edgeWidth, -Math.PI * 5 / 3)
					.closePath();
				return path;
			}


			function makeHex(url, pos) {
				return {
					url: url,
					pos: pos.copy(),
					path: makeHexPath(edgeWidth, pos)
				};
			}

			scope.imgHexes = [];
			var imgPos = new svgUtils.Point(0, 23);

			imgPos.move(275, 0);
			scope.imgHexes.push(makeHex('images/img1.png', imgPos));

			imgPos.move(216, 0);
			scope.imgHexes.push(makeHex('images/img2.png', imgPos));

			imgPos.move(216, 0);
			scope.imgHexes.push(makeHex('images/img3.png', imgPos));

			imgPos.move(216, 0);
			scope.imgHexes.push(makeHex('images/img4.png', imgPos));


			scope.maskHexes = [];
			var maskPos = new svgUtils.Point(0, -40);
			var maskPos2;

			maskPos.move(170, 0);
			scope.maskHexes.push(makeHexPath(edgeWidth, maskPos));

			maskPos2 = maskPos.copy().move(0, 125);
			scope.maskHexes.push(makeHexPath(edgeWidth, maskPos2));

			scope.imgHexes.forEach(function() {
				maskPos.move(215.5, 0);
				scope.maskHexes.push(makeHexPath(edgeWidth, maskPos));

				maskPos2 = maskPos.copy().move(0, 125);
				scope.maskHexes.push(makeHexPath(edgeWidth, maskPos2));
			});


			var deselectImage = function() {
				element.find('.homeImagePopup').addClass('fadeOutFast');
				document.removeEventListener('click', deselectImage);

				setTimeout(function() {
					scope.selectedImage = '';
					scope.$digest();
				}, 480);
			};

			scope.clickedHex = function(hex) {
				scope.selectedImage = hex.url;
				setTimeout(function() {
					document.addEventListener('click', deselectImage);
				});
			};

			// svg.on('mousewheel', function(event) {
			// 	if (event.shiftKey) {
			// 		event.preventDefault();
			// 		var dy = event.originalEvent.wheelDeltaY;

			// 		scope.scale += dy / 1000;

			// 		updateTransform();

			// 		scope.$digest();

			// 	}

			// });



		}
	};
});
Boronite.app.directive('bnOurTeam', function() {
	return {
		restrict: 'C',
		templateUrl: 'ourTeam.html',
		link: function(scope) {
			scope.test = 'it worked!';

		}
	};
});
Boronite.app.directive('bnAbout', function() {
	return {
		restrict: 'C',
		templateUrl: 'about.html',
		link: function(scope) {}
	};
});
Boronite.app.directive('bnContactUs', function() {
	return {
		restrict: 'C',
		templateUrl: 'contactUs.html',
		link: function(scope) {
			scope.form = {};
		}
	};
});