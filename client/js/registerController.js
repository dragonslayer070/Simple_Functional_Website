var main = angular.module('MainModule');


var registerController = function($scope, $window, $http) {
	$scope.registerData = {};
	$scope.messages = {
		welcome:"Welcome to the register page!",
		wrong_pass : "Your passwords don't match, try again"
	}; 

	$scope.passwordCheck = function() {
		if($scope.registerData.password === $scope.registerData.passwordVer) {
			register();
		}
		else{
			window.alert($scope.messages.wrong_pass);
		}
	};

	var register = function() {
		$http.post('/api/register', $scope.registerData)
			.success(function(data) {
				$scope.registerData = data;
			});
		$window.location.href = '#/user';
	};
};

main.controller('registerController', ['$scope', '$window', '$http', registerController]);