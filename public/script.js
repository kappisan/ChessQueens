var app = angular.module('app', ['ngRoute'])
	.config( ['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', { templateUrl: 'templates/home.html' })	
			.otherwise({ redirectTo: '/' });
	}]);


// CONTROLLERS
app.controller('PageCtrl', ['$scope', '$http', '$location', function($s, $http, $location) {

	console.log("page controller", $location.$$path);
	$s.boardSize = 4;

	$s.renderBoard = function(size) {
		size = size || $s.boardSize;
		$s.boardSize = size;
		$s.board = [];
		$s.columnIndexes = [];

		for(var x = 0; x < size; x++) {
			$s.board[x] = [];
			$s.columnIndexes.push(x);
			for(var y = 0; y < size; y++) {
				$s.board[x].push("0");
			}
		}

		console.log("$s.board", $s.board);
		console.log("$s.columnIndexes", $s.columnIndexes);
	}

	$s.guess = function() {

		$s.renderBoard();

		console.log("guessing $s.board", $s.board);
		var size = $s.columnIndexes.length;
		var indexes = $s.columnIndexes;


		console.log("indexes", indexes);

		for(var x = 0; x < size; x++) {
			
			var nextIndex = randomFromArray(indexes);
			console.log("nextIndex;", nextIndex);
			indexes = nextIndex.array;
			var num = nextIndex.val;
			console.log(x, num);
			$s.board[x][num] = "1";
		}

		$s.check();
	}

	$s.check = function() {
		console.log("check board", $s.board);
		var d1 = diagonal($s.board, false);
		var d2 = diagonal($s.board, true);

		console.log("check diagonal", d1, d2);

		var passed = true;

		d1.forEach(function(string) {
			var occurences = string.length - string.replace(/1/g, "").length;
			console.log(string, occurences);
			if(occurences > 1) { passed = false; }
		});

		d2.forEach(function(string) {
			var occurences = string.length - string.replace(/1/g, "").length;
			console.log(string, occurences);
			if(occurences > 1) { passed = false; }
		});

		console.log("have I passed?", passed);

		if(!passed) { $s.guess(); }

		return;
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

	$s.renderBoard($s.boardSize);

}]);


