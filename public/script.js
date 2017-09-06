var app = angular.module('app', ['ngRoute'])
	.config( ['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', { templateUrl: 'templates/home.html' })	
			.otherwise({ redirectTo: '/' });
	}]);

/** 
	QUEEN CODES
	0 BLANK
	1 QUEEN
	2 ATTACKING QUEEN
**/


// CONTROLLERS
app.controller('PageCtrl', ['$scope', '$http', '$location', function($s, $http, $location) {

	console.log("page controller", $location.$$path);
	$s.boardSize = 8;
	$s.timeTaken = 0;

	$s.numberQueens = 0;

	function countQueens() {

		$s.numberQueens = 0;
		for(var x = 0; x < $s.boardSize; x++) {
			for(var y = 0; y < $s.boardSize; y++) {
				if ($s.board[x][y] === "1") {
					$s.numberQueens++;
				}
			}
		}
	}

	$s.clear = function(size) {
		$s.renderBoard();
		$s.numberGuesses = 0;
		$s.timeTaken = 0;
	}

	$s.renderBoard = function(size) {
		size = size || $s.boardSize;
		$s.boardSize = size;
		$s.board = [];
		columnIndexes = [];

		for(var x = 0; x < size; x++) {
			$s.board[x] = [];
			columnIndexes.push(x);
			for(var y = 0; y < size; y++) {
				$s.board[x].push("0");
			}
		}
		// console.log("$s.board", $s.board);
	}

	$s.toggleQueen = function(row, column) {
		if ($s.board[row][column] === "1" || $s.board[row][column] === "2") {
			$s.board[row][column] = "0";
		} else {
			$s.board[row][column] = "1";
		}
		checkEntireBoard();
		countQueens();
	}

	var start = new Date();
	$s.numberGuesses = 0;
	$s.startTimer = function() {
		start = new Date();
		$s.numberGuesses = 0;
	}

	$s.startGuessing = function() {
		try {
			guess();
		} catch(e) {
			console.log("couldn't find it");
			$s.renderBoard();
            swal({
                title: "Error",
                type: "error",
                text: "Ran out of memory looking for solution!",
                timer: 3000,
                showConfirmButton: false
            });
		}
		countQueens();
	}

	function checkEntireBoard() {

		// ROWS
		for(var i = 0; i < $s.boardSize; i++) {
			// turn all previous red green
			$s.board[i] = _.map($s.board[i], function(s) {
				if(s === "1" || s === "2") { return "1"; }
				return "0";
			});
			if(queensInArray($s.board[i]) > 1) {
				// console.log('row conflict');
				$s.board[i] = _.map($s.board[i], function(s) {
					if(s === "1" || s === "2") { return "2"; }
					return "0";
				});
			}
		}

		// COLUMNS
		for(var x = 0; x < $s.boardSize; x++) {
			var columnArray = [];
			for(var y = 0; y < $s.boardSize; y++) {
				columnArray.push($s.board[y][x]);	
			}
			// console.log("columnArray", queensInArray(columnArray), columnArray);
			if(queensInArray(columnArray) > 1) {
				console.log("column conflict");
				
				for(var y = 0; y < $s.boardSize; y++) {
					if($s.board[y][x] == "1" || $s.board[y][x] == "2") {
						$s.board[y][x] = "2";
					}
				}
			}
		}

		// DIAGONALS 1 BOTTOM LEFT TO TOP RIGHT
		var d1 = diagonal($s.board, false);
		d1.forEach(function(string, index) {
			var occurences = string.length - string.replace(/1/g, "").length;

			if(occurences > 1) { 
				console.log("conflict!", index);
				var cursor;
				if(index < $s.boardSize) {
					// console.log("top left corner");
					cursor = index;
					for(var i = 0; i <= index; i++) {
						console.log("turn square", i, cursor);
						if($s.board[i][cursor] != "0") { $s.board[i][cursor] = "2"; }
						cursor--;
					}
				} else {
					console.log("bottom right corner");
					cursor = $s.boardSize - 1;
					var diff = (($s.boardSize * 2) - 2) - index;
					for(var i = (index - $s.boardSize) + 1; i <= (index - $s.boardSize) + 1 + diff; i++) {
						// console.log("turn square", cursor, i);
						if($s.board[i][cursor] != "0") { $s.board[i][cursor] = "2"; }
						cursor--;
					}
				}
			}
		});

		// DIAGONALS 2 BOTTOM RIGHT TO TOP LEFT
		console.log("diagonal 2");
		var d2 = diagonal($s.board, true);
		d2.forEach(function(string, index) {
			var occurences = string.length - string.replace(/1/g, "").length;

			if(occurences > 1) { 
				console.log("conflict!", index);
				var cursor;
				if(index < $s.boardSize) {
					console.log("bottom left corner");
					cursor = index;
					for(var i = 0; i <= index; i++) {
						console.log("turn square", ($s.boardSize - i) - 1, cursor);
						if($s.board[($s.boardSize - i) - 1][cursor] != "0") { $s.board[($s.boardSize - i) - 1][cursor] = "2"; }
						cursor--;
					}
				} else {
					console.log("top right corner");
					cursor = index - $s.boardSize;
					var diff = (($s.boardSize * 2) - 2) - index;
					for(var i = 0; i <= diff; i++) {
						cursor++;
						console.log("turn square", i, cursor);
						if($s.board[i][cursor] != "0") { $s.board[i][cursor] = "2"; }
					}
				}
			}
		});
	}

	function guess() {

		$s.renderBoard();
		$s.numberGuesses++;

		var size = columnIndexes.length;
		var indexes = columnIndexes;

		for(var x = 0; x < size; x++) {
			
			var nextIndex = randomFromArray(indexes);
			indexes = nextIndex.array;
			var num = nextIndex.val;
			// console.log(x, num);
			$s.board[x][num] = "1";
		}

		check();
		var end = new Date();
		$s.timeTaken = (end - start) / 1000;
	}

	function check() {
		var d1 = diagonal($s.board, false);
		var d2 = diagonal($s.board, true);
		// console.log("check diagonal", d1, d2);

		var passed = true;

		d1.forEach(function(string) {
			var occurences = string.length - string.replace(/1/g, "").length;
			if(occurences > 1) { passed = false; }
		});

		d2.forEach(function(string) {
			var occurences = string.length - string.replace(/1/g, "").length;
			if(occurences > 1) { passed = false; }
		});

		if(!passed) { return guess(); }

		return console.log("Solution Found!", passed);
	}

	function diagonal(array, bottomToTop) {
	    var Ylength = array.length;
	    var Xlength = array[0].length;
	    var maxLength = Math.max(Xlength, Ylength);
	    var temp;
	    var returnArray = [];
	    for (var k = 0; k <= 2 * (maxLength - 1); ++k) {
	        temp = [];
	        for (var y = Ylength - 1; y >= 0; --y) {
	            var x = k - (bottomToTop ? Ylength - y : y);
	            if (x >= 0 && x < Xlength) {
	                temp.push(array[y][x]);
	            }
	        }
	        if(temp.length > 0) {
	            returnArray.push(temp.join(''));
	        }
	    }
	    return returnArray;
	}

	function randomFromArray(array) {
		var remInx = Math.floor(Math.random()*array.length);
		var remVal = array[remInx];
		array.splice(remInx, 1);
		return {val: remVal, array: array}
	}

	function queensInArray(array) {
	    var count = 0;
	    for (var i = 0; i < array.length; i++) {
	        if (array[i] === "1" || array[i] === "2") {
	            count++;
	        }
	    }
	    return count;
	}

	$s.renderBoard($s.boardSize);

}]);
