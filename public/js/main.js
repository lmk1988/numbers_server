
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

app.service('profileService', function(accessService, $q){

    var profile = {
        email : "",
        name : ""
    };

    accessService.retrieveProfile()
    .then(function(profileRes){
        //Update values
        profile.email = profileRes.data.data.email;
        profile.name = profileRes.data.data.name;
    });

    this.getProfile = function(){
        if(profile.email.length == 0){
            return accessService.retrieveProfile()
            .then(function(profileRes){
                //Update values
                profile.email = profileRes.data.data.email;
                profile.name = profileRes.data.data.name;
                return profile;
            });
        }else{
            return $q.resolve(profile);
        }
    };

    this.saveProfile = function(new_name){
        new_name = new_name.trim();

        if(new_name){
            return accessService.updateProfile(new_name)
            .then(function(profileRes){
                profile.name = new_name;
            });
        }else{
            return $q.reject(new Error("invalid new_name"));
        }
    };

    //Run to retrieve data
    this.getProfile();
});

app.service('contactService', function(accessService){
    //Stores phone_booth_id and data
    var contact_data = {};


});

app.controller('navCtrl', function($scope, $location, accessService) {
    $scope.isActive = function(path) {
        return (path === $location.path());
    };
});

app.controller('profileCtrl', function($scope, profileService, ModalHelper) {
    $scope.email = "";
    $scope.input_name = "";

    profileService.getProfile()
    .then(function(profile){
        $scope.email = profile.email;
        $scope.input_name = profile.name;
    });

    this.saveProfile = function(){
        $scope.input_name = $scope.input_name.trim();

        if($scope.input_name){
            ModalHelper.showLoadingModal();
            profileService.saveProfile($scope.input_name)
            .then(function(){
                ModalHelper.closeLoadingModel();
                ModalHelper.showOKModal($scope, "Save Profile", "Profile saved");
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