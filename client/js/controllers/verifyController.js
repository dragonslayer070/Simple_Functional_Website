var main = angular.module('MainModule');

var verifyController = function($scope) {
	$scope.messages = {
		welcome: 'Verify your email',
		check: 'Please check your email and click on the sent verification url',
		done: 'When done, you can login with your account'
	};

};

main.controller('verifyController', ['$scope', verifyController]);