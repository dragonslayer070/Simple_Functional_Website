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
	.when('/forgot', {
		templateUrl: '/partials/forgot_password.html',
		controller: 'forgotController'
	})
	.when('/forgot_success', {
		templateUrl: '/partials/forgot_success.html',
		controller: 'forgotSuccessController'
	})
	.when('/reset/:token', {
		templateUrl: '/partials/reset_password.html', 
		controller: 'resetController'
	})
	.when('/reset_success', {
		templateUrl: '/partials/reset_success.html',
		controller: 'resetSuccessController'
	})
	.otherwise({
		redirectTo: '/'
	});
});