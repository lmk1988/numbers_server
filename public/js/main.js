
var app = angular.module('app', ['ngRoute', 'ngMessages', 'ngDialog', 'ui.bootstrap']);

app.config(function($locationProvider, $routeProvider) {

    //Fix route issue
    $locationProvider.hashPrefix('');

    $routeProvider
    .when('/profile', {
        templateUrl : '/html/template/profile.html'
    })
    .when('/contacts', {
        templateUrl : '/html/template/contacts.html'
    })
    .otherwise({
        redirectTo : '/profile'
    });
});

app.service('accessService', function($http, $window, $q){

    //jSend format

    var handleClientError = function(promise){
        return promise.catch(function(res){
            if(res && res.status && res.status == 403){
                console.log("forbiddened, could be expired token");
                $window.location.href = "/";
            }else{
                //Other error
                return $q.reject(res);
            }
        });
    }

    this.retrieveProfile = function(){
        return handleClientError($http.get("/api/users/profile"));
    }

    this.updateProfile = function(new_name){
        return handleClientError($http.put("/api/users/profile", { name : new_name }));
    };

    this.setNewPassword = function(new_password){
        return handleClientError($http.post("/api/users/change_password", { new_password : new_password }));
    };
});

app.controller('navCtrl', function($scope, $location, accessService) {
    $scope.isActive = function(path) {
        return (path === $location.path());
    };
});

app.controller('profileCtrl', function($scope, accessService, ModalHelper) {
    $scope.email = "";
    $scope.name = "";
    $scope.input_name = "";

    accessService.retrieveProfile()
    .then(function(profileRes){
        //Update values
        $scope.email = profileRes.data.data.email;
        $scope.name = profileRes.data.data.name;
        $scope.input_name = $scope.name;
    });

    this.saveProfile = function(){
        $scope.input_name = $scope.input_name.trim();

        if($scope.input_name){
            ModalHelper.showLoadingModal();
            accessService.updateProfile($scope.input_name)
            .then(function(profileRes){
                ModalHelper.closeLoadingModel();

                ModalHelper.showOKModal($scope, "Save Profile", "Profile saved")
                .closePromise
                .then(function(){
                    $scope.name = $scope.input_name
                });
            })
            .catch(function(err){
                ModalHelper.closeLoadingModel();
                ModalHelper.showOKModal($scope, "Save Profile", "Save Profile Error, please try again later");
            });
        }
    };
});

app.controller('passwordCtrl', function($scope, accessService, ModalHelper) {

    $scope.new_password = "";
    $scope.confirm_password = "";

    this.changePassword = function(){

        $scope.new_password = $scope.new_password.trim();
        $scope.confirm_password = $scope.confirm_password.trim();

        if($scope.new_password == $scope.confirm_password){

            ModalHelper.showLoadingModal();
            accessService.setNewPassword($scope.new_password)
            .then(function(passwordRes){
                ModalHelper.closeLoadingModel();

                ModalHelper.showOKModal($scope, "Change Password", "Password has been changed")
                .closePromise
                .then(function(){
                    //Remove old input
                    $scope.new_password = "";
                    $scope.confirm_password = "";
                });
            })
            .catch(function(err){
                ModalHelper.closeLoadingModel();
                ModalHelper.showOKModal($scope, "Change Password", "Password Change Error, please try again later");
            });
        }
    }
});

app.controller('contactsCtrl', function($scope, accessService, $http, $window, ModalHelper) {
    //TODO
});