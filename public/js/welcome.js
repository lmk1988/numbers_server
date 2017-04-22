
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
    .otherwise({
        redirectTo : '/login'
    });

});

var loadingModalOption = {
    message: "<p><i class='fa fa-spin fa-spinner'></i> Loading...</p>"
};

app.service('ModalHelper', function(ngDialog){
    this.showOKModal = function(scope, title, body){

        var childScope = scope.$new();
        childScope.title = title;
        childScope.body = body;

        return ngDialog.open({
            template    : '/html/template/modal_ok.html',
            className   : 'ngdialog-theme-default',
            scope       : childScope,
            showClose   : false
        });
    }

    var currentLoadingDialog = null;

    this.showLoadingModal = function(){
        if(!currentLoadingDialog){
            currentLoadingDialog = ngDialog.open({
                template        : '/html/template/modal_loading.html',
                className       : 'ngdialog-theme-default',
                showClose       : false,
                closeByEscape   : false,
                closeByDocument : false,
            });
        }
    }

    this.closeLoadingModel = function(){
        if(currentLoadingDialog){
            currentLoadingDialog.close();
            currentLoadingDialog = null;
        }
    }
});

app.controller('loginCtrl', function($scope, $http, $location, ModalHelper) {

    $scope.email = "";
    $scope.password = "";

    $scope.login = function(){
        $scope.email = $scope.email.trim();
        $scope.password = $scope.password.trim();

        if($scope.email && $scope.password){

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
                    //TODO take access token to login to main
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
        $scope.email = $scope.email.trim();
        $scope.password = $scope.password.trim();
        $scope.confirm_password = $scope.confirm_password.trim();

        if($scope.email && $scope.password && $scope.password == $scope.confirm_password){

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