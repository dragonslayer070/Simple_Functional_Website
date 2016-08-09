var main = angular.module('MainModule', ['ngRoute']);

var mainController = function($rootScope, $scope, $window, $http) {
	$rootScope.loginData = {};

	$scope.messages = {
		welcome:"Welcome to the home page!",
		register: "Register!"
	};
	$scope.register = function() {
		$window.location.href = '#/register';
	};
	$scope.submit = function() {
		$http.post('/api/login', $scope.loginData)
			.success(function(data) {
				$scope.loginData = data;
			});
		$window.location.href = '#/user';
	};
};

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

var loginController = function($scope) {
	$scope.message = "Welcome to the login page!";
};

var resetController = function($scope) {
	$scope.message = "Reset your password here!";
};

var userController = function($rootScope, $scope) {
	$scope.messages = {
		welcome: "Welcome to the user page, " + $rootScope.loginData.username
	};

};


main.controller('mainController', ['$rootScope', '$scope', '$window', '$http', mainController]);
main.controller('registerController', ['$scope', '$window', '$http', registerController]);
main.controller('loginController', loginController);
main.controller('resetController', resetController);
main.controller('userController', ['$rootScope', '$scope', userController]);


main.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/partials/homepage.html',
		controller: 'mainController'
	})
	.when('/register', {
		templateUrl: '/partials/register.html',
		controller: 'registerController'
	})
	.when('/login', {
		templateUrl: '/partials/login.html',
		controller: 'loginController'
	}) 
	.when('/reset', {
		templateUrl: '/partials/reset.html',
		controller: 'resetController'
	})
	.when('/user', {
		templateUrl: '/partials/user.html',
		controller: 'userController'
	})
	.otherwise({
		redirectTo: '/'
	});
});