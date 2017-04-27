
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

    this.getPhoneBoothData = function(){
        return handleClientError($http.get("/api/phone_booth"));
    };

    this.removePhoneBooth = function(phone_booth_id){
        return handleClientError($http.delete("/api/phone_booth/"+phone_booth_id));
    };

    this.addPhoneBooth = function(name, contact_num, contact_ext){
        return handleClientError($http.post("/api/phone_booth", { name : name, contact_num : contact_num, contact_ext : contact_ext }));
    };

    this.updatePhoneBooth = function(phone_booth_id, name, contact_num, contact_ext){
        var data = {};
        if(name){
            data.name = name;
        }
        if(contact_num){
            data.contact_num = contact_num;
        }
        if(contact_ext){
            data.contact_ext = contact_ext;
        }

        return handleClientError($http.put("/api/phone_booth/"+phone_booth_id, data));
    };
});

app.controller('navCtrl', function($scope, $location, accessService) {
    $scope.isActive = function(path) {
        return (path === $location.path());
    };
});

