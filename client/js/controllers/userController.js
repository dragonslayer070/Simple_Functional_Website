var main = angular.module('MainModule');

var userController = function($rootScope, $scope, $window) {
	if(loggedInState == 0) {
		$window.location.href = '#/';
	}

	cdate = new Date();
	$scope.messages = {
		welcome: "Welcome to the user page, " + $rootScope.loginData.username,
		actual: ""
	};

	var	morning = "Enjoy your morning!";
	var	afternoon = "Enjoy your afternoon!";
	var	evening = "Enjoy your evening!";
	var	night = "Enjoy your night!";
	
	if(cdate.getHours() >= 0 && cdate.getHours() < 6) {
		$scope.messages.actual = night; 
	}
	if(cdate.getHours() >= 6 && cdate.getHours() < 12) {
		$scope.messages.actual = morning; 
	}
	if(cdate.getHours() >= 12 && cdate.getHours() < 18) {
		$scope.messages.actual = afternoon; 
	}
	if(cdate.getHours() >= 18 && cdate.getHours() < 24) {
		$scope.messages.actual = evening; 
	}

	$scope.logOut = function() {
		loggedInState = 0;
		$window.location.href = '#/';
	};
};

main.controller('userController', ['$rootScope', '$scope', '$window', userController]);
