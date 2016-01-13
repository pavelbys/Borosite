(function() {
	var items = [{
		src: 'images/img1.png',
		w: 500,
		h: 700
	}, {
		src: 'images/img2.png',
		w: 500,
		h: 700
	}, {
		src: 'images/img2.png',
		w: 500,
		h: 700
	}, {
		src: 'images/img2.png',
		w: 500,
		h: 700
	}, {
		src: 'images/img2.png',
		w: 500,
		h: 700
	}, {
		src: 'images/img2.png',
		w: 500,
		h: 700
	}, {
		src: 'images/img2.png',
		w: 500,
		h: 700
	}];

	for (var i = 0; i < items.length; i++) {
		var img = new Image();
		img.src = items[i].src;
		img.index = i;
		items[i].myImg = img;
	}

	// var hexagonGrid = new HexagonGrid("HexCanvas", 40);
	// hexagonGrid.drawHexGrid(10, 20, -50, -50, false);
	var sin60 = Math.sqrt(3) / 2;

	function getHexSettings(width, height, radius) {
		var cX = width / 2,
			cY = height / 2;
		var avgRadius = radius * 1.5;
		var halfNumCols = Math.ceil(cX / avgRadius);
		if (halfNumCols % 2 !== 0) {
			halfNumCols++;
		}
		var numColumns = halfNumCols * 2 + 1;
		var totalWidth = (halfNumCols * avgRadius + radius) * 2;
		var vertRadius = sin60 * radius;
		var halfYRadii = cY / vertRadius - 1;
		var halfRows = Math.ceil(halfYRadii / 2);
		var numRows = halfRows * 2 + 1;
		return {
			columns: numColumns,
			rows: numRows,
			topLeft: {
				x: cX - totalWidth / 2,
				y: cY - numRows * vertRadius
			}
		};
	}
	var r = 7;
	var hexagonGrid = new HexagonGrid("HexCanvas", r);
	var canvas = document.getElementById("HexCanvas");
	var ctx = canvas.getContext("2d");
	var hexInt = setInterval(function() {
		var hexSettings = getHexSettings(canvas.width, canvas.height, r);
		if (r < 80) {
			// console.log(canvas.width, canvas.height);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			hexagonGrid.setRadius(r);
			hexagonGrid.drawHexGrid(hexSettings.rows, hexSettings.columns, hexSettings.topLeft.x, hexSettings.topLeft.y);
			// hexagonGrid.drawHexGrid(hexSettings.rows, 50, 0, hexSettings.topLeft.y, true);
			r *= 1.015;
		} else {
			clearInterval(hexInt);
			var middleRow = Math.floor(hexSettings.rows / 2);

			for (var i = 0; i < hexSettings.columns; i += 2) {
				hexagonGrid.drawHexAtColRow(i, middleRow, null, items[(i) / 2].myImg);

			}
		}
	}, 17);



	function openPhotoSwipe(col, row) {
		var hexSettings = getHexSettings(canvas.width, canvas.height, r);

		var middleRow = Math.floor(hexSettings.rows / 2);

		if (row !== middleRow || col % 2 !== 0) {
			return;
		}

		var pswpElement = document.querySelectorAll('.pswp')[0];
		// build items array

		// define options (if needed)
		var options = {
			// history & focus options are disabled on CodePen
			history: false,
			focus: false,
			showAnimationDuration: 0,
			hideAnimationDuration: 0
		};
		var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
		gallery.goTo(col / 2);


	}


	// openPhotoSwipe();
	// document.getElementById('btn').onclick = openPhotoSwipe;
}());