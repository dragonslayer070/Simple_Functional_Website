var main = angular.module('MainModule');

var contactController = function($scope) {

$scope.messages = {
	welcome: "Contact",
	details: "If you have any questions or suggestions, you can contact me by email or by GitHub"
};

$scope.myInfo = {
	name: "Kaan Yilmaz",
	email: "simple.website.ky@gmail.com",
	github: "dragonslayer070"
};

};

main.controller('contactController', ['$scope', contactController]);