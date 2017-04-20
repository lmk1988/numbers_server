
var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl : 'template/login.html'
    })
    .when('/register', {
        templateUrl : 'template/register.html'
    })
    .otherwise({
        redirectTo : '/login'
    });
});

app.controller('loginCtrl', function($scope) {
    $scope.login = function(){
        //TODO
        console.log("test login");
    };
});

app.controller('registerCtrl', function($scope) {
    $scope.register = function(){
        //TODO
        console.log("test register");
    };
});