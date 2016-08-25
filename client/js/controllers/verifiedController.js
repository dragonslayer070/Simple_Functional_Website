var main = angular.module('MainModule');

var verifiedController = function($scope, $window) {
	$scope.messages = {
		welcome: 'Success!',
		verified: 'You have been successfully verified'
	};

	$scope.returnHome = function() {
		$window.location.href = '#/';
	};
};

main.controller('verifiedController', ['$scope', '$window', verifiedController]);