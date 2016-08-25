var main = angular.module('MainModule');

var resetController = function($scope, $window, $routeParams, $http) {
	$scope.messages = {
		welcome: 'Reset password',
		details: 'You can reset your password below',
		passNotEqual: "",
		changeResult: ""
	};
	
	var userToken = {
		token: $routeParams.token
	};

	$scope.changePass = function() {
		if (!checkEqual($scope.change.newPass, $scope.change.newPassVer)) {
			$scope.messages.passNotEqual = "Passwords do not match";
		}
		else {
			$scope.messages.passNotEqual = "";
			
			$http.post('/api/checkToken', userToken)
				.success(function(data) {
					if(data === '0' || data == undefined) {
						$window.location.href = '#/forgot';
					}
					else {
						console.log('Email is: ' + data);
						var changeCredentials = {
							email: data,
							newPass: $scope.change.newPass,
						};

						$http.post('/api/changePassword', changeCredentials)
							.success(function(data) {
								if(data === '1') {
									sendConfirmationEmail(changeCredentials);
									$window.location.href = '#/reset_success';
								}
								else {
									$scope.messages.changeResult = "Something went wrong, try again later";
								}
						});
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

	var sendConfirmationEmail = function(details) {
		$http.post('/api/confirmChange', details)
			.success(function(data) {
			});
	}
};

main.controller('resetController', ['$scope', '$window', '$routeParams', '$http', resetController]);