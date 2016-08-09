var main = angular.module('MainModule', ['ngRoute']);

var mainController = function($rootScope, $scope, $window, $http) {
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
					$window.location.href = '#/user';
				}
			});
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

var settingsController = function($scope) {
	$scope.message = "Welcome to the settings page!";
};

var resetController = function($scope) {
	$scope.message = "Reset your password here!";
};

var userController = function($rootScope, $scope) {
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

};


main.controller('mainController', ['$rootScope', '$scope', '$window', '$http', mainController]);
main.controller('registerController', ['$scope', '$window', '$http', registerController]);
main.controller('settingsController', settingsController);
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
		templateUrl: '/partials/settings.html',
		controller: 'settingsController'
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