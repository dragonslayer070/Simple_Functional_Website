var main = angular.module('MainModule');

var resetSuccessController = function($scope, $window) {
	$scope.messages = {
		welcome: 'Password changed', 
		details: 'You have successfully changed your password'
	};

	$scope.returnHome = function() {
		$window.location.href = '/';
	};
};

main.controller('resetSuccessController', ['$scope', '$window', resetSuccessController]);