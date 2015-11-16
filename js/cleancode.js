		$(function () {

		    var tileSizePx,
		    totalNumTiles,
		    tileArray,
		    emptyTileX,
		    emptyTileY,
		    imagePath;

		    var tileObject = function (gx, gy) {

		        var rightGx = gx,
		            rightGy = gy,
		            // cssLeft & cssTop are the CSS tile position in px
		            cssLeft = gx * tileSizePx,
		            cssTop = gy * tileSizePx,
		            $tile = $("<div class='tile'></div>"),

		            that = {
		                $element: $tile,
		                gx: gx,
		                gy: gy,

		                move: function (newGx, newGy, animate) {
		                    that.gx = newGx;
		                    that.gy = newGy;
		                    tileArray[newGy][newGx] = that;
		                    if (animate) {
		                        $tile.animate({
		                            left: newGx * tileSizePx,
		                            top: newGy * tileSizePx
		                        }, 250);
		                    } else {
		                        $tile.css({
		                            left: newGx * tileSizePx,
		                            top: newGy * tileSizePx
		                        });
		                    }
		                },

		                checkRightPosition: function () {
		                    if (that.gx !== rightGx || that.gy !== rightGy) {
		                        return false;
		                    }
		                    return true;
		                }
		            };
		        // Set up the tile element's css properties.
		        $tile.css({
		            left: gx * tileSizePx + 'px',
		            top: gy * tileSizePx + 'px',
		            width: tileSizePx - 2 + 'px',
		            height: tileSizePx - 2 + 'px',
		            backgroundImage: 'url(' + imagePath + ')',
		            backgroundPosition: -cssLeft + 'px ' + -cssTop + 'px'
		        });

		        $tile.data('tileObject', that);

		        return that;
		    };

		    var checkRightPosition = function () {
		        var gy, gx;
		        for (gy = 0; gy < totalNumTiles; gy++) {
		            for (gx = 0; gx < totalNumTiles; gx++) {
		                if (!tileArray[gy][gx].checkRightPosition()) {
		                    return false;
		                }
		            }
		        }
		        return true;
		    };

		    var moveTile = function (tile, animate) {
		        var clickPosition, x, y, dir, t;

		        // move horizontally.
		        if (tile.gy === emptyTileY) {
		            clickPosition = tile.gx;
		            dir = tile.gx < emptyTileX ? 1 : -1;
		            for (x = emptyTileX - dir; x !== clickPosition - dir; x -= dir) {
		                t = tileArray[tile.gy][x];
		                t.move(x + dir, tile.gy, animate);
		            }
		            // set new position of an empty tile
		            emptyTileX = clickPosition;
		        }
		        // move vertically.
		        if (tile.gx === emptyTileX) {
		            clickPosition = tile.gy;
		            dir = tile.gy < emptyTileY ? 1 : -1;
		            for (y = emptyTileY - dir; y !== clickPosition - dir; y -= dir) {
		                t = tileArray[y][tile.gx];
		                t.move(tile.gx, y + dir, animate);
		            }
		            // set new position of an empty tile
		            emptyTileY = clickPosition;
		        }
		    };

		    // shuffle tiles randomly
		    var shuffle = function () {
		        var randIndex = Math.floor(Math.random() * (totalNumTiles - 1));
		        if (Math.floor(Math.random() * 2)) {
		            moveTile(tileArray[emptyTileX][(emptyTileY + 1 + randIndex) % totalNumTiles], false);
		        } else {
		            moveTile(tileArray[(emptyTileX + 1 + randIndex) % totalNumTiles][emptyTileY], false);
		        }
		    };

		    // initial setup
		    var setup = function () {
		        var x, y, i;
		        imagePath = "image1.jpg";
		        // create an bg to help solving the puzzle
		        $('#puzzle-help').css({
		            opacity: 0.2,
		            backgroundImage: 'url(' + imagePath + ')'
		        });
		        // save the solved image.
		        $('#puzzle-solved').attr("src", imagePath);
		        // clear the puzzle
		        $('.tile', $('#puzzle-frame')).remove();
		        // generate new puzzle
		        // every side is 4x4 = 16
		        totalNumTiles = 4;
		        tileSizePx = Math.ceil(280 / totalNumTiles);
		        emptyTileX = emptyTileY = totalNumTiles - 1;
		        tileArray = [];
		        for (y = 0; y < totalNumTiles; y++) {
		            tileArray[y] = [];
		            for (x = 0; x < totalNumTiles; x++) {
		                if (x === totalNumTiles - 1 && y === totalNumTiles - 1) {
		                    break;
		                }
		                var tile = tileObject(x, y);
		                tileArray[y][x] = tile;
		                $('#puzzle-frame').append(tile.$element);
		            }
		        }
		        // shuffle new puzzle
		        for (i = 0; i < 100; i++) {
		            shuffle();
		        }
		    };

		    var bindEvents = function () {
		        $('#puzzle-frame').bind('tap', function (evt) {
		            var $targ = $(evt.target);
		            if (!$targ.hasClass('tile')) return;
		            moveTile($targ.data('tileObject'), true);
		            if (checkRightPosition()) window.location = window.location.href.replace('#game', '#puzzle-solved-pop-up');
		        });

		        $('#play-button').bind('click', setup);
		    };
		    bindEvents();
		    setup();
		});