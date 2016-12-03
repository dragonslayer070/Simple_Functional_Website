var main = angular.module('MainModule');

var aboutController = function($scope) {

$scope.messages = {
	welcome: "About",
	details: "This site is created for educational purposes. Expect to see random things added."
};

};

main.controller('aboutController', ['$scope', aboutController]);