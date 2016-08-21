var main = angular.module('MainModule');

var userController = function($rootScope, $scope, $window, $http) {
	if(loggedInState == 0) {
		$window.location.href = '#/';
	}

	cdate = new Date();
	$scope.messages = {
		welcome: "Welcome to the user page, " + $rootScope.loginData.username,
		actual: "",
		passNotEqual: "",
		wrongPass: "",
		changeResult: ""
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
	
	$scope.changePass = function() {
		var changeCredentials = {
				username: $rootScope.loginData.username,
				password: $scope.change.currentPass,
				newPass: $scope.change.newPass,
		};

		if (!checkEqual($scope.change.newPass, $scope.change.newPassVer)) {
			$scope.messages.changeResult = "";
			$scope.messages.passNotEqual = "Passwords do not match";
		}
		else {
			$scope.messages.passNotEqual = "";
			
			$http.post('/api/login', changeCredentials)
				.success(function(data) {
					if(data === '1') {
						$scope.messages.wrongPass = "";
						$http.post('/api/changePassword', changeCredentials)
							.success(function(data) {
								if(data === '1') {
									$scope.messages.changeResult = "Your password is successfully changed";
								}
								else {
									$scope.messages.changeResult = "Something went wrong, try again later";
								}
						});
					}
					else {
						$scope.messages.changeResult = "";
						$scope.messages.wrongPass = "Your password does not match your actual password";
					}
				}); 
		}
	}; 

	var checkEqual = function(first, second) {
		if(first === second) {
			return true;
		}
		else {
			return false;
		}
	};
};

main.controller('userController', ['$rootScope', '$scope', '$window', '$http', userController]);
