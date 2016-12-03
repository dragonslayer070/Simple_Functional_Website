var main = angular.module('MainModule');

var homeController = function($rootScope, $scope, $window, $http) {
	$rootScope.loginData = {};

	$scope.messages = {
		welcome:"Welcome to the home page!",
		register: "Register!",
		wrongPass: ""
	};

	$scope.register = function() {
		$window.location.href = '#/register';
	};
	$scope.submit = function() {
		$http.post('/api/login', $scope.loginData)
			.success(function(data) {
				if(data === '0') {
					$scope.messages.wrongPass = "Wrong username/password combination";
				}
				if(data === '1') {
					$scope.messages.wrongPass = "";
					loggedInState = 1;
					$window.location.href = '#/user';
				}
			});
	};
	$scope.forgot = function() {
		$window.location.href = '#/forgot';
	}
};

main.controller('homeController', ['$rootScope', '$scope', '$window', '$http', homeController]);
