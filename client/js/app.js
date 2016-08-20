var main = angular.module('MainModule', ['ngRoute']);


//assign global variables here
var loggedInState = 0;


//router
main.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/partials/homepage.html',
		controller: 'homeController'
	})
	.when('/register', {
		templateUrl: '/partials/register.html',
		controller: 'registerController'
	})
	.when('/user', {
		templateUrl: '/partials/user.html',
		controller: 'userController'
	})
	.when('/verification', {
		templateUrl: '/partials/verify.html',
		controller: 'verifyController'
	})
	.when('/success_verified', {
		templateUrl: '/partials/success_verified.html',
		controller: 'verifiedController'
	})
	.otherwise({
		redirectTo: '/'
	});
});