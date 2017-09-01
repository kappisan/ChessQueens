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

	}

	function randomFromArray(array) {
		var remInx = Math.floor(Math.random()*array.length);
		var remVal = array[remInx];
		array.splice(remInx, 1);
		return {val: remVal, array: array}
	}

	$s.renderBoard($s.boardSize);

}]);


