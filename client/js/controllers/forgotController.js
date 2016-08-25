var main = angular.module('MainModule');

var forgotController = function($scope, $http, $window) {
	$scope.messages = {
		welcome: 'Forgot password',
		details: 'Here you can reset your password',
		not_found: ""
	};

	$scope.forgotPassword = function() {
		$http.post('/api/forgot', $scope.forgotData)
			.success(function(data) {
				if(data === '1') {
					$window.location.href = '#/forgot_success';
				}
				else {
					$scope.messages.not_found = "Email not found";
				}
			});
	};

	$scope.return = function() {
		$window.location.href = '#/';
	};
};

main.controller('forgotController', ['$scope', '$http', '$window', forgotController]);