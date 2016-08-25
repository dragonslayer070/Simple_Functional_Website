var main = angular.module('MainModule');

var forgotSuccessController = function($scope) {
	$scope.messages = {
		welcome: 'Password reset request',
		details: 'Please check your email for instruction on how to reset your password'
	};
}

main.controller('forgotSuccessController', ['$scope', forgotSuccessController]);