
var app = angular.module('app', ['ngRoute', 'ngMessages']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl : '/html/template/login.html'
    })
    .when('/register', {
        templateUrl : '/html/template/register.html'
    })
    .otherwise({
        redirectTo : '/login'
    });
});

app.controller('loginCtrl', function($scope, $http, $location) {

    $scope.email = "";
    $scope.password = "";

    $scope.login = function(){
        if($scope.email && $scope.password){

            var data = {
                email : $scope.email,
                password : $scope.password
            };

            $http.post('/login', data)
            .then(function successCallback(response) {
                //TODO
                console.log(response);
                console.log(response.data);
            })
            .catch(function(err){
                //TODO
            });

        }else{
            console.log("invalid login parameters");
        }
    };
});

app.controller('registerCtrl', function($scope, $http, $location) {

    $scope.email = "";
    $scope.password = "";
    $scope.confirm_password = "";

    $scope.register = function(){
        if($scope.email && $scope.password && $scope.password == $scope.confirm_password){

            var data = {
                email : $scope.email,
                password : $scope.password
            };
            
            $http.post('/register', data)
            .then(function successCallback(response) {
                //TODO
                console.log(response);
                console.log(response.data);
            })
            .catch(function(err){
                //TODO
            });
        }else{
            console.log("invalid register parameters");
        }
    };
});