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
				else {
					$scope.messages.wrongPass = "";
					loggedInState = 1;
					$window.location.href = '#/user';
				}
			});
	};
};

main.controller('homeController', ['$rootScope', '$scope', '$window', '$http', homeController]);