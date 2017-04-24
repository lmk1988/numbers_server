
var app = angular.module('app', ['ngRoute', 'ngMessages', 'ngDialog']);

app.config(function($locationProvider) {

    //Fix route issue
    $locationProvider.hashPrefix('');

});

app.service('accessService', function(){
    //Grab access token from url and hide it
    this.access_token = $location.search().access_token;
    $location.search({});
});

});