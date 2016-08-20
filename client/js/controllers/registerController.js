var main = angular.module('MainModule');


var registerController = function($rootScope, $scope, $window, $http) {
	$scope.registerData = {};
	$scope.messages = {
		welcome:"Welcome to the register page!",
		wrong_user: "",
		wrong_pass: "",
		wrong_email: ""
	}; 

	$scope.passwordCheck = function() {
		if($scope.registerData.password === $scope.registerData.passwordVer) {
			$scope.messages.wrong_pass = "";
			register();
		}
		else{
			$scope.messages.wrong_pass = "Your passwords don't match, try again.";
		}
	};

	var register = function() {
		$http.post('/api/register', $scope.registerData)
			.success(function(data) {
				if(data === '0') {
					$scope.messages.wrong_user = "Username is already in use. Try another one.";
				}

				else if(data === '0.1') {
					$scope.messages.wrong_email = "Email is already in use. Try another one.";
				}

				else if(data === '0.3') {
					$window.location.href = '#/verification';
				}

				/*
				else {
					$scope.messages.wrong_user = "";
					loggedInState = 1;
					$rootScope.loginData = $scope.registerData;
					$window.location.href = '#/user';
				}
				*/
		});
	};
};

main.controller('registerController', ['$rootScope', '$scope', '$window', '$http', registerController]);