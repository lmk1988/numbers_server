
var app = angular.module('app', ['ngRoute', 'ngMessages', 'ngDialog']);

app.config(function($locationProvider, $routeProvider) {

    //Fix route issue
    $locationProvider.hashPrefix('');

    $routeProvider
    .when('/login', {
        templateUrl : '/html/template/login.html'
    })
    .when('/register', {
        templateUrl : '/html/template/register.html'
    })
    .when('/forgotpassword', {
        templateUrl : '/html/template/forgot_password.html'
    })
    .otherwise({
        redirectTo : '/login'
    });

});

app.controller('loginCtrl', function($scope, $http, $window, ModalHelper) {

    $scope.email = "";
    $scope.password = "";

    $scope.login = function(){

        if($scope.email && $scope.password){

            $scope.email = $scope.email.trim();
            $scope.password = $scope.password.trim();

            //Overlay loading modal
            ModalHelper.showLoadingModal();

            var options = {
                method: "post",
                url : "/oauth/token",
                data: "grant_type=password&username="+$scope.email+"&password="+$scope.password,
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded",
                    "Authorization" : "Basic cTQzOGRnNTFqMjM1dHN3ZzUzOmZkYWZiODIzajQ1bW1ibGRzODkzNGtqcw=="
                }
            }

            $http(options)
            .then(function successCallback(response) {
                ModalHelper.closeLoadingModel();

                if(response.data && response.data.access_token){
                    //Take access token to login to main
                    $window.location.href = "/main?access_token="+response.data.access_token;
                }else{
                    throw new Error("unhandled response");
                }
            })
            .catch(function(err){
                ModalHelper.closeLoadingModel();

                if(err && err.status == 400){
                    ModalHelper.showOKModal($scope, "Login", "Wrong email/password");
                }else{
                    ModalHelper.showOKModal($scope, "Login", "Login Error, please try again");
                }
            });

        }else{
            console.log("invalid login parameters");
            //Not required to show modal
        }
    };
});

app.controller('registerCtrl', function($scope, $http, $location, ModalHelper) {

    $scope.email = "";
    $scope.password = "";
    $scope.confirm_password = "";

    $scope.register = function(){

        if($scope.email && $scope.password && $scope.password == $scope.confirm_password){

            $scope.email = $scope.email.trim();
            $scope.password = $scope.password.trim();
            $scope.confirm_password = $scope.confirm_password.trim();

            //Overlay loading modal
            ModalHelper.showLoadingModal();

            var data = {
                email : $scope.email,
                password : $scope.password
            };

            $http.post('api/users/register', data)
            .then(function successCallback(response) {
                ModalHelper.closeLoadingModel();

                ModalHelper.showOKModal($scope, "Register", "Registration was successful, please login")
                .closePromise
                .then(function(){
                    //Switch Route to login when pressed ok
                    $location.path('/login')
                });
            })
            .catch(function(err){
                ModalHelper.closeLoadingModel();

                if(err && err.status == 409){
                    ModalHelper.showOKModal($scope, "Register", "Email already registered, please login")
                    .closePromise
                    .then(function(){
                        //Switch Route to login when pressed ok
                        $location.path('/login')
                    });
                }else{
                    ModalHelper.showOKModal($scope, "Register", "Registration Error, please try again");
                }
            });
        }else{
            console.log("invalid register parameters");
            //Not required to show modal
        }
    };
});

app.controller("forgotPasswordCtrl", function($scope, $http, $location, ModalHelper) {
    $scope.email = "";

    $scope.forgotPassword = function(){

        if($scope.email){
            $scope.email = $scope.email.trim();

            //Overlay loading modal
            ModalHelper.showLoadingModal();

            var data = {
                email : $scope.email
            };

            $http.post('api/users/reset_password', data)
            .then(function successCallback(response) {
                ModalHelper.closeLoadingModel();

                ModalHelper.showOKModal($scope, "Reset Password", "An email has been sent for you to reset your password");
            })
            .catch(function(err){
                ModalHelper.closeLoadingModel();

                if(err && err.status == 404){
                    ModalHelper.showOKModal($scope, "Reset Password", "Email does not exist, please register")
                    .closePromise
                    .then(function(){
                        //Switch Route to register when pressed ok
                        $location.path('/register')
                    });
                }else{
                    ModalHelper.showOKModal($scope, "Reset Password", "Reset Password Error, please try again");
                }
            });
        }
    }
});